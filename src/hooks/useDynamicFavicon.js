import { useEffect, useState } from "react"

const useDynamicFavicon = (theme) => {
    const [state] = useState(theme);

    const generateFavicon = (state) => {
        let faviconUrl = "data:image/svg+xml";
        return faviconUrl;
    }

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const link = window.document.querySelector("link[rel*='icon']") || window.document.createElement("link");

        link.type = "image/svg+xml"
        link.rel = "shortcut icon"
        link.href = generateFavicon(state)
    
        window.document.getElementsByTagName("head")[0].appendChild(link)
    }, [state])
}

export { useDynamicFavicon }