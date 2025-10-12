import { view } from "drizzle-orm/sqlite-core";
import { ChangeEvent, useRef, useState } from "react"

export const useFileInput=(maxSize:number)=>{

    const [file,setFile]=useState<File|null>(null);
    const [previewUrl,setPreviewUrl]=useState<string|null>(null);
    const [duration,setDuration]=useState<number|null>(null);
    const inputRef=useRef<HTMLInputElement>(null);

    const handleFileChange=(e:ChangeEvent<HTMLInputElement>)=>
    {
        if(e.target.files?.[0])
        {
            const selectedFile=e.target.files[0]

            if(selectedFile.size>maxSize)
            {
                return;
            }

            if(previewUrl)
            {
                URL.revokeObjectURL(previewUrl)
            }
            setFile(selectedFile);
            const objectURL=URL.createObjectURL(selectedFile)
            setPreviewUrl(objectURL)


            if(selectedFile.type.startsWith('video/'))//if the file is of the type video
            {
                const video=document.createElement('video')//we getaccess to that video by creating video elemnt in it and exctract preview duration
                video.preload='metadata'
                video.onloadedmetadata=()=>{
                    if(isFinite(video.duration)&&video.duration>0)
                    {
                        setDuration(Math.round(video.duration))
                    }
                    else
                    {
                        setDuration(null)
                    }
                    URL.revokeObjectURL(video.src)                   
                }
                video.src=objectURL
                
            }

        }

    }

    const resetFile=()=>{
        if(previewUrl)
        {
            URL.revokeObjectURL(previewUrl)
        }
        setFile(null)
        setPreviewUrl(null)
        setDuration(null)
        if(inputRef.current)
        {
            inputRef.current.value=""
        }

    }



    return {file,previewUrl,duration,inputRef,handleFileChange,resetFile}

}