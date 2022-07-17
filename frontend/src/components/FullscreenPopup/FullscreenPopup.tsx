import { createContext, useContext, ReactNode, useState } from 'react'
import "./FullscreenPopup.css"

interface FullscreenPopupContextInterface {
    openFullscreenPopup: (children: ReactNode) => void;
    closeFullscreenPopup: () => void;
}
const FullscreenPopupContext = createContext<FullscreenPopupContextInterface>({
    openFullscreenPopup: (c) => {console.error("openFullscreenPopup called but context was uninitialized.")},
    closeFullscreenPopup: () => {console.error("closeFullscreenPopup called but context was uninitialized.")},
})


interface FullscreenPopupProviderProps {
    children: ReactNode,
}
export default function FullscreenPopupProvider({ children }: FullscreenPopupProviderProps){
    const [popupChildren, setPopupChildren] = useState<ReactNode|undefined>();

    function openFullscreenPopup(children: ReactNode){
        setPopupChildren(children);
    }
    function closeFullscreenPopup(){
        setPopupChildren(undefined);
    }

    return (
        <FullscreenPopupContext.Provider value={{openFullscreenPopup, closeFullscreenPopup}}>
            {popupChildren && <PopupWrapper hidePopup={closeFullscreenPopup}>{popupChildren}</PopupWrapper>}
            {children}
        </FullscreenPopupContext.Provider>
    )
}


export function useFullscreenPopup(){
    const context = useContext(FullscreenPopupContext);
    function openFullscreenPopup(children: ReactNode){
        if (context) {
            context.openFullscreenPopup(children);
        } else throw new Error("useFullscreenPopup tried to access uninitialized Context.");
    }
    function closeFullscreenPopup(){
        if (context) {
            context.closeFullscreenPopup();
        } else throw new Error("useFullscreenPopup tried to access uninitialized Context.");

    }
    return { openFullscreenPopup, closeFullscreenPopup }
}


function PopupWrapper(props: {children: ReactNode, hidePopup: () => void}) {
    return (
        <div className="popup_wrapper" onClick={e => props.hidePopup()}>
            <div className="info_popup" onClick={e => e.stopPropagation()}>
                {props.children}
            </div>
        </div>
    )
}