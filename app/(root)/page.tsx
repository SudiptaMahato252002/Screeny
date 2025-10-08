import Header from '@/components/Header'
import React from 'react'

const page = () => {
  return (
    <main className='wrapper page'>
      <Header title='All videos' subHeader='Public Libray' userImg='/assets/images/dummy.jpg'></Header>
      <h1 className='text-2xl font-karla'>Welcome to Screeny</h1>
    </main>
  )
}

export default page