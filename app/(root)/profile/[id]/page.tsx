import Header from '@/components/Header';
import React from 'react'

interface ParamsWithSearch{
  params:Promise<Record<string,string>>;
  searchPrams:Record<string,string|undefined>;
};
const page = async ({params,searchParams}:{params:Record<string,string>,searchParams:Record<string,string|undefined>}) => {

  const p=await params
  console.log("hello")
  console.log(p.id)
  return (
    <div className='wrapper page'>
      <Header subHeader='sudipta@gmail.com' title='Sudipta Mahato' userImg='/assets/images/dummy.jpg'></Header>
      <h1 className='text-2xl font-karla'>USER ID {p.id}</h1>

    </div>
  )
}

export default page