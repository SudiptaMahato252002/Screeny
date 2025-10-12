'use client'
import FileInput from '@/components/FileInput'
import FormField from '@/components/FormField'
import { MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE } from '@/constants'
import { useFileInput } from '@/lib/hooks/useFileInput'
import React, { ChangeEvent, FormEvent, useState } from 'react'

const page = () => {
    const [error,setError]=useState<string|null>(null);
    const [isSubmittting,setIsSubmitting]=useState(false)
    const [formData,setFormData]=useState({
        title:"",
        description:"",
        visibility:"public",
    }) 
    const handleInputChange=(e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>{
        const {name,value}=e.target
        setFormData((prevState)=>({...prevState,[name]:value}))
    }

    const handleSubmit=(e:FormEvent)=>
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
        }
        
      } catch (error) {
        
      }


    }

    const video=useFileInput(MAX_VIDEO_SIZE)
    const thumbnail=useFileInput(MAX_THUMBNAIL_SIZE)

    
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