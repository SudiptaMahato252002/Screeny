
import VideoPlayer from '@/components/VideoPlayer'
import VideoDetailHeader from '@/components/VideoDetailHeader'
import { getVideoById } from '@/lib/actions/video'
import { redirect } from 'next/navigation'
import React from 'react'

interface Params
{
  params:Promise<Record<string,string>>
}
const page = async({params}:Params) => {
  const {videoId}=await params
  const {video,user}=await getVideoById(videoId)

  if(!video)redirect('/404')

  return (
    <main className='wrapper page'>
      <VideoDetailHeader 
        videoId={video.videoId}
        title={video.title} 
        ownerId={video.userId} 
        thumnailUrl={video.thumbnailUrl} 
        createdAt={video.createdAt} 
        username={user?.name} 
        userImg={user?.image} 
        visibility={video.visibility}></VideoDetailHeader>
      <section className='video-details'>
        <div className='content'>
          <VideoPlayer videoId={video.videoId} ></VideoPlayer>
        </div>
      </section>
    </main>
  )
}

export default page