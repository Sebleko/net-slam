import {createContext, useState, useContext, ReactNode } from 'react';
import { CSSTransition } from 'react-transition-group'
import './ErrorPopup.css';

import WarningIcon from '@mui/icons-material/Warning';

interface ErrorContextValues {
    closeErrorPopup: () => void,
    openErrorPopup: (msg: string, dur: number, type: ErrorPopupType) => void,
}
export const ErrorContext = createContext<ErrorContextValues>({closeErrorPopup: () => {console.error("CloseErrorPopupCalled but context was uninitialized.")}, openErrorPopup: (msg, dur) => {console.error("OpenErrorPopupCalled but context was uninitialized.")}});

type ErrorPopupProps = {
    children?: ReactNode,
}

export enum ErrorPopupType {
    Error = "error",
    Warning = "warning",
}


export default function ErrorPopupProvider(props: ErrorPopupProps) {
    const [open, setOpen] = useState(false);
    const [duration, setDuration] = useState<number>(5000);
    const [timeoutId, setTimeoutId] = useState<number>();
    const [message, setMessage] = useState('');
    const [type, setType] = useState(ErrorPopupType.Error);
    
    const triggerSnackbar = (message: string, duration: number, type: ErrorPopupType) => {
        setMessage(message);
        setDuration(duration);
        setType(type);
        setOpen(true);
    }

    function openErrorPopup(message: string, duration: number, type: ErrorPopupType) {
        if (open === true) {
            setOpen(false)
            setTimeout(() => {
              triggerSnackbar(message, duration, type);
            }, 150)
        } else {
            triggerSnackbar(message, duration, type);
        }
    }

    const closeErrorPopup = () => {
        setOpen(false)
    }
    return (
        <ErrorContext.Provider value={{ openErrorPopup, closeErrorPopup }}>
            {props.children}
            <CSSTransition
                in={open}
                timeout={200}
                mountOnEnter
                unmountOnExit
                // Sets timeout to close the ErrorPopup
                onEnter={() => {
                    window.clearTimeout(timeoutId);
                    const newId = window.setTimeout(() => setOpen(false), duration);
                    setTimeoutId(newId);
                }}
                // Sets custom classNames based on "position"
                classNames="error_popup_wrapper" className="error_popup_wrapper_general"
            >
                <div>
                    <div className={`error_popup error_popup_type__${type}`}>
                        <WarningIcon /> 
                        <h4 className='error_popup__message'>{message}</h4>
                   
                    </div>
                </div>
            </ CSSTransition>
        </ErrorContext.Provider>
    )
}

export function useErrorPopup() {
    const context = useContext(ErrorContext);

    function open(text="", type=ErrorPopupType.Error, duration=5000){
        if (context) {
            context.openErrorPopup(text, duration, type);
        } else throw new Error("useErrorPopup tried to access uninitialized Context.");
    }

    return [open, context?.closeErrorPopup];
}