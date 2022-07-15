import { useState, useRef, useEffect, useCallback } from "react";
import { WebSlam } from "../wasm/slam";
import slamPromise from '../wasm'
import { addAlphaChannelToRGB } from '../util/image_ops';


export interface ImageConstraints {
    width: number,
    height: number,
    preserveRatio: boolean,
}

export interface PerformanceMetric {
    features_extracted: number,
    rolling_fps: number,
}

export interface OrbFrame {
    img_data: ImageData,
    wasm_time_ms: number,
    total_time_ms: number,
    features: number,
}

interface useOrbFeaturesReturnInterface {
    setStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
    setImageConstraints: React.Dispatch<React.SetStateAction<ImageConstraints>>;
    getFrame: () => (OrbFrame | null);
    isReady: boolean;
}

export default function useOrbFeatures(metricUpdateInterval: number): useOrbFeaturesReturnInterface {
    const [stream, setStream] = useState<MediaStream>();
    const [imageConstraints, setImageConstraints] = useState<ImageConstraints>({width: 300, height: 300, preserveRatio: true});
    const [isReady, setIsReady] = useState<boolean>(false);    

    const slamRef = useRef<WebSlam>();
    const videoRef = useRef<HTMLVideoElement>(document.createElement("video"));
    const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
    const contextRef = useRef<CanvasRenderingContext2D>(canvasRef.current.getContext("2d"));

    const requestReady = useCallback(() => {
        if (stream && slamRef.current && videoRef.current.readyState >= 2) setIsReady(true);
    }, [setIsReady, stream])

    useEffect(() => {
        slamPromise
        .then(slam => { slamRef.current = slam; requestReady(); })
        .catch(error => console.error(error) )
    }, [requestReady])

    useEffect(() => {
        if (stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.oncanplay = () => requestReady();
            videoRef.current.play();
        } else {
            setIsReady(false);

            videoRef.current.srcObject = null;
        }
    }, [stream, setIsReady, requestReady])


    function getFrame(): OrbFrame | null{
        if (isReady && stream && slamRef.current && contextRef.current && canvasRef.current){
            const frame_start = performance.now();
            const vid = videoRef.current;
            const native_width = vid.videoWidth;
            const native_height = vid.videoHeight;
            if (native_width === 0 || native_height === 0) return null;
           
            /* let width = native_width;
            let height = native_height; */
            let width = imageConstraints.width;
            let height =  imageConstraints.height;
            
            if (imageConstraints.preserveRatio){
                let max_ratio = width / native_width;
                if (max_ratio*native_height > imageConstraints.height){
                    max_ratio = height / native_height;
                }
                width = max_ratio * native_width;
                height = max_ratio * native_height;
            }
          
            const canv = canvasRef.current;
            canv.width = width;
            canv.height = height;
            const ctx = contextRef.current;
            ctx.drawImage(vid, 0, 0, width, height);
            const pixels = ctx.getImageData(0, 0, width, height);
            const without_alpha = pixels.data.filter((value, index) => {return (((index+1) % 4) !== 0)});
            const wasm_start = performance.now();
            const res = slamRef.current.processFrameAndDrawFeatures(without_alpha, pixels.width, pixels.height, 3);
            const wasm_end = performance.now();
            const data = addAlphaChannelToRGB(res.data, 255);
            const frame_ready = performance.now();
            return {
                img_data: new ImageData(data, width, height),
                wasm_time_ms: wasm_end-wasm_start,
                total_time_ms: frame_ready-frame_start,
                features: res.numFeaturesFound,
            }
            
        } else {
            return null;
        }
    }  
    
    return {setStream, setImageConstraints, getFrame, isReady}
}