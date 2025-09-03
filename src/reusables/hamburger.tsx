import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const HamburgerDotMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { label: "About", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Support", href: "#" },
        { label: "Documentation", href: "#" },
        { label: "Community", href: "#" }
    ];

    return (
        <div className="relative">
            {/* Hamburger Dot Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="w-8 h-8 flex flex-col justify-center items-center cursor-pointer group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="grid grid-cols-3 gap-1">
                    {[...Array(9)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-1.5 h-1.5 bg-white rounded-full"
                            animate={{
                                scale: isOpen ? 0.8 : 1,
                                opacity: isOpen ? 0.7 : 1
                            }}
                            transition={{ duration: 0.2, delay: i * 0.02 }}
                        />
                    ))}
                </div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-12 w-48 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 shadow-xl z-50"
                    >
                        <div className="py-2">
                            {menuItems.map((item, index) => (
                                <motion.a
                                    key={item.label}
                                    href={item.href}
                                    className="block px-4 py-2 text-white hover:bg-white/10 transition-colors font-[poppins] text-sm"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ x: 5 }}
                                >
                                    {item.label}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HamburgerDotMenu;