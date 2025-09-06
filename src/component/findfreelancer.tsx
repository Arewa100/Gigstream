import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Palette, Camera, Briefcase } from 'lucide-react';

interface FindFreelancerProps {
    dotColor?: string;
    dotSize?: number;
    dotSpacing?: number;
    backgroundColor?: string;
    height?: string;
}

interface Box {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    position: React.CSSProperties;
    delay: number;
}

const FindFreelancer: React.FC<FindFreelancerProps> = ({
    dotColor = '#d1d5db',
    dotSize = 1,
    dotSpacing = 20,
    backgroundColor = 'bg-gray-800',
    height = 'h-[525.6px]'
}) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const backgroundStyle: React.CSSProperties = {
        backgroundImage: `
            radial-gradient(circle, #5B3AED ${dotSize}px, transparent ${dotSize}px),
            radial-gradient(circle, ${dotColor} ${dotSize}px, transparent ${dotSize}px),
            radial-gradient(circle, #00D4AA ${dotSize}px, transparent ${dotSize}px),
            radial-gradient(circle, ${dotColor} ${dotSize}px, transparent ${dotSize}px)
        `,
        backgroundSize: `${dotSpacing * 2}px ${dotSpacing * 2}px, ${dotSpacing * 2}px ${dotSpacing * 2}px, ${dotSpacing * 2}px ${dotSpacing * 2}px, ${dotSpacing * 2}px ${dotSpacing * 2}px`,
        backgroundPosition: `0 0, ${dotSpacing}px 0, 0 ${dotSpacing}px, ${dotSpacing}px ${dotSpacing}px`
    };

    const boxes: Box[] = [
        { 
            icon: Code, 
            title: 'Developers',
            description: 'Smart contracts & dApps',
            position: { top: '20%', left: '15%' },
            delay: 0
        },
        { 
            icon: Palette, 
            title: 'Designers',
            description: 'UI/UX & Web3 design',
            position: { top: '60%', left: '25%' },
            delay: 0.2
        },
        { 
            icon: Camera, 
            title: 'Creators',
            description: 'NFT & digital content',
            position: { top: '30%', right: '20%' },
            delay: 0.4
        },
        { 
            icon: Briefcase, 
            title: 'Consultants',
            description: 'Strategy & advisory',
            position: { bottom: '25%', right: '15%' },
            delay: 0.6
        }
    ];

    return (
        <div>
            <section 
                className={`w-full ${height} ${backgroundColor} relative overflow-hidden cursor-pointer`}
                style={backgroundStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Floating Boxes */}
                {boxes.map((box: Box, index: number) => {
                    const IconComponent = box.icon;
                    return (
                        <motion.div
                            key={index}
                            className="absolute bg-gray-100 rounded-lg p-4 shadow-xl z-20 w-48 h-32"
                            style={box.position}
                            initial={{ 
                                opacity: 0, 
                                scale: 0,
                                y: 20
                            }}
                            animate={{
                                opacity: isHovered ? 0.95 : 0,
                                scale: isHovered ? 1 : 0,
                                y: isHovered ? [0, -8, 0] : 20,
                            }}
                            transition={{
                                duration: 0.5,
                                delay: isHovered ? box.delay : 0,
                                y: {
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: box.delay
                                }
                            }}
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                                        <IconComponent className="text-white w-4 h-4" />
                                    </div>
                                    <h3 className="font-semibold text-gray-800 text-sm">{box.title}</h3>
                                </div>
                                <p className="text-gray-600 text-xs leading-relaxed">{box.description}</p>
                            </div>
                        </motion.div>
                    );
                })}

                <div className="relative z-10 p-8 flex flex-col items-center justify-center h-full text-center">
                    <motion.h1 
                        className="text-4xl font-bold text-gray-600 mb-4 font"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Find Freelancer
                    </motion.h1>
                    <motion.p 
                        className="text-gray-600 text-lg max-w-md font-[poppins]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Discover talented professionals on web3
                    </motion.p>
                </div>
            </section>
        </div>
    );
};

export default FindFreelancer;