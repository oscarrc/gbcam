import { createContext, useContext, useEffect, useState } from "react";

import { colors } from "../constants/colors";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {    
    const [ theme, setTheme ] = useState(localStorage.getItem("theme") || "classic");
    
    const favicon = '<svg id="Favicon" data-name="Favicon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"><defs><style>.classic{fill:#babcc1}.yellow{fill:#f1b32f}.red{fill:#e22e32}.black{fill:#000}.white{fill:#fff}.blue{fill:#154d9a}.green{fill:#00b67d}.transparent{fill:#1d5a33}.cls-2{fill:#1d1d1b}.cls-2,.cls-4,.cls-6,.cls-8{opacity:.5}.cls-3,.cls-4{stroke:#010101}.cls-3,.cls-4,.cls-5{stroke-miterlimit:10}.cls-3,.cls-5{stroke-width:12px}.cls-3{fill:url(#Grad_210)}.cls-4{stroke-width:10px;fill:url(#Grad_163)}.cls-11,.cls-5{fill:#fff}.cls-5{stroke:#fff}.cls-6{fill:url(#Grad_186)}.cls-7{fill:url(#Grad_222)}.cls-8{fill:#808181;isolation:isolate}.cls-9{fill:#1b1b1b}.cls-10{fill:#010101}</style><radialGradient id="Grad_210" data-name="Grad210" cx="454.25" cy="457.53" fx="437.6138624307665" r="397.92" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#343434"/><stop offset="0.54" stop-color="#1a1a1a"/><stop offset="0.97" stop-color="#010101"/></radialGradient><radialGradient id="Grad_163" data-name="Grad163" cx="450.1" cy="456.15" fx="433.4616132958196" r="397.92" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="1"/></radialGradient><radialGradient id="Grad_186" data-name="Grad186" cx="473.09" cy="475.86" fx="473.0935777025725" r="295.51" xlink:href="#Grad_163"/><radialGradient id="Grad_222" data-name="Grad222" cx="509.92" cy="520.54" r="115.57" gradientUnits="userSpaceOnUse"><stop offset="0.91" stop-color="gray"/><stop offset="1" stop-color="#fff"/></radialGradient></defs><g id="Fondo"><rect id="Relleno" class="color yellow cls-1" width="1024" height="1024"/><rect id="Sombra" class="cls-2" x="372.48" y="391.57" width="807.37" height="767.15" transform="translate(-320.78 775.87) rotate(-45)"/></g><g id="Cam"><circle class="cls-3" cx="513.38" cy="513.38" r="397.92"/><circle class="cls-4" cx="509.23" cy="512" r="397.92"/><ellipse class="cls-5" cx="510.62" cy="513.38" rx="292.73" ry="298.27"/><ellipse class="cls-6" cx="509.23" cy="512" rx="292.73" ry="298.27"/><circle class="cls-7" cx="509.92" cy="520.54" r="115.57"/><polygon class="cls-8" points="352.83 547.82 290.55 520 352.83 492.46 352.83 547.82"/><circle class="cls-9" cx="509.92" cy="520.54" r="99.65"/><circle class="cls-10" cx="509.92" cy="520.54" r="38.06"/><circle class="cls-11" cx="523.07" cy="512" r="9"/></g></svg>';

    const setFavicon = (theme) => {
        if (typeof window === 'undefined') return;
        const link = window.document.querySelector("link[rel*='icon']") || window.document.createElement("link");
        const meta = window.document.querySelector("meta[name='theme-color']");
        
        link.type = "image/svg+xml";
        link.rel = "icon";
        link.href = "data:image/svg+xml;utf8," + favicon
                    .replace(/color\s\S*\s/g, `color ${theme} `)
                    .replace(/"/g, '\'')
                    .replace(/%/g, '%25')
                    .replace(/#/g, '%23')       
                    .replace(/{/g, '%7B')
                    .replace(/}/g, '%7D')         
                    .replace(/</g, '%3C')
                    .replace(/>/g, '%3E')
                    .replace(/\s+/g,' ');

        meta.content = colors[theme];    
        window.document.getElementsByTagName("head")[0].appendChild(link);
    }

    useEffect(() => {
        document.body.dataset.theme = theme;        
        localStorage.setItem("theme", theme);
        setFavicon(theme)
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            { children }
        </ThemeContext.Provider>
    )
}

const useTheme = () => {
    const context = useContext(ThemeContext);
    if(context === undefined) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
}

export {ThemeProvider, useTheme}