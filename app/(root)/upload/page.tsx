'use client'
import FileInput from '@/components/FileInput'
import FormField from '@/components/FormField'
import { MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE } from '@/constants'
import { getVideoUploadUrl, saveVideoDetails, thumbnailUploadUrl } from '@/lib/actions/video'
import { useFileInput } from '@/lib/hooks/useFileInput'
import { duration } from 'drizzle-orm/gel-core'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'

const page = () => {

    const router=useRouter()
    const [error,setError]=useState<string|null>(null);
    const [isSubmittting,setIsSubmitting]=useState(false)
    const [formData,setFormData]=useState({
        title:"",
        description:"",
        visibility:"public",
    }) 

    const [videoDuration,setVideouration]=useState<number|null>(null);
    
    const video=useFileInput(MAX_VIDEO_SIZE)
    const thumbnail=useFileInput(MAX_THUMBNAIL_SIZE)

    useEffect(()=>{
      if(video.duration!=null)
      {
        setVideouration(video.duration)
      }
    },[videoDuration])

    const uploadVideoToBunny=(file:File,uploadUrl:string,accessKey:string):Promise<void>=>
      fetch(uploadUrl,{
        method:'PUT',
        headers:{
          'Content-Type': file.type,
          AccessKey:accessKey
        },
        body: file,
      }).then((response)=>{
          if(!response.ok)
          {
            throw new Error(`Upload failed with status ${response.status}`);
          }
    })



    const handleInputChange=(e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>{
        const {name,value}=e.target
        setFormData((prevState)=>({...prevState,[name]:value}))
    }

    const handleSubmit=async(e:FormEvent)=>
    {
      e.preventDefault()
      setIsSubmitting(true)

      try 
      {
        if(!video.file||!thumbnail.file)
        {
            setError('Please upload video and thumbnail')
            return
        }
        if(!formData.title||!formData.description)
        {
            setError('Please upload fill in all the details')
            return
        }

        // get the upload url
          const {videoId,
            uploadUrl:videoUploadUrl,
            accessKey:videAccessKey
          }=await getVideoUploadUrl()

        //UPLOAD VIDEO TO BUNNY
        await uploadVideoToBunny(video.file,videoUploadUrl,videAccessKey)
        
        const{uploadUrl:thumbUploadUrl,
          cdnUrl:thumbnailCdnUrl,
          accessKey:thumnailAccessKey
        }=await thumbnailUploadUrl(videoId)

        await uploadVideoToBunny(thumbnail.file,thumbUploadUrl,thumnailAccessKey)

        await saveVideoDetails({
          videoId,
          ...formData,
          thumbnailUrl:thumbUploadUrl,
          duration: videoDuration
        })

        router.push(`videos/${videoId}`)
        
      } 
      catch (error) 
      {
        console.error("Error submitting form:", error);
        
      }
      finally
      {
        setIsSubmitting(false);
      }


    }


  
    
  return (
    <div className='wrapper-md upload-page'>
        <h1>Upload Video</h1>
        {error&&(<div className='error-field'>{error}</div>)}

        <form action="" onSubmit={handleSubmit} className='w-full flex flex-col rounded-20 shadow-10 px-5 py-7.5 gap-6'>
            <FormField 
            id="title"
            label="Title"
            placeholder="Enter a precise title"
            value={formData.title}
            onChange={handleInputChange}
            ></FormField>
          
            <FormField id='description' label='Description' placeholder='Enter the description for the video'  value={formData.description} onChange={handleInputChange}></FormField>
            <FileInput
               id='video'   
               label='video'
               accept='video/*'//to get all type of videos
               file={video.file}
               previewUrl={video.previewUrl}
               inputRef={video.inputRef}
               onChange={video.handleFileChange}
               onReset={video.resetFile}
               type='video'
               >    
                </FileInput>
            <FileInput
              id='thumbnail'   
              label='thumbnail'
              accept='image/*'//to get all type of videos
              file={thumbnail.file}
              previewUrl={thumbnail.previewUrl}
              inputRef={thumbnail.inputRef}
              onChange={thumbnail.handleFileChange}
              onReset={thumbnail.resetFile}
              type='image'
            ></FileInput>

            <FormField id='visibility' label='Visibility'  as='select' value={formData.visibility} onChange={handleInputChange} options={[{value:'public',label:'Public'},
                                                                                                                                        {value:'private',label:'Private'}]}></FormField>
            
            <button type='submit' disabled={isSubmittting} className='submit-button'>{isSubmittting?'Uploading...':'Upload Video'}</button>
        </form>
        
    </div>
  )
}

export default page