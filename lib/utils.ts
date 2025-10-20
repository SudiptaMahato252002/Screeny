import { unknown } from "better-auth"
import { ilike, sql,eq } from "drizzle-orm";
import { url } from "inspector"
import { user, videos } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { DEFAULT_RECORDING_CONFIG, DEFAULT_VIDEO_CONFIG } from "@/constants";
import Stream from "stream";

interface ApiFetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: object;
  expectJson?: boolean;
  bunnyType: "stream" | "storage";
}

export const getEnv=(key:string):string=>{
    const secret=process.env[key]
    if(!secret)
    {
        throw new Error(`Missing required env:${key}`)
    }
    return secret
}

export const withErrorHandling=<T,A extends unknown[]>(fn:(...args:A)=>Promise<T>)=>{
    return async(...args:A):Promise<T>=>{
        
        try 
        {
            const result=await fn(...args)
            return result
            
        } catch (error) {
            const errorMessage=error instanceof Error?error.message:"Unknown error occured"
            return errorMessage as unknown as T
        }
    }
}

export const apiFetch=async <T=Record<string,unknown>>(
    url:string,
    options:Omit<ApiFetchOptions,"bunnyType">&{
        bunnyType:"stream"|"storage"
    }
):Promise<T>=>{
    const {
        method="GET",
        headers={},
        body,
        expectJson=true,
        bunnyType
    }=options

    const key=getEnv(bunnyType==='stream'?"BUNNY_STREAM_ACCESS_KEY":"BUNNY_STORAGE_ACCESS_KEY")

    const requestHeaders = {
    ...headers,
    AccessKey: key,
    ...(bunnyType === "stream" && {
      accept: "application/json",
      ...(body && { "content-type": "application/json" }),
    }),
  };

  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    ...(body && { body: JSON.stringify(body) }),
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error(`API error ${response.text()}`);
  }

  if (method === "DELETE" || !expectJson) {
    return true as T;
  }

  return await response.json();

}


export const getOrderByClause=(filter?:string)=>{
  switch (filter){
    case 'Most Viewed':
      return sql`${videos.views} DESC`
    case 'Least Viewed':
      return sql`${videos.views} ASC`
    case "Oldest First":
      return sql`${videos.createdAt} ASC`;
    case "Most Recent":
    default:
      return sql`${videos.createdAt} DESC`
  }
}

export const buildWithUserQuery=()=>{
    return db.select({
        video:videos,
        user:{id: user.id,name: user.name, image: user.image}
    })
    .from(videos)
    .leftJoin(user,eq(videos.userId,user.id))

}

export const doesTitleMatch=(videos:any,searchQuery:string)=>
  ilike(sql`REPLACE(REPLACE(REPLACE(LOWER(${videos.title}),'-',''),'.',''),' ','')`,
    `%${searchQuery.replace(/[-. ]/g,'').toLowerCase()}%`
  )

  export const createIframeLink=(videoId:string)=>
  {
    return `https://iframe.mediadelivery.net/embed/${getEnv('BUNNY_LIBRARY_ID')}/${videoId}?autoplay=true&preload=true`
  }

  export const daysAgo=(inputDate:Date):string=>
  {

    const input=new Date(inputDate)
    const now=new Date()

    const diffTime=now.getTime()-input.getTime()
    const diffDay=Math.floor(diffTime/(1000*60*60*24))

    if (diffDay <= 0) 
    { 
      return "Today"; 
    } 
    else if (diffDay === 1) 
    { 
      return "1 day ago"; 
    }
    else
    { 
      return `${diffDay} days ago`; 
    }
  }



