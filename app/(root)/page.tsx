import EmptyCard from '@/components/EmptyCard'
import Header from '@/components/Header'
import VideoCard from '@/components/VideoCard'
import { dummyCards } from '@/constants'
import { getAllVideos } from '@/lib/actions/video'
import React from 'react'

const page = async(searchParams:Promise<Record<string,string|undefined>>) => {

  const {query,filter,page}=await searchParams

  const {videos,pagination}=await getAllVideos(query,filter,Number(page)||1)


  return (
    <main className='wrapper page'>
      <Header title='All videos' subHeader='Public Libray' userImg='/assets/images/dummy.jpg'></Header>
      <h1 className='text-2xl font-karla'>Welcome to Screeny</h1>
      {
        videos?.length>0?(
          <section className='video-grid'>
            {videos.map(({video,user})=>
              (<VideoCard
                key={video.id}
                id={video.videoId}
                title={video.title}
                createdAt={video.createdAt}
                thumbnail={video.thumbnailUrl}
                username={user?.name??"Guest"}
                userImg={user?.image??""}
                views={video.views}
                visibility={video.visibility}
                duration={video.duration}
              >
            </VideoCard>))}
          </section>
        ):(<EmptyCard icon='/assets/icons/video.svg' title='No videos Found'></EmptyCard>)
      }
      
      
    </main>
  )
}

export default page