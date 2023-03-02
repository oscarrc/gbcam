const camIcon = ({ className, selfie }) => {
    return (
        <svg id="camicon" className={`${className} ${!selfie && 'rotated'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
            <defs>
                <linearGradient id="Grad" data-name="Grad" x1="317" y1="415.57" x2="317" y2="340.03" gradientTransform="translate(0 1024) scale(1 -1)" gradientUnits="userSpaceOnUse">
                    <stop offset=".55" stopColor="#1a1a1a"/>
                    <stop offset=".76" stopColor="#101010"/>
                    <stop offset=".99" stopColor="#000"/>
                </linearGradient>
                <linearGradient id="Grad_2" data-name="Grad 2" x1="706.45" y1="415.77" x2="706.45" y2="340.03" gradientTransform="translate(0 1024) scale(1 -1)" gradientUnits="userSpaceOnUse">
                    <stop offset=".55" stopColor="#1a1a1a"/>
                    <stop offset=".76" stopColor="#101010"/>
                    <stop offset=".99" stopColor="#000"/>
                </linearGradient>
                <radialGradient id="Grad_3" data-name="Grad 3" cx="470.77" cy="628.88" fx="458.76" fy="628.88" r="287.5" gradientTransform="translate(0 1024) scale(1 -1)" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#333"/>
                    <stop offset=".54" stopColor="#1a1a1a"/>
                    <stop offset=".97" stopColor="#000"/>
                </radialGradient>
                <radialGradient id="Grad_4" data-name="Grad 4" cx="467.77" cy="629.88" fx="455.76" fy="629.88" r="287.5" gradientTransform="translate(0 1024) scale(1 -1)" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#fff"/>
                    <stop offset="1" stopColor="#000"/>
                </radialGradient>
                <radialGradient id="Grad_5" data-name="Grad 5" cx="484.39" cy="615.64" fx="484.39" fy="615.64" r="213.51" gradientTransform="translate(0 1024) scale(1 -1)" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#fff"/>
                    <stop offset="1" stopColor="#000"/>
                </radialGradient>
                <radialGradient id="Grad_6" data-name="Grad 6" cx="511" cy="583.36" fx="511" fy="583.36" r="83.5" gradientTransform="translate(0 1024) scale(1 -1)" gradientUnits="userSpaceOnUse">
                    <stop offset=".91" stopColor="gray"/>
                    <stop offset="1" stopColor="#fff"/>
                </radialGradient>
                <linearGradient id="Grad_8" data-name="Grad 8" x1="34" y1="260.74" x2="210" y2="260.74" gradientTransform="translate(0 1024) scale(1 -1)" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#4d4d4d"/>
                    <stop offset=".15" stopColor="#434343"/>
                    <stop offset=".4" stopColor="#2a2a2a"/>
                    <stop offset=".53" stopColor="#1a1a1a"/>
                </linearGradient>
                <linearGradient id="Grad_9" data-name="Grad 9" x1="813.93" y1="260.69" x2="990" y2="260.69" gradientTransform="translate(0 1024) scale(1 -1)" gradientUnits="userSpaceOnUse">
                    <stop offset=".47" stopColor="#1a1a1a"/>
                    <stop offset=".74" stopColor="#313131"/>
                    <stop offset="1" stopColor="#4d4d4d"/>
                </linearGradient>
            </defs>
            <g className="back">
                <path className="left" d="M122,670.95v-14.57c0-13.76,9.36-25.76,22.71-29.1l71.7-17.95c2.38-.6,4.83-.9,7.29-.9h288.3v75.54H122"/>
                <path className="right" d="M901.47,670.68v-14.57c-.02-13.76-9.39-25.75-22.74-29.09l-71.71-17.9c-2.38-.59-4.83-.89-7.29-.89l-288.3,.2,.05,75.54,390-.28"/>
            </g>
            <g className={`cam swap ${selfie && 'swap-active'}`}>
                <g className="swap-on">
                    <g className="outter">  
                        <circle className="case" cx="510.5" cy="434.47" r="287.5"/>                      
                        <circle className="grad" cx="513.5" cy="435.47" r="287.5"/>
                    </g>
                    <g className="inner">
                        <ellipse className="case" cx="511.5" cy="435.47" rx="211.5" ry="215.5"/>
                        <ellipse className="grad" cx="510.5" cy="434.47" rx="211.5" ry="215.5"/>
                        <polygon className="triangle" points="399.5,462.1 354.5,442 399.5,422.1 "/>
                    </g>
                    <g className="lens">
                        <circle className="frame" cx="511" cy="440.64" r="83.5"/>
                        <circle className="case" cx="511" cy="440.64" r="72"/>
                        <circle className="hole" cx="511" cy="440.64" r="27.5"/>
                        <circle className="flare" cx="520.5" cy="434.47" r="6.5"/>
                    </g>
                </g>
                <g className="swap-off">
                    <g className="outter">
                        <circle className="case" cx="510.5" cy="434.47" r="287.5"/>
                        <circle className="grad" cx="513.5" cy="435.47" r="287.5"/>
                    </g>
                </g>
            </g>
            <g className="front">
                <g className="label">
                    <rect className="background" x="220.82" y="698.72" width="581" height="168"/>
                    <g className="text">
                        <path d="M331.09,825.78c0-5.58,4.67-9.83,14-12.75-2.33-1.08-4.21-2.58-5.62-4.5-1.42-1.92-2.12-3.92-2.12-6,0-3.25,1.38-5.79,4.12-7.62,1.67-1.08,4.08-2.04,7.25-2.88-6.67-3.92-10-9.38-10-16.38,0-5.58,2.29-10.54,6.88-14.88,4.58-4.33,10.71-6.5,18.38-6.5h31.75l-1.62,12.5h-9.12c1.5,3.25,2.25,6.25,2.25,9,0,5.58-2.08,10.46-6.25,14.62s-10.04,6.25-17.62,6.25c-4.08,0-6.81,.19-8.19,.56s-2.06,1.15-2.06,2.31,1.17,2.04,3.5,2.62,5.19,1.15,8.56,1.69c3.38,.54,6.75,1.29,10.12,2.25,3.38,.96,6.23,2.73,8.56,5.31s3.5,5.88,3.5,9.88c0,12.25-9.75,18.38-29.25,18.38-9.83,0-16.79-1.36-20.88-4.06-4.08-2.71-6.12-5.98-6.12-9.81h-.02Zm25.12-9.37c-6.92,.92-10.38,3.12-10.38,6.62,0,3.92,4.17,5.88,12.5,5.88,4.75,0,8.14-.42,10.19-1.25,2.04-.83,3.06-2.21,3.06-4.12,0-1.75-.9-3.02-2.69-3.81s-4.98-1.69-9.56-2.69c-1.33-.25-2.38-.46-3.12-.62h0Zm15.25-42.63c0-2.5-.71-4.48-2.12-5.94-1.42-1.46-3.33-2.19-5.75-2.19-6.08,0-9.12,4.17-9.12,12.5,0,2.5,.69,4.42,2.06,5.75,1.38,1.33,3.27,2,5.69,2,6.17,0,9.25-4.04,9.25-12.12h-.01Z"/>
                        <path d="M426.47,725.78l-4.88,34.25c5.25-4.5,10.38-6.75,15.38-6.75,6.08,0,11.12,2.42,15.12,7.25s6,10.92,6,18.25c0,4.17-.71,8.17-2.12,12-1.42,3.83-3.54,7.38-6.38,10.62-2.83,3.25-6.67,5.86-11.5,7.81-4.83,1.96-10.33,2.94-16.5,2.94-9.17,0-17.12-.62-23.88-1.88l11.88-84.5h16.88Zm-6.75,48.01l-3.5,24.25c2,.25,3.92,.38,5.75,.38,6.33,0,11.02-1.64,14.06-4.94,3.04-3.29,4.56-7.94,4.56-13.94,0-3.83-.9-6.88-2.69-9.12-1.79-2.25-4.15-3.38-7.06-3.38-3.67,0-7.38,2.25-11.12,6.75Z"/>
                        <path d="M513.47,794.66l-2,15.38c-5.5,1.42-11.33,2.12-17.5,2.12-8.5,0-15.44-2.54-20.81-7.62-5.38-5.08-8.06-11.67-8.06-19.75,0-8.92,3.5-16.39,10.5-22.44,7-6.04,15.62-9.06,25.88-9.06,6.25,0,11.46,.67,15.63,2l-2.12,15.25c-3.58-1.33-5.92-2.08-7-2.25-.75-.17-2.5-.25-5.25-.25-5.67,0-10.44,1.67-14.31,5-3.88,3.33-5.81,7.46-5.81,12.38,0,4.17,1.29,7.38,3.88,9.62,2.58,2.25,6.21,3.38,10.88,3.38,4.42,0,9.79-1.25,16.13-3.75h-.04Z"/>
                        <path d="M557.59,811.03l.75-5.25c-5.25,4.17-10.71,6.25-16.38,6.25s-10.5-2.27-14.25-6.81-5.62-10.35-5.62-17.44c0-4.33,.73-8.46,2.19-12.38s3.73-7.56,6.81-10.94,7.38-6.06,12.88-8.06,11.92-3,19.25-3c6.83,0,13.21,.58,19.12,1.75l-7.88,55.88h-16.87Zm2.38-16.5l3.75-27c-.08,0-.61-.06-1.56-.19-.96-.12-1.65-.19-2.06-.19-3.33,0-6.29,.54-8.88,1.62-2.58,1.08-4.58,2.42-6,4s-2.58,3.42-3.5,5.5-1.5,3.94-1.75,5.56-.38,3.23-.38,4.81c0,3.42,.73,6.08,2.19,8s3.48,2.88,6.06,2.88c4.08,0,8.12-1.67,12.12-5h.01Z"/>
                        <path d="M614.84,754.28l-1,7.25,.25,.25c5.92-5.67,11.83-8.5,17.75-8.5,3.75,0,6.89,.92,9.44,2.75,2.54,1.83,4.19,4.38,4.94,7.62,4-3.75,7.56-6.42,10.69-8,3.12-1.58,6.44-2.38,9.94-2.38,6,0,10.46,2.11,13.38,6.31,2.92,4.21,3.92,9.61,3,16.19l-4.88,35.25h-16.88l4.62-32.62c1.17-8.42-.33-12.62-4.5-12.62s-8.67,2.96-13.75,8.88l-5.12,36.38h-16.88l4.38-32.5c.58-4.42,.5-7.64-.25-9.69-.75-2.04-2.29-3.06-4.62-3.06-3.58,0-8.04,2.96-13.38,8.88l-5.12,36.38h-16.88l8-56.75h16.88v-.02Z"/>
                    </g>
                </g>
                <path className="left" d="M39.97,705.1l-5.97,171.87H210v-217.42c0-6.72-6.5-11.53-12.93-9.56l-150.03,45.89c-4.08,1.25-6.92,4.95-7.07,9.22Z"/>
                <path className="right" d="M984.24,705.11c1.92,57.29,3.84,114.57,5.76,171.86l-176,.06-.07-217.42c0-6.72,6.49-11.53,12.92-9.57,50.1,15.28,100.21,30.57,150.31,45.85,4.09,1.25,6.93,4.96,7.08,9.23h0Z"/>
                <rect className="center" x="209" y="685.97" width="602" height="191"/> 
            </g>
        </svg>
    )
}

export default camIcon;