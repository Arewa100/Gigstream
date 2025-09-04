import { motion } from "framer-motion";

const Footer = () => {
    return (
        <footer className="bg-[#5B3AED] text-white relative overflow-hidden">
            {/* Background Logo */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden pointer-events-none">
                <div className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] opacity-20">
                    <img 
                        src="src/assets/gigLogo.svg" 
                        alt="Gigstream logo background"
                        className="w-full h-full object-contain"
                    />  
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    
                    {/* Company Info - Logo and Address */}
                    <div className="lg:col-span-1 text-center sm:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col space-y-4"
                        >
                            {/* Logo */}
                            <div className="flex items-center justify-center sm:justify-start space-x-2 mb-4">
                                <span className="text-xl sm:text-2xl font-bold font-[poppins]">
                                    <span className="text-[#00D4AA]">Gig</span>stream
                                </span>
                            </div>
                            
                            {/* Address */}
                            <div className="text-white space-y-1 font-[poppins]">
                                <p className="text-xs sm:text-sm italic">Decentralized HQ</p>
                                <p className="text-xs sm:text-sm">Sui Blockchain</p>
                                <p className="text-xs sm:text-sm italic">Web3, Global</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Platform Links */}
                    <div className="lg:col-span-1 text-center sm:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <h3 className="text-white font-semibold text-xs sm:text-sm mb-4 sm:mb-6 font-[poppins] tracking-wider uppercase">
                                PLATFORM
                            </h3>
                            <ul className="space-y-2 sm:space-y-4">
                                {['Browse Gigs', 'Post Work', 'How it Works', 'Pricing', 'Smart Contracts'].map((item, index) => (
                                    <li key={item}>
                                        <motion.a
                                            href="#"
                                            className="text-white hover:text-[#00D4AA] transition-colors duration-200 text-xs sm:text-sm font-[poppins] block"
                                            whileHover={{ x: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {item}
                                        </motion.a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Services */}
                    <div className="lg:col-span-1 text-center sm:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h3 className="text-white font-semibold text-xs sm:text-sm mb-4 sm:mb-6 font-[poppins] tracking-wider uppercase">
                                SERVICES
                            </h3>
                            <ul className="space-y-2 sm:space-y-4">
                                {['Web3 Development', 'Smart Contracts', 'DeFi Solutions', 'NFT Projects', 'Blockchain Consulting'].map((item, index) => (
                                    <li key={item}>
                                        <motion.a
                                            href="#"
                                            className="text-white hover:text-[#00D4AA] transition-colors duration-200 text-xs sm:text-sm font-[poppins] block"
                                            whileHover={{ x: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {item}
                                        </motion.a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Company */}
                    <div className="lg:col-span-1 text-center sm:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <h3 className="text-white font-semibold text-xs sm:text-sm mb-4 sm:mb-6 font-[poppins] tracking-wider uppercase">
                                COMPANY
                            </h3>
                            <ul className="space-y-2 sm:space-y-4">
                                {['About Us', 'Careers', 'Blog', 'Community', 'Contact Us'].map((item, index) => (
                                    <li key={item}>
                                        <motion.a
                                            href="#"
                                            className="text-white hover:text-[#00D4AA] transition-colors duration-200 text-xs sm:text-sm font-[poppins] block"
                                            whileHover={{ x: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {item}
                                        </motion.a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Newsletter Signup */}
                    <div className="lg:col-span-1 text-center sm:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <h3 className="text-white font-semibold text-xs sm:text-sm mb-4 sm:mb-6 font-[poppins] tracking-wider uppercase">
                                STAY UPDATED
                            </h3>
                            
                            <div className="space-y-4">
                                <p className="text-white text-xs sm:text-sm font-[poppins] leading-relaxed">
                                    Get the latest Web3 opportunities and platform updates.
                                </p>
                                
                                <div className="w-full max-w-xs">
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                        <input
                                            type="email"
                                            placeholder="your.email@domain.com"
                                            className="flex-1 bg-transparent border-b border-white/30 px-1 py-2 text-white placeholder-white/60 focus:outline-none focus:border-[#00D4AA] transition-colors font-[poppins] text-xs sm:text-sm min-w-0"
                                        />
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.6, delay: 0.3 }}
                                            whileHover={{ 
                                                scale: 1.05,
                                                backgroundColor: "#00D4AA",
                                                color: "#ffffff",
                                                boxShadow: "0 10px 15px -3px rgba(0, 212, 170, 0.3), 0 4px 6px -2px rgba(0, 212, 170, 0.1)"
                                            }}
                                            whileTap={{ 
                                                scale: 0.95,
                                                transition: { duration: 0.1 }
                                            }}
                                            className="bg-white text-[#5B3AED] px-4 py-2 rounded-md font-[poppins] text-xs sm:text-sm font-medium flex-shrink-0 transition-colors shadow-lg"
                                        >
                                            Subscribe
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-white/10 relative z-10">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        
                        {/* Copyright */}
                        <div className="flex items-center space-x-2 sm:space-x-4 text-white text-xs sm:text-sm font-[poppins] order-2 md:order-1">
                            <span>© GIGSTREAM</span>
                            <span>2025.</span>
                        </div>

                        {/* Built by */}
                        <div className="text-white text-xs sm:text-sm font-[poppins] order-3 md:order-2 text-center">
                            <span className="mr-1 sm:mr-2">Designed and built by</span>
                            <span className="text-[#00D4AA] font-medium">GIGSTREAM TEAM</span>
                        </div>

                        {/* Social Media */}
                        <div className="flex items-center space-x-3 sm:space-x-4 order-1 md:order-3">
                            {[
                                { name: 'Twitter', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                                { name: 'LinkedIn', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 11-4 4 2 2 0 014-4z' },
                                { name: 'Discord', icon: 'M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019z' }
                            ].map((social, index) => (
                                <motion.a
                                    key={social.name}
                                    href="#"
                                    className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#00D4AA]/20 transition-colors duration-200"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white hover:text-[#00D4AA] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path d={social.icon} />
                                    </svg>
                                </motion.a>
                            ))}
                            
                            {/* Sui Logo */}
                            <motion.div
                                className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#645CF6] to-[#00D4AA] rounded-lg flex items-center justify-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="w-4 h-4 sm:w-6 sm:h-6 bg-white rounded-sm"></div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;