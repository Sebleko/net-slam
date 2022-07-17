import { useRef, useState, Dispatch, useEffect } from 'react'
import useOrbFeatures, { OrbSettings } from '../hooks/useOrbFeatures';
import ScannerView from '../components/ScannerView';

import SettingsIcon from '@mui/icons-material/Settings';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import DashboardPanel from '../components/DashboardPanel';
import useMediaQuery from '../hooks/useMediaQuery';
import { useErrorPopup, ErrorPopupType } from '../components/ErrorPopup';
import { useFullscreenPopup } from '../components/FullscreenPopup';

import ResolutionSettingsPanel from '../components/ResolutionSettings';
const captureSettings = { 'video': true, 'audio': false };


export default function ScanningPage() {
    const matches = useMediaQuery('(max-width: 600px)');
    const [playPressed, setPlayPressed] = useState<boolean>(false);
    const playPressedRef = useRef(playPressed);
    const [sensorStream, setSensorStream] = useState<MediaStream|null>(null);
    const [orbSettings, setOrbSettings] = useState<OrbSettings>({output_width: 700})
    const { orbStream, orbStatsRef } = useOrbFeatures(sensorStream, orbSettings);

    const [openErrorPopup, ,] = useErrorPopup();
    const { openFullscreenPopup, closeFullscreenPopup } = useFullscreenPopup();

    useEffect(() => {
        playPressedRef.current = playPressed;
        if (playPressed){
            navigator.mediaDevices.getUserMedia(captureSettings)
            .then(stream => {
                if (playPressedRef.current) setSensorStream(stream);
            })
            .catch(err => {
                console.error(err);
                openErrorPopup("Could not open camera stream.", ErrorPopupType.Error);
            })
        }

        return () => {
            if (playPressed){
                setSensorStream(null)
            }
        }
        
    }, [playPressed, openErrorPopup])

    useEffect(() => {
        return () => {
            if (sensorStream){
                sensorStream.getTracks().forEach(t => t.stop());
            }
        }
    }, [sensorStream])



    return (
        <>
            <section style={{height: '100vh', position: 'relative'}}>
                <div style={{position: "absolute",right: "0",top: "0", margin: "1.5rem", zIndex:100}}>
                    <button onClick={e => openFullscreenPopup(<InfoPopupContent close={closeFullscreenPopup}/>)} >
                        <QuestionMarkIcon />
                    </button>
                    <button  onClick={e => {openFullscreenPopup(<SettingsPopupContent settings={orbSettings} setSettings={setOrbSettings}/>)}}>
                        <SettingsIcon  /> 
                    </button>
                </div>

                <div className="shell" style={{position:"relative", display: matches ? "box" : "flex", width: '100%', height: '100%', paddingTop: "5rem"}} >
                    <div className='view_wrapper' style={{position: matches ? "absolute" : "relative", right: 0, bottom: 0, left: 0, top: 0, flexGrow: 3}}>
                        <div style={{margin: "1rem", position: "absolute", right: 0, left: 0, bottom: 0, top: 0}}>
                            <ScannerView stream={orbStream}/>
                        </div>
                    </div>
                    <div className="dashboard_wrapper" style={{position: matches ? "absolute" : "relative", right: 0, bottom: 0, left: 0, top: 0, flexGrow: 2}}>
                        <div style={{left: "1rem", top:"1rem", position: "absolute" }}><DashboardPanel orbStatsRef={orbStatsRef}/></div>
                        <div style={{right: "1rem", bottom:"1rem", position: "absolute" }}> 
                            <button onClick={() => setPlayPressed(prev => !prev)}>{playPressed ? <StopIcon /> : <PlayArrowIcon />}</button>
                        </div> 
                    </div>
                </div>
            </section>
        </>
    );
}


function InfoPopupContent({close}: {close: () => void}){
    return (
        <>
            <h3 className="title">Orb Extractor</h3>
            <p className="description">
                This is an implementation of the <a href="http://www.gwylab.com/download/ORB_2012.pdf">ORB feature detection algorithm</a> in WebAssembly running in the browser.
            </p>
            <div className="middle" style={{margin: "auto"}}>
                
            </div>
            <hr style={{color: "rgb(0, 0, 93)"}}></hr>
        
            <p>Source code: <a href="https://github.com/Sebleko/net-slam">https://github.com/Sebleko/net-slam</a></p>
        </>
    )
}



function SettingsPopupContent({settings, setSettings}: {settings: OrbSettings, setSettings: Dispatch<OrbSettings>}){

    useEffect(() => {
        "Settings have changed"
    }, [settings])

    function dispatchResolutionSettings(width?: number, height?: number): void {
        setSettings({output_width: width, output_height: height});
    }
    

    return (
        <>
            <h3 className="title">Settings</h3>
            <hr style={{color: "rgb(0, 0, 93)"}}></hr>

            

            <div className="middle" style={{margin: "auto", display: 'flex', flexDirection:'column'}}>
                <ResolutionSettingsPanel height={settings.output_height} width={settings.output_width} setSettings={dispatchResolutionSettings}/>
            </div>
            <hr style={{color: "rgb(0, 0, 93)"}}></hr>
        
        </>
    )
}