import Header from '@/components/Header'
import VideoCard from '@/components/VideoCard'
import { dummyCards } from '@/constants'
import React from 'react'

const page = () => {
  return (
    <main className='wrapper page'>
      <Header title='All videos' subHeader='Public Libray' userImg='/assets/images/dummy.jpg'></Header>
      <h1 className='text-2xl font-karla'>Welcome to Screeny</h1>
      <section className='video-grid'>
        {dummyCards.map((card)=>
        (<VideoCard {...card}/>
        ))}
      </section>
      
      
    </main>
  )
}

export default page