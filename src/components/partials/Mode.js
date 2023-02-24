const Mode = () => {
    return (
        <div className="grid grid-cols-2 gap-4 font-bold text-neutral-content text-xs">
            <span className="-rotate-20">
                <button aria-label="Photo" className="bg-secondary min-h-0 h-4 w-12 rounded-lg"></button>
                <span className="text-button text-center block">PHOTO</span>
            </span>
            <span className="-rotate-20">
                <button aria-label="Video" className="bg-secondary min-h-0 h-4 w-12 rounded-lg"></button>
                <span className="text-button text-center block">VIDEO</span>
            </span>
        </div>
    )
}

export default Mode;