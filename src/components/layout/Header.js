import {CamIcon, GBIcon, PaletteIcon} from "../partials/";
import { useEffect, useMemo, useRef, useState } from "react";

import { BsChevronDown } from "react-icons/bs";
import { useDynamicFavicon } from "../../hooks/useDynamicFavicon";
import { useGbCam } from "../../hooks/useGbCam";

const MODELS = ["classic", "yellow", "red", "black", "white", "blue", "green", "transparent"];
const PALETTES = ["DMG", "GBC 1", "GBC 2", "GBC 3", "GBC 4", "GBC 5", "GBC 6", "GBC 7", "GBC 8", "GBC 9", "GBC 10", "GBC 11", "GBC 12", "Gray"];

const Header = () => {
    const [ theme, setTheme ] = useState(localStorage.getItem("theme") || "classic");
    const { setFavicon } = useDynamicFavicon(theme);
    const { facingUser, setFacingUser, multiplier, setMultiplier, palette, setPalette, capture } = useGbCam();
    
    const themeRef = useRef(null);
    const paletteRef = useRef(null);
    const multiplierRef = useRef(null);

    const disabled = useMemo(() => capture ? { "aria-disabled": true } :  { tabIndex: 1 }, [capture])

    const flipCamera = () => setFacingUser(u => !u);
    
    const toggleTheme = (theme) => {
        localStorage.setItem("theme", theme);
        themeRef.current.blur();
        setFavicon(theme);
        setTheme(theme);
    }

    const switchPalette = (p) => {
        localStorage.setItem("palette", p);
        paletteRef.current.blur();
        setPalette(p);
    }

    const switchMultiplier = (v) => {
        localStorage.setItem("multiplier", v);
        multiplierRef.current.blur();
        setMultiplier(v);
    }

    useEffect(() => {
        document.body.dataset.theme = theme;
    }, [ theme ])
    
    return (
        <header className="relative w-full z-20">
            <nav className="navbar bg-gradient-gb text-neutral-content rounded-t-2xl border-b-2 border-primary border-opacity-20 min-h-12 py-0 px-12">
                <div className="flex-1">
                    <a href="/" className="btn btn-ghost normal-case text-2xl sm:text-4xl font-title italic">GBCam</a>
                </div>
                <div className="flex-none font-text mx-4 gap-2">
                    <div className="dropdown dropdown-end font-text self-end">
                        <label {...disabled} role="button" ref={multiplierRef} aria-label="Model" className={`block font-bold leading-3 ${capture && 'opacity-25 cursor-not-allowed'}`}>
                            x{multiplier}
                        </label>
                        <ul className="dropdown-content menu nav-menu shadow bg-neutral top-8">
                            {
                                Array.from({length: 4}, (_, i) => i + 1).map(m => (
                                    <li key={m}>
                                        <button onClick={() => switchMultiplier(m)}> x{m} </button>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <button onClick={flipCamera} aria-label="flip camera">
                        <CamIcon className={`h-6 w-6 ${theme}`} selfie={ facingUser }/>
                    </button>
                    <div className="dropdown dropdown-end">
                        <label {...disabled} role="button" ref={paletteRef} aria-label="Palete" className={`flex items-center gap-2 ${capture && 'opacity-25 cursor-not-allowed'}`}>                            
                            <PaletteIcon className="h-6 w-6" palette={palette}/>
                        </label>
                        <ul className="dropdown-content menu nav-menu shadow w-40 bg-neutral top-8">
                            {
                                PALETTES.map( (p, i) => (
                                    <li key={p}>
                                        <button onClick={() => switchPalette(i) }className={`capitalize`}>
                                            <PaletteIcon className="h-6 w-6" palette={i}/>
                                            {p}
                                        </button>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="dropdown dropdown-end">
                        <label tabIndex="0" role="button" ref={themeRef} aria-label="Model" className="flex items-center gap-2">
                            <GBIcon className={`inline h-6 w-6 ${theme} selected`} /><BsChevronDown className="inline h-3 w-3" />
                        </label>
                        <ul className="dropdown-content menu nav-menu shadow w-40 bg-neutral top-8">
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
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header;