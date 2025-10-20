import { useRef, useState } from "react"
import { calculateRecordingDuration, cleanUpRecording, createAudioMixer, creatRecordingBlob, getMediaStream, setUpRecording } from "../utils";

interface BunnyRecordingState
{
    isRecording:boolean,
    recordedBlob:Blob|null,
    recordingUploadUrl:string,
    recordingDuration:number,

}

interface ExtendedMediaStream extends MediaStream
{
    _originalStreams?:MediaStream[]

}



export const useScreenRecording=()=>{

    const [state,setState]=useState<BunnyRecordingState>({
        isRecording:false,
        recordedBlob:null,
        recordingUploadUrl:'',
        recordingDuration:0
    })

    const mediaRecorderRef=useRef<MediaRecorder|null>(null);
    const streamRef=useRef<ExtendedMediaStream|null>(null);
    const chunksRef=useRef<Blob[]>([]);
    const audioContextRef=useRef<AudioContext|null>(null);
    const startTimeRef=useRef<number|null>(null);
    
    const handleRecordingStop=()=>{
        const {blob,url}=creatRecordingBlob(chunksRef.current)
        const duration=calculateRecordingDuration(startTimeRef.current)

        setState((prev) => ({
      ...prev,
      recordedBlob: blob,
      recordedVideoUrl: url,
      recordingDuration: duration,
      isRecording: false,
    }));

    }

    const startRecording=async(withMic=true)=>{
        try 
        {
            stopRecording();
        
            const {displayStream,micStream,hasDisplayAudio}=await getMediaStream(withMic);

            const combinedStream=new MediaStream() as ExtendedMediaStream

            displayStream.getVideoTracks().forEach((track:MediaStreamTrack)=>combinedStream.addTrack(track))

            audioContextRef.current=new AudioContext()
            const audioDestination=createAudioMixer(audioContextRef.current,displayStream,micStream,hasDisplayAudio)

            audioDestination?.stream.getAudioTracks().forEach((track:MediaStreamTrack)=>combinedStream.addTrack(track))

            combinedStream._originalStreams=[displayStream,...(micStream?[micStream]:[])]

            streamRef.current=combinedStream

            mediaRecorderRef.current=setUpRecording(combinedStream,{
                onDataAvailable:(e)=>e.data.size && chunksRef.current?.push(e.data),
                onStop:handleRecordingStop
            })

            chunksRef.current=[]
            startTimeRef.current=Date.now()

            mediaRecorderRef.current.start(1000)
            setState((prev)=>({...prev,isRecording:true}))
            return true

                
        } 
        catch (error) 
        {
            console.error("Recording error:", error);
            return false;    
        }
    }

    const stopRecording=()=>
    {
        cleanUpRecording(mediaRecorderRef.current,streamRef.current,streamRef?.current?._originalStreams)
        streamRef.current=null
        
        setState((prev)=>({...prev,isRecording:false}))

    }

    const resetRecording=()=>{
        stopRecording()

        if(state.recordingUploadUrl)URL.revokeObjectURL(state.recordingUploadUrl)
        setState({
            isRecording:false,
            recordedBlob:null,
            recordingDuration:0,
            recordingUploadUrl:""
    
        })

        startTimeRef.current=null;
        

    }

    return{
        ...state,
        startRecording,
        stopRecording,
        resetRecording
    }


}

//AFTER CREATING THE SKELETON GO TO UTILS TOCREATE THE HELPER FUNCTIONS