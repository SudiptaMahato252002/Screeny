'use client'
import { ICONS } from '@/constants'
import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { useScreenRecording } from '@/lib/hooks/useScreenRecording'
import { useRouter } from 'next/navigation'
const RecordScreen = () => {

    const [isOpen, setisOpen] = useState(false)
    const videoRef=useRef<HTMLVideoElement>(null)
    const router=useRouter()
    const {isRecording,
    recordedBlob,
    recordingUploadUrl,
    recordingDuration,
    startRecording,
    stopRecording,
    resetRecording}=useScreenRecording()

    const closeModal=()=>{
        resetRecording()
        setisOpen(false)
    }

    const handleStart=async()=>{
        await startRecording()
    }

    const recordAgain=async()=>{
        resetRecording()
        await startRecording()
        if(recordingUploadUrl&&videoRef.current)
        {
            videoRef.current.src=recordingUploadUrl
        }
    }
    const goToUpload=()=>{

    }

  return (
    <div className='record'>
        <button className='primary-btn hover:bg-pink-700' onClick={()=>setisOpen(true)}>
            <Image src={ICONS.record} alt='record' width={16} height={16}></Image>
                    <span className='truncate'>Record</span>
        </button>
        {isOpen &&(<section className='dialog'>
                <div className='overlay' onClick={()=>closeModal()}/>
                    <div className='dialog-content'>
                        <figure>
                            <h3>Screen Recording</h3>
                            <button onClick={closeModal}>
                                <Image src={ICONS.close} alt='close' height={20} width={20}></Image>
                            </button>
                        </figure>
                        <section>
                            {isRecording?(<article>
                                <div>

                                </div>
                                <span>Recording in progress</span>
                            </article>):recordingUploadUrl?(<video ref={videoRef} src={recordingUploadUrl}/>):(<p>Click record to start capturing your screen</p>)}
                        </section>
                        <div className='record-box'>
                            {!isRecording&&!recordingUploadUrl&&(
                                <button onClick={handleStart} className='record-start'>
                                     <Image src={ICONS.record} alt='record' height={16} width={16}/>
                                    Record
                                </button>
                                )}
                                {isRecording && (
                                    <button onClick={stopRecording} className='record-stop'>
                                    <Image src={ICONS.record} alt="record" width={16} height={16}></Image>
                                    Stop Recording
                                </button>)}
                                {recordingUploadUrl&&(<>
                                    <button onClick={recordAgain} className='record-again'>Record Again</button>
                                    <button onClick={goToUpload} className="record-upload">
                                        <Image src={ICONS.upload} alt="Upload" width={16} height={16}/>
                                        Continue to Upload
                                    </button>
                                </>)}
                        </div>
                </div>
        </section>)}
    </div>
  )
}

export default RecordScreen

// .record {
//     .primary-btn {
//       @apply py-2.5 px-5 flex items-center gap-2.5 text-sm font-semibold text-white bg-pink-100 rounded-4xl;
//     }

//     .dialog {
//       @apply fixed inset-0 flex items-center justify-center z-50;

//       .overlay-record {
//         @apply absolute inset-0 bg-gray-40 backdrop-blur-xs shadow-20;
//       }

//       .dialog-content {
//         @apply relative bg-white rounded-20 p-6 shadow-lg w-full max-w-lg z-10;

//         figure {
//           @apply flex justify-between items-center mb-4;

//           h3 {
//             @apply text-xl font-bold text-dark-100;
//           }

//           button {
//             @apply p-2 rounded-full hover:bg-gray-20;
//           }
//         }

//         section {
//           @apply w-full rounded-18 flex items-center justify-center overflow-hidden;

//           article {
//             @apply flex flex-col items-center gap-2;

//             div {
//               @apply w-4 h-4 bg-red-500 rounded-full animate-pulse;
//             }

//             span {
//               @apply text-dark-100 text-base font-medium;
//             }

//             video {
//               @apply w-full h-full object-contain;
//             }

//             p {
//               @apply text-base font-medium text-gray-100;
//             }
//           }
//         }

//         .record-box {
//           @apply flex justify-center gap-4 mt-4;

//           .record-start {
//             @apply py-2.5 px-6 bg-pink-100 text-white rounded-4xl font-medium flex items-center gap-2;
//           }

//           .record-stop {
//             @apply py-2.5 px-6 bg-red-500 text-white rounded-4xl font-medium flex items-center gap-2;
//           }

//           .record-again {
//             @apply py-2.5 px-6 bg-gray-100 text-white rounded-4xl font-medium;
//           }

//           .record-upload {
//             @apply py-2.5 px-6 bg-pink-100 text-white rounded-4xl font-medium flex items-center gap-2;

//             img {
//               @apply brightness-0 invert;
//             }
//           }
//         }
//       }
//     }
//   }
