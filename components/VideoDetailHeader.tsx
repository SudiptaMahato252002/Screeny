
import React from 'react'
import ImageWithFallback from 'next/image'
import Image from 'next/image'
import { daysAgo } from '@/lib/utils'
import { set } from 'better-auth'
import CopyLinkButton from './CopyLinkButton'
import Link from 'next/link'

type Visibilty='public'|'private'|string

interface VideoDetailHeaderProps
{
    title:string,
    createdAt:Date,
    thumnailUrl:string,
    userImg:string|null|undefined,
    username?:string
    visibility:Visibilty
    videoId:string
    ownerId:string
}

const VideoDetailHeader = ({title,createdAt,thumnailUrl,userImg,username,visibility,videoId,ownerId}:VideoDetailHeaderProps) => {


    
  return (
    <header className='detail-header'>
        <aside className='user-info'>
            <h1>{title}</h1>
            <figure>
                <Link href={`/profile/${ownerId}`}>
                    <ImageWithFallback src={userImg??""} alt='User' height={24} width={24} className='rounded-full'></ImageWithFallback>
                    <h2>{username??'Guest'}</h2>               
                </Link>
                <figcaption>
                    <span className='mt-1'>.</span>
                    <p>{daysAgo(createdAt)}</p>
                </figcaption>
            </figure>
        </aside>
        <aside className='cta'>
           <CopyLinkButton videoId={videoId}></CopyLinkButton>
        </aside>
    </header>
  )
}

export default VideoDetailHeader