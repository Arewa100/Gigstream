import Header from "./header"
import NavBar from "./navBar"

const LandingPage = () => {
    return(
        <>
            <NavBar/>
            <div className="min-h-screen w-full max-w-[1440px] mx-auto">
                <Header/>
            </div>
        </>
    )
}

export default LandingPage