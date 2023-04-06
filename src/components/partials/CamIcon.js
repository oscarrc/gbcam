const camIcon = ({ className, selfie }) => {
    return (
        <svg id="camicon" className={`${className} ${!selfie && 'rotated'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 820">
            <defs>
                <radialGradient id="Grad1" cx="348.45" cy="354.63" fx="331.8132292863962" r="397.92" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#fff"/>
                    <stop offset="1" stopOpacity="0.3"/>
                </radialGradient>
                <radialGradient id="Grad2" cx="351.91" cy="356.7" fx="335.27343689885095" r="397.92" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#343434"/>
                    <stop offset="0.54" stopColor="#1a1a1a"/>
                    <stop offset="0.97" stopColor="#010101"/>
                </radialGradient>
                <radialGradient id="Grad3" cx="347.76" cy="355.32" fx="331.121187763904" r="397.92" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#fff"/>
                    <stop offset="1"/>
                </radialGradient>
                <radialGradient id="Grad4" cx="370.75" cy="375.03" fx="370.7531521706569" r="295.51">
                    <stop offset="0" stopColor="#fff"/>
                    <stop offset="1"/>
                </radialGradient>
                <radialGradient id="Grad5" cx="407.58" cy="419.71" r="115.57" gradientUnits="userSpaceOnUse">
                    <stop offset="0.91" stopColor="gray"/>
                    <stop offset="1" stopColor="#fff"/>
                </radialGradient>
            </defs>
            <g id="cam" className={`cam swap ${selfie && 'swap-active'}`}>
                <g id="front" className="swap-on">
                    <circle class="outer" cx="411.04" cy="412.55" r="397.92"/>
                    <circle class="outer-shadow" cx="406.89" cy="411.17" r="397.92"/>
                    <ellipse class="inner" cx="408.28" cy="412.55" rx="292.73" ry="298.27"/>
                    <ellipse class="inner-shadow" cx="406.89" cy="411.17" rx="292.73" ry="298.27"/>
                    <polygon class="arrow" points="250.49 446.99 188.21 419.17 250.49 391.63 250.49 446.99"/>
                    <g id="lens">
                        <circle class="frame" cx="407.58" cy="419.71" r="115.57"/>
                        <circle class="outer" cx="407.58" cy="419.71" r="99.65"/>
                        <circle class="inner " cx="407.58" cy="419.71" r="38.06"/>
                        <circle class="flare" cx="420.73" cy="411.17" r="9"/>
                    </g>
                </g>
                <g id="back" className="swap-off">
                    <circle class="case" cx="411.74" cy="411.86" r="397.92"/>
                    <circle class="shadow" cx="407.58" cy="410.48" r="397.92"/>
                </g>
            </g>
        </svg>
    )
}

export default camIcon;