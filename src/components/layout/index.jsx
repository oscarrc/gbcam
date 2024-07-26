import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
    return (
        <div className="relative bg-gradient-gb flex flex-col bg-gb w-full h-full min-h-dscreen rounded-2xl rounded-br-[6rem] z-10">
            <Header />
            <main className="flex flex-col flex-1 z-10 overflow-x-hidden">
                { children }
            </main>
            <div className="flex gap-2 -rotate-35 absolute bottom-8 right-4 sm:right-8 z-0">
                {[0,1,2,3,4,5].map( v => <span key={v} className="h-16 sm:h-24 w-3 bg-primary opacity-20 rounded-lg"></span>)}
            </div>
            <Footer />
        </div>
    )
}

export default Layout;