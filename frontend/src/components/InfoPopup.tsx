import { Dispatch } from 'react'
import "./InfoPopup.css"

interface InfoPopupProps {
    setShowInfo: Dispatch<React.SetStateAction<boolean>>
}
export default function InfoPopup({setShowInfo}: InfoPopupProps){
    return (
        <div className="popup_wrapper" onClick={e => setShowInfo(false)}>
            <div className="info_popup">
                <h3 className="title">Orb Extractor</h3>
                <p className="description">
                    This is an implementation of the <a href="http://www.gwylab.com/download/ORB_2012.pdf">ORB feature detection algorithm</a> in WebAssembly running in the browser.
                </p>
                <div className="middle">
                    
                </div>
                <hr></hr>
            
                <p>Source code: <a href="https://github.com/Sebleko/net-slam">https://github.com/Sebleko/net-slam</a></p>
            </div>
        </div>
    )
}