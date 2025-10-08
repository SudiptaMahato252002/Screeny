'use client'
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation";
export function Navbar()
{

    const router=useRouter();

    const user={};  //later on we will get this session of the browser

    return(
        <div className="navbar">

            <nav>
                <Link rel="stylesheet" href="/">
                    <Image src="/assets/icons/logo.svg" alt="Logo" height={32} width={32}></Image>
                    <h1>Screeny</h1>
                </Link>

                {user&&(
                    <figure>
                        <button onClick={()=>{router.push('/profile/123456')}}>
                            <Image src="/assets/images/dummy.jpg" alt="User" height={36} width={36} className="rounded-full aspect-square"></Image>
                        </button>
                        <button className="cursor-pointer">
                            <Image src="assets/icons/logout.svg" alt="logout" height={24} width={24} >

                            </Image>
                        </button>
                    </figure>
                )}



            </nav>





        </div>
    )
} 