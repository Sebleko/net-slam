import { useState, useRef, useEffect, useCallback, MutableRefObject } from "react";
import { WebSlam } from "../wasm/slam";
import slamPromise from '../wasm'
import { ConstrainedPixelResolution } from "../core/SlamInterfaces";



export interface OrbSettings {
    output_width?: number;
    output_height?: number;
}
export interface OrbStats {
    frame_interval: number;
    features: number;
    wasm_time_ms: number;
    total_time_ms: number;
}
interface useOrbFeaturesReturnInterface {
    orbStream: MediaStream | null;
    orbStatsRef: MutableRefObject<OrbStats>;
}


export default function useOrbFeatureStream(inputStream: MediaStream | null, settings: OrbSettings): useOrbFeaturesReturnInterface {
    const outputDimsRef = useRef<ConstrainedPixelResolution>({width: 500, height: 500});
    const [outputStream, setOutputStream] = useState<MediaStream | null>(null);
    const [slam, setSlam] = useState<WebSlam>();

    //const videoRef = useRef<HTMLVideoElement>(document.createElement("video"));
    const [video, setVideo] = useState<HTMLVideoElement|null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
    const contextRef = useRef<CanvasRenderingContext2D>(canvasRef.current.getContext("2d"));
    const callbackIdRef = useRef<number>(-1);

    const outputCanvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
    const outputContextRef = useRef<CanvasRenderingContext2D>(outputCanvasRef.current.getContext("2d"));

    const lastFrameTimeRef = useRef<number>(-1);
    const orbStatsRef = useRef<OrbStats>({frame_interval: Infinity, features: 0, wasm_time_ms: 0, total_time_ms: 0});

    const handleFrameLoop = useCallback(() => {
        if (
            video &&
            video.readyState >= 2 && 
            slam  && 
            contextRef.current
            )
        {
            const handle_start = performance.now();

            const ctx = contextRef.current;
            const octx = outputContextRef.current;

            const w = outputDimsRef.current.width;
            const h = outputDimsRef.current.height
            ctx.drawImage(video, 0, 0, w, h);
            const pixels = ctx.getImageData(0, 0, w, h);

            const wasm_start = performance.now();
            const res = slam.processFrameAndDrawFeatures(pixels.data, pixels.width, pixels.height, 4);
            const wasm_end = performance.now();
            
            octx?.putImageData(new ImageData(new Uint8ClampedArray(res.data), w, h), 0, 0);

            callbackIdRef.current = requestAnimationOrVideoFrame(handleFrameLoop, video);

            const handle_end = performance.now();

            const total_time_ms = handle_end-handle_start;
            const wasm_time_ms = wasm_end-wasm_start;
            
            let frame_interval = 0;
            if (lastFrameTimeRef.current !== -1){
                frame_interval = handle_end- lastFrameTimeRef.current
            }
            lastFrameTimeRef.current = handle_end;

            orbStatsRef.current = {frame_interval, total_time_ms, wasm_time_ms, features: res.numFeaturesFound};
        }
    }, [slam, video])    

    // Load Wasm
    useEffect(() => {
        slamPromise
        .then(slam => { setSlam(slam); console.log("WASM was loaded") })
        .catch(error => console.error(error) )
        
    }, [])


    // Handle Input Change
    useEffect(() => {
        if (inputStream && settings) {
            const vid = document.createElement("video");
            vid.srcObject = inputStream;
          
            vid.oncanplay = () => {
                setVideo(vid);
            }
            vid.play();

            return () => {
                setVideo(null)
            }
        }
        
    }, [inputStream, settings, setVideo])

    useEffect(() => {
        if (video){
            const frameSize = determineFrameSize(video.videoWidth, video.videoHeight, settings.output_width, settings.output_height);
            outputDimsRef.current = frameSize;
            canvasRef.current.width = frameSize.width;
            canvasRef.current.height = frameSize.height;
            outputCanvasRef.current.width = frameSize.width;
            outputCanvasRef.current.height = frameSize.height;

            const stream = outputCanvasRef.current.captureStream();
            setOutputStream(stream);

            return () => {
                stream.getTracks().forEach(track => track.stop())
                setOutputStream(null);
            }
        }
    }, [video, settings])
    

    useEffect(() => {
        if (outputStream && video){
            callbackIdRef.current = requestAnimationOrVideoFrame(handleFrameLoop, video);
            
            return () => {
                cancelAnimationOrVideoFrame(callbackIdRef.current, video);
                orbStatsRef.current = {frame_interval: Infinity, features: 0, wasm_time_ms: 0, total_time_ms: 0};
            }
        }
    }, [outputStream, video, handleFrameLoop])

    return {orbStream: outputStream, orbStatsRef} //, settings, 
}

function determineFrameSize(w: number, h: number, constraint_w: number | undefined, constraint_h: number | undefined): ConstrainedPixelResolution {
    if (!constraint_w && !constraint_h) return {width: w, height: h};
    if (constraint_w && constraint_h) return {width: constraint_w, height: constraint_h};
    if (!constraint_w && constraint_h) return {width: w*constraint_h/h, height: constraint_h};
    if (constraint_w && !constraint_h) return {width: constraint_w, height: h*constraint_w/w};
    throw new Error("Error: Execution should not reach here.");
}

function requestAnimationOrVideoFrame(cb: () => void, vid: HTMLVideoElement): number{
    if (vid.requestVideoFrameCallback){
        return vid.requestVideoFrameCallback(cb);
    } else {
        return window.requestAnimationFrame(cb);   
    }
}

function cancelAnimationOrVideoFrame(id: number, vid: HTMLVideoElement) {
    if (vid.requestVideoFrameCallback as any){
        return vid.cancelVideoFrameCallback(id);
    } else {
        return window.cancelAnimationFrame(id);
    }
}