import { DEFAULT_RECORDING_CONFIG, DEFAULT_VIDEO_CONFIG } from "@/constants";

interface MediaStreams{
  displayStream:MediaStream,
  micStream:MediaStream|null,
  hasDisplayAudio:boolean
}
interface RecordingHandlers {
  onDataAvailable: (e: BlobEvent) => void;
  onStop: () => void;
}


export const getMediaStream=async(withMic:boolean):Promise<MediaStreams>=>{

    const displayStream=await navigator.mediaDevices.getDisplayMedia(
      {
        video:DEFAULT_VIDEO_CONFIG,//define the default video config in the ocnstants
        audio:true
      }
    )

    const hasDisplayAudio=await displayStream.getAudioTracks().length>0

    let micStream:MediaStream|null=null
    if(withMic)
    {
      micStream=await navigator.mediaDevices.getUserMedia({audio:true})
    }

    return {
      displayStream,
      micStream,
      hasDisplayAudio
    }
}


export const createAudioMixer=(ctx:AudioContext,displayStream:MediaStream,micStream:MediaStream|null,hasDisplayAudio:boolean)=>{

  if(!hasDisplayAudio&&!micStream)
  {
    return null
  }

  const audioDestination=ctx.createMediaStreamDestination();

  const mix=(stream:MediaStream,gainValue:number)=>{
    const source=ctx.createMediaStreamSource(stream)
    const gain=ctx.createGain();

    gain.gain.value=gainValue
    source.connect(gain).connect(audioDestination)
  }

  if(hasDisplayAudio)mix(displayStream,0.7)

  if(micStream)mix(micStream,1.2)

  return audioDestination

}

//now once the streams are ready we should stepthe recorder

export const setUpMediaRecorder=(stream:MediaStream)=>{
  try {
    return new MediaRecorder(stream,DEFAULT_RECORDING_CONFIG)
  } catch (error) {
    return new MediaRecorder(stream)
  }
}

export const setUpRecording=(stream:MediaStream,handlers:RecordingHandlers):MediaRecorder=>{

  const recorder=new MediaRecorder(stream,DEFAULT_RECORDING_CONFIG)

  recorder.ondataavailable=handlers.onDataAvailable
  recorder.onstop=handlers.onStop

  return recorder

}


export const cleanUpRecording=(recorder:MediaRecorder|null,stream:MediaStream|null,originalStreams:MediaStream[]=[])=>{
  if(recorder?.state!=='inactive')
  {
    recorder?.stop()
  }

  stream?.getTracks().forEach((track:MediaStreamTrack)=>track.stop())
  originalStreams.forEach((s)=>s.getTracks().forEach((track:MediaStreamTrack)=>track.stop()))
}

export const creatRecordingBlob=(chunks:Blob[]):{blob:Blob,url:string}=>{

  const blob=new Blob(chunks,{type:'video/webm'})
  const url=URL.createObjectURL(blob)

  return {blob,url}

}

export const calculateRecordingDuration = (startTime: number | null): number =>
 {
    return startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
 } 


