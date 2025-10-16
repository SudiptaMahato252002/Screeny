'use server'

import { headers } from "next/headers"
import { auth } from "../auth"
import { apiFetch, buildWithUserQuery, doesTitleMatch, getEnv, getOrderByClause, withErrorHandling } from "../utils"
import { BUNNY } from "@/constants"
import { db } from "@/drizzle/db"
import { user, videos } from "@/drizzle/schema"
import { revalidatePath } from "next/cache"
import { aj } from "../arcjet"
import { fixedWindow, request } from "@arcjet/next"
import { and, eq, or, sql } from "drizzle-orm"

type Visibility="public"|"private"|string


interface VideoDetails
{
    videoId:string,
    title:string,
    description:string,
    thumbnailUrl:string,
    visibility:Visibility
    duration:number|null

}

const VIDEO_STREAM_BASE_URL=BUNNY.STREAM_BASE_URL
const THUMNAIL_STORAGE_BASE_URL=BUNNY.STORAGE_BASE_URL
const THUMBNAIL_CDN_URL=BUNNY.CDN_URL
const BUNNY_LIBRARY_ID=getEnv('BUNNY_LIBRARY_ID')
const ACCESS_KEYS={
    streamAccessKey: getEnv('BUNNY_STREAM_ACCESS_KEY'),
    storageAccessKey: getEnv('BUNNY_STORAGE_ACCESS_KEY')
}

interface BunnyVideoRepsone
{
    guid:string;
    status:number;
    encodeProgress?:number
}
//helper fucntions
export const revalidatePaths=async(paths:string[])=>{

    paths.forEach((path)=>{
        revalidatePath(path)
    })

}


    
export const getSessionUserId=async()=>{
    const session=await auth.api.getSession({headers:await headers()})
    if(!session)
    {
        throw new Error("User not authenticated")
    }
    return session.user.id
}

export const validateWithArcjet=async(fingerprint:string)=>{
    const ratelimit=aj.withRule(
        fixedWindow({
            mode: 'LIVE',
            window:'1m',
            max: 1,
            characteristics:['fingerprint']
        })
    )

    const req=await request()
    const decision=await ratelimit.protect(req,{fingerprint:fingerprint})
    if(!decision.isDenied())
    {
        throw new Error("Rate Limit Exceeded")
    }

}

//servre actions
export const getVideoUploadUrl=withErrorHandling(async()=>{

    await getSessionUserId()
    const videoResponse=await apiFetch<BunnyVideoRepsone>(
        `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos`,
        {
            method:'POST',
            bunnyType:'stream',
            body:{title:'Temp title',collectionId:''}
        }
    )
    const uploadUrl=`${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos/${videoResponse.guid}`
    return{
        videoId:videoResponse.guid,
        uploadUrl,
        accessKey: ACCESS_KEYS.streamAccessKey
    }

})

export const thumbnailUploadUrl=withErrorHandling(async(videoId:string)=>{
    const timestampFileName=`${Date.now()}-${videoId}-thumbnail`
    const uploadUrl=`${THUMNAIL_STORAGE_BASE_URL}/thumbnails/${timestampFileName}`
    const cdnUrl=`${THUMBNAIL_CDN_URL}/thumbnails/${timestampFileName}`

    return {
        uploadUrl,
        cdnUrl,
        accessKey:ACCESS_KEYS.storageAccessKey
    }
})

export const saveVideoDetails=withErrorHandling(async(videoDetails:VideoDetails)=>{
    const userId=await getSessionUserId()

    await validateWithArcjet(userId)
    await apiFetch(
        `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos/${videoDetails.videoId}`,
        {
            method:'POST',
            bunnyType:'stream',
            body:{
                title:videoDetails.title,
                description:videoDetails.description,
            }
        }
    )
    const now=new Date();
    await db.insert(videos).values({
        title: videoDetails.title,
        description: videoDetails.description,
        videoId: videoDetails.videoId,
        videoUrl:  `${BUNNY.EMBED_URL}/${BUNNY_LIBRARY_ID}/${videoDetails.videoId}`,
        thumbnailUrl: videoDetails.thumbnailUrl,
        visibility: videoDetails.visibility,
        userId,
        createdAt: now,
        updatedAt: now
    })

    revalidatePaths(['/'])
    return {videoId: videoDetails.videoId}

})

export const getAllVideos=withErrorHandling(async(
    searchQuery:string='',
    sortFilter?:string,
    pageNumber:number=1,
    pageSize:number=8
)=>{

    const session=await auth.api.getSession({headers: await headers()})
    const userId=session?.user.id;

    const canSeeTheVideos=or(
        eq(videos.visibility,'public'),
        eq(videos.userId,userId!)
    )

    const whereCondition=searchQuery.trim()?
    and(canSeeTheVideos,doesTitleMatch(videos,searchQuery)):canSeeTheVideos

    const [{totalCount}]=await db
    .select({totalCount:sql<number>`count(*)`})
    .from(videos)
    .where(whereCondition)

    const totalVideos=Number(totalCount||0)
    const totalPages=Math.ceil(totalVideos/pageSize)

    const videoRecords=await buildWithUserQuery()
        .where(whereCondition)
        .orderBy(
            sortFilter?getOrderByClause(sortFilter):sql`${videos.createdAt} DESC`
        )
        .limit(pageSize)
        .offset((pageNumber-1)*pageSize)

        return{
            videos:videoRecords,
            pagination:{
                currentPage:pageNumber,
                totalPages,
                totalVideos,
                pageSize
            }
        }

})