const Layout = ({ children }) => {
    return (
        <div className="bg-neutral w-full min-h-dscreen">
            <main>
                { children }
            </main>
        </div>
    )
}

export default Layout;