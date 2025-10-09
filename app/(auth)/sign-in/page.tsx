'use client'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { authClientt } from '@/lib/auth-client'

const page = () => {
    const handleSignIn=async()=>{
        return await authClientt.signIn.social({provider:'google'})
    }


    return (
    <main className='sign-in'>
        <aside className='testimonial'>
            <Link href="/">
                <Image src="/assets/icons/logo.svg" alt="logo" width={32} height={32}></Image>
                <h1>Screeny</h1>
            </Link>
            <div className='description'>
                <section>
                    <figure>
                        {Array.from({length:5}).map((_,index)=>(
                            <Image src="/assets/icons/star.svg" alt="star" height={20} width={20} key={index}></Image>))}
                    </figure>
                    <p>Screeny makes screen recording easy. From quick walkthroughs to
              full presentations, it&apos;s fast, smooth, and shareable in seconds</p>
                    <article>
                        <Image src="/assets/images/jason.png" alt="jason" width={64} height={64} className='rounded-full'></Image>
                        <div>
                            <h2>
                                Jason Rivers
                            </h2>
                            <p>Product Designer</p>
                        </div>
                    </article>
                </section>
            </div>
            <p>© Screeny {(new Date()).getFullYear()}</p>
        </aside>
        <aside className='google-sign-in'>
            <section>
                <Link href="/">
                    <Image src="/assets/icons/logo.svg" alt="logo" width={32} height={32}></Image>
                    <h1>Screeny</h1>        
                </Link>
                <p>
                    Create and share your very first <span>Screeny video</span> in no
                    time!
                </p>
                <button className='hover:bg-pink-100' onClick={handleSignIn}>    
                    <Image src="/assets/icons/google.svg" alt="Google-icon" width={22} height={22}>
                    </Image>
                    <span>Sign-in with google</span>
                </button>
            </section>
        </aside>
    </main>
  )
}

export default page