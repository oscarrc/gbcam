import { BsChevronDown } from "react-icons/bs";
import { GBIcon } from "../icons";
import { useDynamicFavicon } from "../../hooks/useDynamicFavicon";
import { useRef } from "react";

const MODELS = ["classic", "yellow", "red", "black", "white", "blue", "green", "transparent"];

const Model = ({ theme, setTheme }) => {
    const { setFavicon } = useDynamicFavicon(theme);

    const themeRef = useRef(null);
    const toggleTheme = (theme) => {
        localStorage.setItem("theme", theme);
        themeRef.current.blur();
        setFavicon(theme);
        setTheme(theme);
    }

    return (
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
    )
}

export default Model;