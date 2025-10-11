'use client'
import FileInput from '@/components/FileInput'
import FormField from '@/components/FormField'
import React, { ChangeEvent, useState } from 'react'

const page = () => {
    const [error,setError]=useState(null);
    const [formData,setFormData]=useState({
        title:"",
        description:"",
        visibility:"public",
    }) 
    const handleInputChange=(e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>{
        const {name,value}=e.target
        setFormData((prevState)=>({...prevState,[name]:value}))
    }

    
  return (
    <div className='wrapper-md upload-page'>
        <h1>Upload Video</h1>
        {error&&(<div className='error-field'>{error}</div>)}

        <form action="" className='w-full flex flex-col rounded-20 shadow-10 px-5 py-7.5 gap-6 '>
            <FormField 
            id="title"
            label="Title"
            placeholder="Enter a precise title"
            value={formData.title}
            onChange={handleInputChange}
            ></FormField>
          
            <FormField id='description' label='Description' placeholder='Enter the description for the video'  value={formData.description} onChange={handleInputChange}></FormField>
            <FileInput></FileInput>
            <FileInput></FileInput>

            <FormField id='visibility' label='Visibility'  as='select' value={formData.visibility} onChange={handleInputChange} options={[{value:'public',label:'Public'},
                                                                                                                                        {value:'private',label:'Private'}]}></FormField>
            


        </form>
        
    </div>
  )
}

export default page