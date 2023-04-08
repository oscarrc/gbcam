const PaletteIcon = ({ className, palette }) => {
    return (
        <div className={className}>
            { palette.map( (c,i) => (
                <span key={i} className="inline-block h-full w-1/4" style={{ background: `rgba(${c[0]},${c[1]},${c[2]}, 1)` }}></span>
            ))}
        </div>
    )
}

export default PaletteIcon;