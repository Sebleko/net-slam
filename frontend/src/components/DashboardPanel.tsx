import { useEffect, useCallback, useRef } from 'react';
import { useSlamMetrics } from "../hooks/useSlamMetrics";


export default function DashboardPanel(){
    const fpsRef = useRef<HTMLHeadingElement>(null);
    const wasmFractionRef = useRef<HTMLHeadingElement>(null);
    const featuresRef = useRef<HTMLHeadingElement>(null);
    const rafIdRef = useRef<number>(0);

    const { getSnapshot } = useSlamMetrics();



    const updateStats = useCallback(() => {
        const snpst = getSnapshot();
        if (fpsRef.current && wasmFractionRef.current && featuresRef.current) {
            if (snpst){
                fpsRef.current.innerText = `FPS: ${snpst.fps.toString()}`;
                wasmFractionRef.current.innerText = `WASM/JS: ${Math.round(snpst.wasm_proc_time/snpst.total_proc_time*100)}%`
                featuresRef.current.innerText = `Features: ${snpst.features_found}`;
            } else {
                fpsRef.current.innerText = "FPS: N/A";
                wasmFractionRef.current.innerText = "WASM/JS: N/A";
                featuresRef.current.innerText = "Features: N/A";
            }
            
        } 
        rafIdRef.current = window.setTimeout(updateStats, 300);
    }, [getSnapshot])

    useEffect(() => {
        updateStats();
        return () => {
            window.clearTimeout(rafIdRef.current);
        }
    }, [updateStats])

    return (
        <div>
            <h3 ref={fpsRef}>FPS: N/A</h3>
            <h3 ref={wasmFractionRef}>WASM/JS: N/A</h3>
            <h3 ref={featuresRef}>Features: N/A</h3>
        </div>
    )
}