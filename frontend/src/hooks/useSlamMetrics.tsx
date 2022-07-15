import { useContext, useRef, createContext, ReactNode, RefObject} from "react"


interface PerformanceSnapshot {
    fps: number,
    wasm_proc_time: number,
    total_proc_time: number,
    features_found: number,
} 

const SlamMetricsContext = createContext
    <{updateMetrics: (s: PerformanceSnapshot) => void, lastSnapshotRef: RefObject<PerformanceSnapshot | undefined>} | null>
    (null);


export default function SlamMetricsProvider(props: {children?: ReactNode}) {
    const lastSnapshotRef = useRef<PerformanceSnapshot>();
    function updateMetrics(snpst: PerformanceSnapshot) {lastSnapshotRef.current = snpst;}
    return (
        <SlamMetricsContext.Provider value={{
            updateMetrics, 
            lastSnapshotRef, 
        }}>
            {props.children}
        </SlamMetricsContext.Provider>
    )
}

export function useSlamMetrics(){
    const context = useContext(SlamMetricsContext);
    
    function updateMetrics(snpst: PerformanceSnapshot) {
        if (context){
            context.updateMetrics(snpst);
        } else throw new Error("updateMetrics tried to access uninitialized context.");
    }

    function getSnapshot() {
        if (context){
            return context.lastSnapshotRef.current;
        } else throw new Error("getSnapshot tried to access uninitialized context.");
    }
    return { getSnapshot, updateMetrics};
}