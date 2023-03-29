import { BsCaretDownFill, BsCaretLeftFill, BsCaretRightFill, BsCaretUpFill } from "react-icons/bs"

import { useGbCam } from "../../hooks/useGbCam";

const DPad = () => {
    const { setting, capture, option, setOption } = useGbCam();

    const handleUp = () => {
        if(capture) return;
        switch(option){
            case 0:
                setOption(1);
                break;
            case 2:
                break;
            case 3: 
                break;
            case 4:
                setting({ type: "ratio", payload: 1 }); 
                break;
            default:
                setting({ type: "brightness", payload: 1 }); 
        }
    }

    const handleRight = () => {
        if(capture) return;
        switch(option){
            case 0:
                setOption(2);
                break;
            case 2:
                setting({ type: "frame", payload: 1 }); 
                break;
            case 3: 
                break;
            case 4:
                break;
            default:
                setting({ type: "contrast", payload: 1 }); 
        }
    }

    const handleDown = () => {
        if(capture) return;
        switch(option){
            case 0:
                setOption(3);
                break;
            case 2:
                break;
            case 3: 
                break;
            case 4:
                setting({ type: "ratio", payload: -1 }); 
                break;
            default:
                setting({ type: "brightness", payload: -1 }); 
        }
    }

    const handleLeft = () => {
        if(capture) return; switch(option){
            case 0:
                setOption(4);
                break;
            case 2:
                setting({ type: "frame", payload: -1 }); 
                break;
            case 3:
                break;
            case 4:
                break;
            default:
                setting({ type: "contrast", payload: -1 }); 
        }
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

export default DPad;