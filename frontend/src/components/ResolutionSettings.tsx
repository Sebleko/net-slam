import { useEffect, useReducer } from "react";
import { PixelResolutionSettings } from "../core/SlamInterfaces";
import "../styles/ResolutionSettings.css"


interface ResolutionSettingsPanelProps {
    setSettings: (width?: number, height?: number) => void;
    height?: number,
    width?: number,
}

interface State {
    width?: number,
    height?: number,
    activeField: "Width" | "Height" ;
    preserveRatio: boolean;

}
interface Action {
    type: "SetWidth" | "SetHeight" | "TogglePreserveRatio";
    payload: string;
}

const min_res = 2;
const max_res = 1000;
function validatePayload(payload: string): number{
    if (payload === "") return 0;
    let as_num = parseInt(payload);
    if (isNaN(as_num)) {
        return -1;
    }
    if (as_num < min_res){as_num = min_res;}
    if (as_num > max_res){as_num = max_res;}
    return as_num;
}

function reducer(state: State, action: Action): State{
    let {type, payload} = action;
    let num;
    switch (type) {
    case "SetHeight": 
        num = validatePayload(payload);
        if (num === -1) return {...state};

        return {...state, activeField: "Height", height: num};
    
    case "SetWidth": 
        num = validatePayload(payload);
        if (num === -1) return {...state};
      
        return {...state, activeField: "Width", width: num};
    
    case "TogglePreserveRatio": 
        state.preserveRatio = !state.preserveRatio;
        return state;

    }

}

export default function ResolutionSettingsPanel({height, width, setSettings}: ResolutionSettingsPanelProps) {

    const [state, dispatch] = useReducer(
        reducer, 
        {height, width},
        stateInitializer
    );

    useEffect(() => {
        setSettings(state.width, state.height)
    }, [state, setSettings]);
    
    return (
        <div>
            <h3>Output Resolution</h3>
            <div className="res_input_wrapper">
                <input id="quantity" disabled={getIsDisabled("Width", state)} value={state.width} onChange={e => dispatch({type: "SetWidth", payload: e.currentTarget.value})} name="width" min="0" ></input>
                <div></div>
                <input id="quantity" disabled={getIsDisabled("Height", state)} value={state.height} onChange={e => dispatch({type: "SetHeight", payload: e.currentTarget.value})} name="height" min="0" ></input>
            </div>
        </div>
    )
}

function stateInitializer(settings: PixelResolutionSettings): State {
    const preserveRatio = !(settings.height && settings.width);
    const activeField = (settings.height && !settings.width) ? "Height" : "Width";
    return {
        ...settings,
        activeField,
        preserveRatio
    }
}

function getIsDisabled(field: "Height" | "Width", state: State): boolean {
    if (state.preserveRatio && state.activeField !== field) return true;
    return false
}
