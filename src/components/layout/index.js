import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
    return (
        <div className="flex bg-neutral w-full min-h-dscreen">
            <Header />
            <main className="flex-1">
                { children }
            </main>
            <Footer />
        </div>
    )
}

export default Layout;