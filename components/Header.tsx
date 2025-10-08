import React from 'react'
import Image from "next/image"
import Link from 'next/link'
import { ICONS } from '@/constants'
import Dropdown from './Dropdown'

declare interface ShareHeadderPrpos
{
    subHeader: string,
    title: string,
    userImg?: string
}

const Header = ({subHeader,title,userImg}:ShareHeadderPrpos) => {
  return (
    <header className='header flex flex-col gap-9'>
        <section className='header-contianer flex flex-col md:flex-row md:items-center justify-between gap-5'>
            <div className='details flex gap-2.5 items-center'>
                {userImg&&(
                    <Image src={userImg||"assets/images/dummy.jpg"} alt='user' height={66} width={66} className='rounded-full'></Image>
                )}

                <article className='flex flex-col gap-1 -tracking-[0.8px]'>
                    <p className='text-sm text-gray-100 font-medium'>{subHeader}</p>
                    <h1 className='text-3xl font-bold text-dark-100 capitalize'>{title}</h1>
                </article>

            </div>

            <aside className='flex items-center gap-2 md:gap-4'>
                <Link href="/upload" className='py-2.5 px-5 flex items-center gap-2.5 text-sm font-semibold rounded-4xl border border-gray-300 hover:border-blue-500'>
                    <Image src={ICONS.upload} alt='upload' width={16} height={16}></Image>
                    <span className='truncate'>Upload a video</span>
                </Link> 
                
                <div className='record'>
                    <button className='primary-btn hover:bg-pink-700'>
                        <Image src={ICONS.record} alt='record' width={16} height={16}></Image>
                        <span className='truncate'>Record</span>
                    </button>
                </div>
            </aside>
        </section>

        <section className='search-filter flex flex-col md:flex-row md:items-center gap-5 justify-between'>
            <div className='search relative max-w-[500px] w-full'>
                <input className='border border-gray-20 py-2 pl-8 pr-5 text-dark-100 text-sm font-normal placeholder:text-gray-100 w-full rounded-[18px] focus:outline-pink-100 hover:border-pink-100
' type="text" placeholder='Search for videos,tag,folders' />
                <Image src="assets/icons/search.svg" alt="search" height={16} width={16}></Image>            
            </div>
            <Dropdown/>

        </section>

    </header>
  )
}

export default Header