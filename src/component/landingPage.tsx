import { useState, useEffect } from "react";
import BrowseOpportunitySection from "./browseOpportunity"
import Header from "./header"
import NavBar from "./navBar"

const LandingPage = () => {
    const [showNavbar, setShowNavbar] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // Get header height to determine when browse section starts
            const header = document.querySelector('header') || document.querySelector('[data-section="header"]');
            const headerHeight = header ? header.offsetHeight : windowHeight;
            
            // Hide navbar when user has scrolled past header + 200px into browse section
            const triggerPoint = headerHeight + 200;
            
            if (scrollY >= triggerPoint) {
                setShowNavbar(false);
            } else if (scrollY <= triggerPoint - 100) {
                setShowNavbar(true);
            }
            
            console.log('Scroll Y:', scrollY, 'Trigger Point:', triggerPoint); // Debug log
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return(
        <>
            <NavBar showNavbar={showNavbar} />
            <div className="min-h-screen w-full max-w-[1440px] mx-auto">
                <div data-section="header">
                    <Header/>
                </div>
                <div data-section="browse-opportunity">
                    <BrowseOpportunitySection/>
                </div>
            </div>
        </>
    )
}

export default LandingPage