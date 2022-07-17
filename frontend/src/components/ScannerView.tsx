import { useRef, useEffect } from 'react'
/* import { useErrorPopup } from './ErrorPopup'
import { useSlamMetrics } from "../hooks/useSlamMetrics" */

interface ScannerDisplayProps {
    //renderer: CustomRenderer
    stream: MediaStream | null;
}



export default function ScannerDisplay({stream}: ScannerDisplayProps){
/*     const loopFlag = useRef(false); */
    const wrapperRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

/*     const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D>();
    const lastDrawTimeRef = useRef<number>(0);
    const [openErrorPopup, ,] = useErrorPopup();

    const { updateMetrics } = useSlamMetrics(); */

    /* const renderLoop = useCallback(() => {
        if (loopFlag.current && contextRef.current && canvasRef.current){
            
            const orb_frame = computeFrame()
            if (orb_frame){
                const canv = canvasRef.current;
                canv.width = orb_frame.img_data.width;
                canv.height = orb_frame.img_data.height;
                contextRef.current.putImageData(orb_frame.img_data, 0, 0);                
                
                const t0 = lastDrawTimeRef.current;
                const t1 = performance.now();
                //console.log(orb_frame.total_time_ms/(t1-t0))
                lastDrawTimeRef.current = t1;
                
                updateMetrics({
                    fps: Math.round(1/(t1-t0)*1000),
                    wasm_proc_time: orb_frame.wasm_time_ms,
                    total_proc_time: orb_frame.total_time_ms,
                    features_found: orb_frame.features,
                })

                window.requestAnimationFrame(renderLoop);
            }
        }
    }, [computeFrame, updateMetrics]) */

    useEffect(() => {
        if (videoRef.current){
            videoRef.current.srcObject = stream; 
        }
    }, [stream])

    return(
        <div style={{width: "100%", height: "100%", /* borderStyle: "solid", */ display:"flex", justifyContent:"center", alignItems:"center"}} id="scanner_display" ref={wrapperRef}>
            {/* <canvas style={{maxWidth: "100%", maxHeight: "100%" }} id="canvas" ref={canvasRef}>
                Sorry, your browser does not support this feature (HTML5 canvas)
            </canvas> */}
            <video ref={videoRef} style={{maxWidth: "100%", maxHeight: "100%", minWidth: "100%", minHeight: "100%"}}autoPlay></video>
        </div>
    )
}