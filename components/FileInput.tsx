import React, { ChangeEvent } from 'react'
import Image from 'next/image'
interface FileInputProps
{
  id:string,
  label:string,
  accept:string,//for which type of videos do we need
  file:File|null,//for the video that user uploads
  previewUrl:string|null,
  inputRef:React.RefObject<HTMLInputElement|null>,
  onChange:(e:ChangeEvent<HTMLInputElement>)=>void,
  onReset:()=>void,
  type:"video"|"image"//as we have on place for thumbnail and another for video.  

}



const FileInput = ({id,label,accept,file,previewUrl,inputRef,onChange,onReset,type}:FileInputProps) => {
  return (
    <section className='file-input'>
        <label htmlFor={id}></label>
        <input type="file" id={id} accept={accept} ref={inputRef} hidden onChange={onChange}/>
      {!previewUrl?(
        <figure onClick={()=>inputRef.current?.click()}>
          <Image src="/assets/icons/upload.svg" alt='upload' height={24} width={24} ></Image>
          <p>Click to upload your {id}</p>
        </figure>):(<div>{type==='video'?(<video src={previewUrl} controls></video>):(<Image src={previewUrl} alt='image' fill></Image>)}
        <button type='button' onClick={onReset}>
        <Image src='/assets/icons/close.svg' alt='close' height={16} width={16}></Image>
      </button>
      <p>{file?.name}</p>
      </div>)}
    </section>
  )
}

export default FileInput