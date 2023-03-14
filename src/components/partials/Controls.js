import { BsCaretDownFill, BsCaretLeftFill, BsCaretRightFill, BsCaretUpFill } from "react-icons/bs"

import { useCamera } from "../../hooks/useCamera";

const Controls = () => {
    const { setBrightness, setContrast, snapshot, recording, selectFrame } = useCamera();

    const handleUp = () => {
        (!snapshot && !recording) && setBrightness( b => b + 1 > 200 ? 200 : b + 1 )
        (snapshot || recording ) && selectFrame(1)
    }

    const handleDown = () => {
        (!snapshot && !recording) && setBrightness( b => b - 1 < 0 ? 0 : b - 1)
        (snapshot || recording ) && selectFrame(-1)
    }

    const handleRight = () => {
        (!snapshot && !recording) && setContrast( c => c + 1 > 200 ? 200 : c + 1 )
        (snapshot || recording ) && selectFrame(1)
    }
    const handleLeft = () => { 
        (!snapshot && !recording) && setContrast( c => c - 1 < 0 ? 0 : c - 1 ) 
        (snapshot || recording ) && selectFrame(-1)
    }
    
    return (
        <div className="grid grid-cols-3 grid-rows-3">
            <div className="relative right-[5%] bottom-[5%] rounded flex items-center justify-center w-[110%] h-[110%] bg-primary col-start-2 row-start-2">
                <span className="rounded-full bg-white bg-opacity-5 h-6 w-6 block" />
            </div>
            <button onClick={handleUp} className="relative shadow-lg rounded-sm rounded-b-none col-start-2 btn btn-primary btn-sm btn-square" aria-label="Brightness Up"><BsCaretUpFill className="text-base-100 opacity-25 absolute -top-4" /></button>
            <button onClick={handleDown} className="relative shadow-lg rounded-sm rounded-t-none col-start-2 row-start-3 btn btn-primary btn-sm btn-square" aria-label="Brightness Down"><BsCaretDownFill className="text-base-100 opacity-25 absolute -bottom-4" /></button>
            <button onClick={handleRight} className="relative shadow-lg rounded-sm rounded-l-none col-start-3 row-start-2 btn btn-primary btn-sm btn-square" aria-label="Contrast Up"><BsCaretRightFill className="text-base-100 opacity-25 absolute -right-4" /></button>
            <button onClick={handleLeft} className="relative shadow-lg rounded-sm rounded-r-none row-start-2 btn btn-primary btn-sm btn-square" aria-label="Contrast Down"><BsCaretLeftFill className="text-base-100 opacity-25 absolute -left-4" /></button>
        </div>
    )
}

export default Controls;