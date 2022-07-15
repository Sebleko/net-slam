import { useRef } from 'react'
import useOrbFeatures from '../hooks/useOrbFeatures';
import ScannerView from '../components/ScannerView';

import SettingsIcon from '@mui/icons-material/Settings';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import DashboardPanel from '../components/DashboardPanel';
import useMediaQuery from '../hooks/useMediaQuery';
import { useErrorPopup, ErrorPopupType } from '../components/ErrorPopup';
import SlamMetricsProvider from '../hooks/useSlamMetrics';

const captureSettings = { 'video': true, 'audio': false };


export default function ScanningPage() {
    const matches = useMediaQuery('(max-width: 600px)');
    const { setStream, setImageConstraints, getFrame, isReady } = useOrbFeatures(10000000);
    const streamRef = useRef<MediaStream>();
    const [openErrorPopup, ,] = useErrorPopup();

    async function setupStream(){
        if (!streamRef.current){
            try {
                const stream = await navigator.mediaDevices.getUserMedia(captureSettings);
                streamRef.current = stream;
                setStream(stream);
            } catch (error){
                console.error(error);
                openErrorPopup("Could not open camera stream.", ErrorPopupType.Error);
            }
            
        } else {
            console.error("Tried to open stream whilst another stream is already active.");
            openErrorPopup("A video stream was already opened. \n Closing old stream.");
            closeStream();
        }
        
    }

    function closeStream(){
        setStream(undefined);
        if (streamRef.current){
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = undefined;
        };
    }

    return (
        <SlamMetricsProvider>
            <section style={{height: '100vh', position: 'relative'}}>
                <button style={{position: "absolute",right: "0",top: "0", margin: "1.5rem", zIndex:100}} onClick={e => { console.log("pressed"); openErrorPopup("This Feature is not yet implemented.", ErrorPopupType.Warning); }}>
                    <SettingsIcon  />
                </button>

                <div className="shell" style={{position:"relative", display: matches ? "box" : "flex", width: '100%', height: '100%', paddingTop: "5rem"}} >
                    <div className='view_wrapper' style={{position: matches ? "absolute" : "relative", right: 0, bottom: 0, left: 0, top: 0, flexGrow: 3}}>
                        <div style={{margin: "1rem", position: "absolute", right: 0, left: 0, bottom: 0, top: 0}}>
                            <ScannerView rendererIsReady={isReady} computeFrame={getFrame} setImageConstraints={setImageConstraints}/>
                        </div>
                    </div>
                    <div className="dashboard_wrapper" style={{position: matches ? "absolute" : "relative", right: 0, bottom: 0, left: 0, top: 0, flexGrow: 2}}>
                        <div style={{left: "1rem", top:"1rem", position: "absolute" }}><DashboardPanel/></div>
                        <div style={{right: "1rem", bottom:"1rem", position: "absolute" }}> 
                            <button onClick={() => {isReady ? closeStream() : setupStream()}}>{isReady ? <StopIcon /> : <PlayArrowIcon />}</button>
                        </div> 
                    </div>
                </div>
            </section>
        </SlamMetricsProvider>
    );
}