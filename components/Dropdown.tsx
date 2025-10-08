'use client'
import React, { useState } from 'react'
import Image from "next/image"

const Dropdown = () => {

    const [isOpen,setIsOpen]=useState<boolean>(false);

  return (
    <div className='relative'>
        <div className='cursor-pointer' onClick={()=>{setIsOpen(!isOpen)}}>
            <div className='filter-trigger'>
                <figure>
                    <Image src="assets/icons/hamburger.svg" alt="dropdown" height={14} width={14}></Image>
                    Most Recent
                    <Image src="assets/icons/arrow-down.svg" alt="arrow" height={20} width={20}></Image>
                </figure>
            </div>
        </div>
        {isOpen&&(<ul className='dropdown'>
            {['Most Renet','Most Liked'].map((option)=>(<li key={option} className='list-item'>{option}</li>))}
        </ul>)}
    </div>
  )
}

export default Dropdown