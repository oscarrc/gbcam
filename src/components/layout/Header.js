import { useEffect, useRef, useState } from "react";

import { BsChevronDown } from "react-icons/bs";

const MODELS = ["Yellow", "Red", "Black", "White", "Blue", "Green", "Transparent"];

const Header = () => {
    const [ theme, setTheme ] = useState(localStorage.getItem("theme") || "classic");
    const themeRef = useRef(null);

    const toggleTheme = (theme) => {
        localStorage.setItem("theme", theme.toLowerCase());
        themeRef.current.blur();
        setTheme(theme.toLowerCase());
    }

    useEffect(() => {
        document.body.dataset.theme = theme;
    }, [ theme ])

    return (
        <header>
            <div className="navbar w-full fixed top-0 left-0 bg-neutral text-neutral-content rounded-t-2xl border-b-2 border-primary border-opacity-20 px-16">
                <div className="flex-1">
                    <a href="/" className="btn btn-ghost normal-case text-4xl font-title italic">GBCam</a>
                </div>
                <div className="flex-none font-text">
                    <ul className="dropdown dropdown-end">
                        <li tabIndex="0">
                            <label ref={themeRef} role="button" aria-label="Model" className="flex items-center gap-2 mx-4">Model<BsChevronDown className="inline h-3 w-3" /></label>
                            <ul className="dropdown-content menu nav-menu shadow w-40 bg-neutral">
                                <li><button onClick={() => toggleTheme("classic") } className="normal-case">Classic</button></li>
                                {
                                    MODELS.map(m => <li key={m}><button onClick={() => toggleTheme(m) } className="normal-case">{m}</button></li> )
                                }
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}

export default Header;