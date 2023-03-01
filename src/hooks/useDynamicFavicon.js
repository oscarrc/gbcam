import { useCallback, useEffect } from "react";

import colors from "../constants/colors";

const useDynamicFavicon = (theme) => {
    const favicon = '<svg id="Favicon" data-name="Favicon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"><defs><style>.cls-1 {fill: url(#Grad1);}.cls-2 {fill: url(#Grad9);}.cls-2, .cls-3, .cls-4, .cls-5, .cls-6, .cls-7, .cls-8, .cls-9, .cls-10 {stroke-miterlimit: 10;}.cls-2, .cls-3, .cls-4, .cls-6, .cls-7, .cls-8, .cls-10 {stroke: #000;}.cls-2, .cls-3, .cls-4, .cls-9 {stroke-width: 12px;}.cls-11, .cls-9, .cls-10 {fill: #fff;}.cls-3 {fill: url(#Grad3);}.cls-4 {fill: url(#Grad8);}.cls-5 {stroke: #1a1a1a;stroke-width: 20px;}.classic { fill: #BABCC1; }.yellow { fill: #F1B32F; }.red { fill: #E22E32; }.black { fill: #000000; }.white { fill: #ffffff; }.blue { fill: #154D9A; }.green { fill: #00B67D; }.transparent { fill: #1D5A33; }.cls-13 {fill: url(#Grad2);}.cls-6 {fill: url(#Grad4);}.cls-6, .cls-7, .cls-8 {stroke-width: 10px;}.cls-6, .cls-14, .cls-15 {opacity: .5;}.cls-7, .cls-16 {fill: none;}.cls-8 {fill: url(#Grad7);}.cls-17 {fill: #224939;}.cls-18 {fill: #212121;}.cls-19 {clip-path: url(#clippath);}.cls-14 {fill: url(#Grad10);}.cls-9 {stroke: #fff;}.cls-20 {fill: #1a1a1a;}.cls-10 {stroke-width: 5px;}.cls-21 {fill: url(#Grad6);}.cls-15 {fill: url(#Grad5);}</style><linearGradient id="Grad1" data-name="Grad1" x1="319" y1="485.46" x2="319" y2="561" gradientUnits="userSpaceOnUse"><stop offset=".55" stop-color="#1a1a1a"/><stop offset=".76" stop-color="#101010"/><stop offset=".99" stop-color="#000"/></linearGradient><linearGradient id="Grad2" data-name="Grad2" x1="708.45" y1="485.26" x2="708.45" y2="561.01" xlink:href="#Grad1"/><radialGradient id="Grad3" data-name="Grad3" cx="472.77" cy="272.15" fx="460.76" fy="272.15" r="287.5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#333"/><stop offset=".54" stop-color="#1a1a1a"/><stop offset=".97" stop-color="#000"/></radialGradient><radialGradient id="Grad4" data-name="Grad4" cx="469.77" cy="271.15" fx="457.76" fy="271.15" r="287.5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient><radialGradient id="Grad5" data-name="Grad5" cx="486.39" cy="285.39" fx="486.39" fy="285.39" r="213.51" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient><radialGradient id="Grad6" data-name="Degradado sin nombre 222" cx="513" cy="317.67" fx="513" fy="317.67" r="83.5" gradientUnits="userSpaceOnUse"><stop offset=".91" stop-color="gray"/><stop offset="1" stop-color="#fff"/></radialGradient><linearGradient id="Grad7" data-name="Grad7" x1="35" y1="880.5" x2="993" y2="880.5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4d4d4d"/><stop offset=".03" stop-color="#434343"/><stop offset=".08" stop-color="#2a2a2a"/><stop offset=".1" stop-color="#1a1a1a"/><stop offset=".9" stop-color="#1a1a1a"/><stop offset=".99" stop-color="#333"/></linearGradient><linearGradient id="Grad8" data-name="Grad8" x1="36" y1="640.29" x2="212" y2="640.29" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4d4d4d"/><stop offset=".15" stop-color="#434343"/><stop offset=".4" stop-color="#2a2a2a"/><stop offset=".53" stop-color="#1a1a1a"/></linearGradient><linearGradient id="Grad9" data-name="Grad9" x1="815.93" y1="640.34" x2="992" y2="640.34" gradientUnits="userSpaceOnUse"><stop offset=".47" stop-color="#1a1a1a"/><stop offset=".74" stop-color="#313131"/><stop offset="1" stop-color="#4d4d4d"/></linearGradient><clipPath id="clippath"><rect class="cls-16" width="1024" height="1024"/></clipPath><linearGradient id="Grad10" data-name="Grad10" x1="-37.75" y1="1682.13" x2="1062.25" y2="1682.13" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1a1a1a"/><stop offset=".05" stop-color="#2c2c2c" stop-opacity=".64"/><stop offset=".1" stop-color="#4d4d4d" stop-opacity="0"/><stop offset=".9" stop-color="#4d4d4d" stop-opacity="0"/><stop offset=".99" stop-color="#1a1a1a"/></linearGradient></defs><g><path class="cls-1" d="M124,547.98v-14.57c0-13.76,9.36-25.76,22.71-29.1l71.7-17.95c2.38-.6,4.83-.9,7.29-.9h288.3v75.54H124"/><path class="cls-13" d="M903.47,547.71v-14.57c-.02-13.76-9.39-25.75-22.74-29.09l-71.71-17.9c-2.38-.59-4.83-.89-7.29-.89l-288.3,.2,.05,75.54,390-.28"/></g><circle class="cls-3" cx="515.5" cy="312.5" r="287.5"/><circle class="cls-6" cx="512.5" cy="311.5" r="287.5"/><ellipse class="cls-9" cx="513.5" cy="312.5" rx="211.5" ry="215.5"/><ellipse class="cls-15" cx="512.5" cy="311.5" rx="211.5" ry="215.5"/><circle class="cls-21" cx="513" cy="317.67" r="83.5"/><circle class="cls-20" cx="513" cy="317.67" r="72"/><circle cx="513" cy="317.67" r="27.5"/><rect class="cls-8" x="35" y="763" width="958" height="235"/><rect x="239" y="763" width="49" height="235"/><rect x="745" y="763" width="49" height="235"/><rect class="color yellow cls-5" x="222.82" y="575.75" width="581" height="168"/><path class="cls-4" d="M41.97,582.13l-5.97,171.87H212v-217.42c0-6.72-6.5-11.53-12.93-9.56l-150.03,45.89c-4.08,1.25-6.92,4.95-7.07,9.22Z"/><path class="cls-2" d="M986.24,582.14c1.92,57.29,3.84,114.57,5.76,171.86l-176,.06-.07-217.42c0-6.72,6.49-11.53,12.92-9.57,50.1,15.28,100.21,30.57,150.31,45.85,4.09,1.25,6.93,4.96,7.08,9.23Z"/><rect class="cls-7" x="211" y="563" width="602" height="191"/><circle class="cls-11" cx="522.5" cy="311.5" r="6.5"/><g><path class="cls-10" d="M333.09,702.81c0-5.58,4.67-9.83,14-12.75-2.33-1.08-4.21-2.58-5.62-4.5-1.42-1.92-2.12-3.92-2.12-6,0-3.25,1.38-5.79,4.12-7.62,1.67-1.08,4.08-2.04,7.25-2.88-6.67-3.92-10-9.38-10-16.38,0-5.58,2.29-10.54,6.88-14.88,4.58-4.33,10.71-6.5,18.38-6.5h31.75l-1.62,12.5h-9.12c1.5,3.25,2.25,6.25,2.25,9,0,5.58-2.08,10.46-6.25,14.62s-10.04,6.25-17.62,6.25c-4.08,0-6.81,.19-8.19,.56s-2.06,1.15-2.06,2.31,1.17,2.04,3.5,2.62c2.33,.58,5.19,1.15,8.56,1.69,3.38,.54,6.75,1.29,10.12,2.25,3.38,.96,6.23,2.73,8.56,5.31,2.33,2.58,3.5,5.88,3.5,9.88,0,12.25-9.75,18.38-29.25,18.38-9.83,0-16.79-1.36-20.88-4.06-4.08-2.71-6.12-5.98-6.12-9.81Zm25.12-9.38c-6.92,.92-10.38,3.12-10.38,6.62,0,3.92,4.17,5.88,12.5,5.88,4.75,0,8.14-.42,10.19-1.25,2.04-.83,3.06-2.21,3.06-4.12,0-1.75-.9-3.02-2.69-3.81-1.79-.79-4.98-1.69-9.56-2.69-1.33-.25-2.38-.46-3.12-.62Zm15.25-42.62c0-2.5-.71-4.48-2.12-5.94-1.42-1.46-3.33-2.19-5.75-2.19-6.08,0-9.12,4.17-9.12,12.5,0,2.5,.69,4.42,2.06,5.75,1.38,1.33,3.27,2,5.69,2,6.17,0,9.25-4.04,9.25-12.12Z"/><path class="cls-10" d="M428.47,602.81l-4.88,34.25c5.25-4.5,10.38-6.75,15.38-6.75,6.08,0,11.12,2.42,15.12,7.25,4,4.83,6,10.92,6,18.25,0,4.17-.71,8.17-2.12,12-1.42,3.83-3.54,7.38-6.38,10.62-2.83,3.25-6.67,5.86-11.5,7.81-4.83,1.96-10.33,2.94-16.5,2.94-9.17,0-17.12-.62-23.88-1.88l11.88-84.5h16.88Zm-6.75,48l-3.5,24.25c2,.25,3.92,.38,5.75,.38,6.33,0,11.02-1.64,14.06-4.94,3.04-3.29,4.56-7.94,4.56-13.94,0-3.83-.9-6.88-2.69-9.12-1.79-2.25-4.15-3.38-7.06-3.38-3.67,0-7.38,2.25-11.12,6.75Z"/><path class="cls-10" d="M515.47,671.69l-2,15.38c-5.5,1.42-11.33,2.12-17.5,2.12-8.5,0-15.44-2.54-20.81-7.62-5.38-5.08-8.06-11.67-8.06-19.75,0-8.92,3.5-16.39,10.5-22.44,7-6.04,15.62-9.06,25.88-9.06,6.25,0,11.46,.67,15.63,2l-2.12,15.25c-3.58-1.33-5.92-2.08-7-2.25-.75-.17-2.5-.25-5.25-.25-5.67,0-10.44,1.67-14.31,5-3.88,3.33-5.81,7.46-5.81,12.38,0,4.17,1.29,7.38,3.88,9.62,2.58,2.25,6.21,3.38,10.88,3.38,4.42,0,9.79-1.25,16.13-3.75Z"/><path class="cls-10" d="M559.59,688.06l.75-5.25c-5.25,4.17-10.71,6.25-16.38,6.25s-10.5-2.27-14.25-6.81c-3.75-4.54-5.62-10.35-5.62-17.44,0-4.33,.73-8.46,2.19-12.38,1.46-3.92,3.73-7.56,6.81-10.94,3.08-3.38,7.38-6.06,12.88-8.06s11.92-3,19.25-3c6.83,0,13.21,.58,19.12,1.75l-7.88,55.88h-16.88Zm2.38-16.5l3.75-27c-.08,0-.61-.06-1.56-.19-.96-.12-1.65-.19-2.06-.19-3.33,0-6.29,.54-8.88,1.62-2.58,1.08-4.58,2.42-6,4-1.42,1.58-2.58,3.42-3.5,5.5-.92,2.08-1.5,3.94-1.75,5.56s-.38,3.23-.38,4.81c0,3.42,.73,6.08,2.19,8,1.46,1.92,3.48,2.88,6.06,2.88,4.08,0,8.12-1.67,12.12-5Z"/><path class="cls-10" d="M616.84,631.31l-1,7.25,.25,.25c5.92-5.67,11.83-8.5,17.75-8.5,3.75,0,6.89,.92,9.44,2.75,2.54,1.83,4.19,4.38,4.94,7.62,4-3.75,7.56-6.42,10.69-8,3.12-1.58,6.44-2.38,9.94-2.38,6,0,10.46,2.11,13.38,6.31,2.92,4.21,3.92,9.61,3,16.19l-4.88,35.25h-16.88l4.62-32.62c1.17-8.42-.33-12.62-4.5-12.62s-8.67,2.96-13.75,8.88l-5.12,36.38h-16.88l4.38-32.5c.58-4.42,.5-7.64-.25-9.69-.75-2.04-2.29-3.06-4.62-3.06-3.58,0-8.04,2.96-13.38,8.88l-5.12,36.38h-16.88l8-56.75h16.88Z"/></g><g class="cls-19"><g id="layer3"><path id="rect9640" class="color yellow cls-12" d="M2.63,763.06H1021.36c22.52,0,40.64,18.13,40.64,40.64v1644.9c-15.22,36.43-30.99,54.01-54.72,73.05-40.38,32.43-91.47,50.87-141.54,64.09-57.91,15.29-119.31,10.91-178.93,16.34H2.64c-22.52,0-40.64-18.13-40.64-40.64V803.71c0-22.52,18.13-40.64,40.64-40.64h-.01Z"/><path id="rect9640-2" data-name="rect9640" class="cls-14" d="M2.88,762.62H1021.61c22.52,0,40.64,18.13,40.64,40.64v1644.9c-15.22,36.43-30.99,54.01-54.72,73.05-40.38,32.43-91.47,50.87-141.54,64.09-57.91,15.29-119.31,10.91-178.93,16.34H2.89c-22.52,0-40.64-18.13-40.64-40.64V803.27c0-22.52,18.13-40.64,40.64-40.64h-.01Z"/><path id="rect10154" class="cls-18" d="M89.32,909.17c-22.35,0-40.35,17.94-40.35,40.29v644.15c0,22.35,18.01,40.35,40.35,40.35H866.09c74.03,0,133.62-59.59,133.62-133.62v-43.28c.61-2.46,.99-5.05,.99-7.71v-508.36c0-17.64-14.2-31.83-31.83-31.83H89.32Z"/><rect id="rect10161" class="cls-17" x="225.93" y="995.43" width="598.95" height="550.7" rx="18.24" ry="18.24"/></g></g></svg>';
    
    const generateFavicon = (theme) => {
        return "data:image/svg+xml;utf8," + favicon
            .replace(/color\s\S*\s/g, `color ${theme} `)
            .replace('<svg',(~favicon.indexOf('xmlns')?'<svg':'<svg xmlns="http://www.w3.org/2000/svg"'))
            .replace(/"/g, '\'')
            .replace(/%/g, '%25')
            .replace(/#/g, '%23')       
            .replace(/{/g, '%7B')
            .replace(/}/g, '%7D')         
            .replace(/</g, '%3C')
            .replace(/>/g, '%3E')
            .replace(/\s+/g,' ');
    }

    const setFavicon = useCallback((theme) => {
        if (typeof window === 'undefined') return;
        const link = window.document.querySelector("link[rel*='icon']") || window.document.createElement("link");
        const meta = window.document.querySelector("meta[name='theme-color']");
        
        link.type = "image/svg+xml";
        link.rel = "icon";
        link.href = generateFavicon(theme);

        meta.content = colors[theme];    
        window.document.getElementsByTagName("head")[0].appendChild(link);
    }, [])

    useEffect(() => setFavicon(theme), [setFavicon, theme])

    return { setFavicon }
}

export { useDynamicFavicon }