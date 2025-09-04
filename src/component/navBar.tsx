// src/components/NavBar.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCurrentAccount, useDisconnectWallet, ConnectButton } from '@mysten/dapp-kit';
import { useNavigate } from 'react-router-dom';

interface NavBarProps {
    showNavbar: boolean;
}

const NavBar = ({ showNavbar }: NavBarProps) => {
    const [isNavHovered, setIsNavHovered] = useState(false);
    const [isConnectHovered, setIsConnectHovered] = useState(false); // Add this state
    const currentAccount = useCurrentAccount();
    const { mutate: disconnect } = useDisconnectWallet();
    const navigate = useNavigate();

    const handleNavigation = (item: string) => {
        if (item === 'Connect') {
            if (currentAccount) {
                // User is connected, so disconnect
                disconnect();
                navigate('/');
            }
            // If not connected, ConnectButton overlay handles the connection
            return;
        }

        if (!currentAccount) {
            alert('Please connect your wallet first to access this feature');
            return;
        }

        switch (item) {
            case 'Hire':
                navigate('/job-listing');
                break;
            case 'Find Gig':
                navigate('/dashboard');
                break;
            case 'Why Gigstream':
                navigate('/');
                break;
            default:
                break;
        }
    };

    return(
        <AnimatePresence>
            {showNavbar && (
                <motion.div 
                    className="fixed top-[68px] left-0 right-0 z-50 mx-auto"
                    onMouseEnter={() => setIsNavHovered(true)}
                    onMouseLeave={() => setIsNavHovered(false)}
                    initial={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="w-full max-w-[1440px] h-[102px] mx-auto flex items-center justify-between bg-[#645CF6]/60 relative px-4 md:px-0">
             
                        <div className="absolute inset-0 w-full md:w-[1150.6px] h-full pointer-events-auto flex flex-col md:flex-row justify-between items-center mx-auto px-4 md:px-0 z-20">
                            
                            {/* Logo - responsive */}
                            <motion.h1 
                                className="font-[poppins] text-white font-semibold text-[18px] md:text-[21.6px] w-full md:w-[300px] text-center md:text-left mb-2 md:mb-0 cursor-pointer"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                onClick={() => navigate('/')}
                            >
                                <span className="text-[#00D4AA]">Gig</span>stream
                            </motion.h1>

                            {/* Navigation buttons */}
                            <div className="w-full md:w-[621px] h-auto md:h-full flex flex-wrap md:flex-nowrap items-center justify-center md:justify-between gap-2 md:gap-0">
                                {["Hire", "Find Gig", "Why Gigstream", "Connect"].map((item, index) => (
                                    <div 
                                        key={item} 
                                        className="w-auto md:w-[150px] h-auto md:h-full relative"
                                        onMouseEnter={() => item === 'Connect' && setIsConnectHovered(true)}
                                        onMouseLeave={() => item === 'Connect' && setIsConnectHovered(false)}
                                    >
                                        {/* Invisible ConnectButton overlay (only for Connect when not connected) */}
                                        {item === 'Connect' && !currentAccount && (
                                            <ConnectButton 
                                                style={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backgroundColor: 'transparent',
                                                    color: 'transparent',
                                                    border: 'none',
                                                    fontSize: '0px',
                                                    zIndex: 30,
                                                    boxShadow: 'none',
                                                    outline: 'none',
                                                }}
                                            />
                                        )}
                                        
                                        {/* Your styled button */}
                                        <motion.button 
                                            onClick={() => handleNavigation(item)}
                                            className="w-auto md:w-[150px] h-auto md:h-full px-3 md:px-0 py-2 md:py-0 text-white font-semibold font-[poppins] text-[14px] md:text-[16px] relative group cursor-pointer"
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: index * 0.1 }}
                                        >
                                            <motion.span className="relative z-10">
                                                {item === 'Connect' && currentAccount ? 'Disconnect' : item}
                                            </motion.span>
                                            
                                            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-transparent">
                                                <span className={`absolute bottom-0 left-0 h-full transform origin-left transition-transform duration-500 ease-out w-full ${
                                                    // Show hover effect when either group-hover is active OR when Connect is manually hovered
                                                    (item === 'Connect' && !currentAccount) 
                                                        ? `${isConnectHovered ? 'scale-x-100' : 'scale-x-0'} bg-white`
                                                        : item === 'Connect' && currentAccount
                                                        ? 'group-hover:scale-x-100 scale-x-0 bg-red-400'
                                                        : 'group-hover:scale-x-100 scale-x-0 bg-white'
                                                }`}></span>
                                            </span>
                                        </motion.button>
                                    </div>
                                ))}
                            </div>

                            {/* Click-only hamburger menu */}
                            <motion.div 
                                className="mt-2 md:mt-0"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <KonikuStyleMenuWithNavbar isNavHovered={isNavHovered} />
                            </motion.div>
                        </div>
                        
                        {/* Background logo */}
                        <div className="h-full w-[533.2px] relative z-0">
                            <img 
                                src="src\assets\gigLogo.svg" 
                                alt="Header image"
                                className="w-full h-full max-w-[250px] md:max-w-full max-h-[200px] md:max-h-full object-contain opacity-20"
                            />  
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}


// Updated component - click to expand, hover navbar to close
const KonikuStyleMenuWithNavbar = ({ isNavHovered }: { isNavHovered: boolean }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const currentAccount = useCurrentAccount();
    const navigate = useNavigate();

    // Close menu when hovering out of navbar, but only expand on click
    const shouldShow = isExpanded && isNavHovered;

    // Close menu when navbar is not hovered
    if (!isNavHovered && isExpanded) {
        setTimeout(() => setIsExpanded(false), 100);
    }

    const handleMenuNavigation = (item: string) => {
        if (!currentAccount) {
            alert('Please connect your wallet first to access this feature');
            return;
        }

        switch (item) {
            case 'About':
                navigate('/');
                break;
            case 'Blog':
                navigate('/');
                break;
            case 'Careers':
                navigate('/');
                break;
            case 'Support':
                navigate('/');
                break;
            default:
                break;
        }
    };

    return (
        <div className="flex items-center">
            <AnimatePresence>
                {shouldShow && (
                    <motion.div 
                        className="flex items-center mr-4 md:mr-6  h-[102px]"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {["About", "Blog", "Careers", "Support"].map((item, index) => (
                            <motion.button
                                key={item}
                                onClick={() => handleMenuNavigation(item)}
                                className="w-auto px-2 md:px-3 py-2 text-white font-semibold font-[poppins] text-[14px] md:text-[16px] relative group whitespace-nowrap  md:w-[120px] h-auto md:h-full cursor-pointer"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <motion.span className="relative z-10">
                                    {item}
                                </motion.span>
                                
                                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-transparent">
                                    <span className="absolute bottom-0 left-0 h-full bg-white transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 w-full"></span>
                                </span>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Click-only hamburger button */}
            <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-8 h-8 flex flex-col justify-center items-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
            >
                <div className="grid grid-cols-3 gap-1">
                    {[...Array(9)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-1.5 h-1.5 bg-white rounded-full"
                            animate={{
                                scale: shouldShow ? [1, 0.3, 0] : [0, 0.3, 1],
                                opacity: shouldShow ? [1, 0.5, 0] : [0, 0.5, 1]
                            }}
                            transition={{ 
                                duration: 0.6, 
                                delay: i * 0.03,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </motion.button>
        </div>
    );
};

export default NavBar