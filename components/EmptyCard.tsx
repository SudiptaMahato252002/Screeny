import React from 'react';
import Image from 'next/image';

interface EmptyCardProps
{
  title:string,
  icon:string,
}

const EmptyCard = ({icon,title}:EmptyCardProps) => {
  return (
   <section className='empty-state'>
    <figure>
      <Image src={icon} alt="icon" width={46} height={46} ></Image>
    </figure>
    
   <article>
     <h1>{title}</h1>
   </article>
   </section>
  )
}

export default EmptyCard