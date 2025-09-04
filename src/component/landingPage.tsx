import { useState, useEffect } from "react";
import BrowseOpportunitySection from "./browseOpportunity"
import Header from "./header"
import NavBar from "./navBar"
import FindFreelancer from "./findfreelancer";
import Footer from "./footer";

const LandingPage = () => {
    const [showNavbar, setShowNavbar] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const browseSection = document.querySelector('[data-section="browse-opportunity"]');
            
            if (browseSection) {
                const rect = browseSection.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                
                // Hide navbar when browse section is 50% visible
                if (rect.top <= viewportHeight * 0.10) {
                    setShowNavbar(false);
                } else {
                    setShowNavbar(true);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return(
        <>
            <NavBar showNavbar={showNavbar} />
            <div className="min-h-screen w-full max-w-[1440px] mx-auto">
                <Header/>
                <div data-section="browse-opportunity">
                    <BrowseOpportunitySection/>
                </div>
                <FindFreelancer/>
                <Footer/>
            </div>
        </>
    )
}

export default LandingPage