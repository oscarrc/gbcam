const Mode = () => {
    return (
        <div className="grid grid-cols-2 gap-4 font-bold text-neutral-content text-xs">
            <span className="-rotate-20">
                <button name="Save" aria-label="Save" className="btn btn-secondary p-0 min-h-0 h-4 w-12 rounded-lg"></button>
                <lavel htmlFor="Save" className="text-button text-center block">SAVE</lavel>
            </span>
            <span className="-rotate-20">
                <button name="Share" aria-label="Share" className="btn btn-secondary p-0 min-h-0 h-4 w-12 rounded-lg"></button>
                <lavel htmlFor="Share" className="text-button text-center block">SHARE</lavel>
            </span>
        </div>
    )
}

export default Mode;