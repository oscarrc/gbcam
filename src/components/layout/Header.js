import {CamIcon, GBIcon} from "../partials/";
import { useEffect, useRef, useState } from "react";

import { BsChevronDown } from "react-icons/bs";
import { useCamera } from "../../hooks/useCamera";
import { useDynamicFavicon } from "../../hooks/useDynamicFavicon";

const MODELS = ["classic", "yellow", "red", "black", "white", "blue", "green", "transparent"];

const Header = () => {
    const [ theme, setTheme ] = useState(localStorage.getItem("theme") || "classic");
    const themeRef = useRef(null);
    const { setFavicon } = useDynamicFavicon(theme);
    const { flipCamera, selfie, constraints } = useCamera();
    
    const toggleTheme = (theme) => {
        localStorage.setItem("theme", theme);
        themeRef.current.blur();
        setFavicon(theme);
        setTheme(theme);
    }

    useEffect(() => {
        document.body.dataset.theme = theme;
    }, [ theme ])
    
    return (
        <header className="relative w-full bg-base-100 z-20">
            <nav className="navbar bg-neutral bg-gradient-gb text-neutral-content rounded-t-2xl border-b-2 border-primary border-opacity-20 min-h-12 py-0 px-12">
                <div className="flex-1">
                    <a href="/" className="btn btn-ghost normal-case text-2xl sm:text-4xl font-title italic">GBCam</a>
                </div>
                <div className="flex-none font-text mx-4 gap-2">
                    {
                        constraints['facingMode'] &&
                            <button onClick={flipCamera} aria-label="flip camera">
                                <CamIcon className={`h-6 w-6 ${theme}`} selfie={ selfie }/>
                            </button>
                    }
                    <ul className="dropdown dropdown-end">
                        <li tabIndex="0">
                            <button ref={themeRef} aria-label="Model" className="flex items-center gap-2">
                                <GBIcon className={`inline h-6 w-6 ${theme} selected`} /><BsChevronDown className="inline h-3 w-3" />
                            </button>
                            <ul className="dropdown-content menu nav-menu shadow w-40 bg-neutral">
                                {
                                    MODELS.map(m => (
                                        m !== theme &&
                                            <li key={m}>
                                                <button onClick={() => toggleTheme(m) } className={`capitalize ${ theme === m && 'active'} `}>
                                                    <GBIcon className={`inline h-6 w-6 ${m}`} />
                                                    {m}
                                                </button>
                                            </li>
                                    ))
                                }
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    )
}

export default Header;