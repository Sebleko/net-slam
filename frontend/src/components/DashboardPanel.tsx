import { useEffect, useRef, MutableRefObject } from 'react';
import { OrbStats } from "../hooks/useOrbFeatures"

export default function DashboardPanel({orbStatsRef}: {orbStatsRef: MutableRefObject<OrbStats>}){
    const fpsRef = useRef<HTMLHeadingElement>(null);
    const wasmFractionRef = useRef<HTMLHeadingElement>(null);
    const featuresRef = useRef<HTMLHeadingElement>(null);
    const rafIdRef = useRef<number>(0);
 


    function updateStats() {
        if (fpsRef.current && wasmFractionRef.current && featuresRef.current) {
            const stats = orbStatsRef.current;
            
            if (stats.frame_interval !== Infinity){
                const fps = Math.round(1000/stats.frame_interval);
                fpsRef.current.innerText = `FPS: ${fps.toString()}`;
                wasmFractionRef.current.innerText = `WASM/JS: ${Math.round(stats.wasm_time_ms/stats.total_time_ms*100)}%`
                featuresRef.current.innerText = `Features: ${stats.features}`;
            } else {
                fpsRef.current.innerText = "FPS: N/A";
                wasmFractionRef.current.innerText = "WASM/JS: N/A";
                featuresRef.current.innerText = "Features: N/A";
            }
            
        } 
        rafIdRef.current = window.setTimeout(updateStats, 300);
    }

    useEffect(() => {
        updateStats();
        return () => {
            window.clearTimeout(rafIdRef.current);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <h3 ref={fpsRef}>FPS: N/A</h3>
            <h3 ref={wasmFractionRef}>WASM/JS: N/A</h3>
            <h3 ref={featuresRef}>Features: N/A</h3>
        </div>
    )
}