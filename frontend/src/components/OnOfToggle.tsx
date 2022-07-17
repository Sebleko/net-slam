import { useState } from 'react';
import "../styles/OnOfToggle.css"

export default function OnOfToggle(state: boolean) {
   // const [isInitalLoad, setIsInitialLoad] = useState(true);

    
    return(
        <div className={`background background__${state ? "on" : "off"}`}>
            <div className={`nob nob__${state ? "on" : "off"}`}></div>
        </div>
    )
}