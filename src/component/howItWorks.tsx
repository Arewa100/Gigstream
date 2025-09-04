import {useState, useEffect} from 'react'
// HowItWorks.jsx with sliding recent earners
const HowItWorks = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const earners = [
        {
            id: 1,
            avatar: "https://i.pravatar.cc/100?img=1",
            project: "Milestone approved: DeFi Dashboard Integration - 4 days ago",
            wallet: "0xAdjs..sjsjw",
            rating: 5
        },
        {
            id: 2,
            avatar: "https://i.pravatar.cc/100?img=2", 
            project: "Smart Contract Audit completed - 200 SUI - 2 days ago",
            wallet: "0xBc7f..k9m2",
            rating: 5
        },
        {
            id: 3,
            avatar: "https://i.pravatar.cc/100?img=3",
            project: "NFT Marketplace Frontend - 500 SUL - 1 day ago", 
            wallet: "0xFe8a..x7p1",
            rating: 4
        }
    ];

    useEffect(() => {
        if (!isHovered) {
            const interval = setInterval(() => {
                setCurrentSlide(prev => (prev + 1) % earners.length);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [isHovered, earners.length]);

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <svg key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < rating ? 'fill-[#5B3AED]' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    return (
        <div className="w-full max-w-[582px] mx-auto bg-white rounded-2xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="bg-white w-full px-4 sm:px-6 py-4 sm:py-6">
                <h2 className="font-[poppins] font-semibold text-sm sm:text-base text-[#64748B]">
                    HOW IT WORKS
                </h2>
            </div>

            {/* Content Container */}
            <div className="px-4 sm:px-6 py-4 space-y-6 sm:space-y-8">
                {/* Step 1 - Connect your Wallet */}
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-15 sm:h-15 flex-shrink-0 rounded-lg bg-[#645CF6]/20 flex items-center justify-center">
                        <img 
                            src="src/assets/icons/wallet.svg" 
                            alt="Connect wallet"
                            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-[poppins] font-semibold text-sm sm:text-base text-[#645CF6] mb-1 sm:mb-2">
                            Connect your Wallet
                        </h3>
                        <p className="font-[poppins] font-medium text-xs sm:text-sm text-[#64748B] leading-relaxed">
                            Link your Sui wallet and create your decentralized profile in seconds
                        </p>
                    </div>
                </div>

                {/* Step 2 - Apply for Gigs */}
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-15 sm:h-15 flex-shrink-0 rounded-lg bg-[#645CF6]/20  flex items-center justify-center">
                        <img 
                            src="src/assets/icons/apply.svg" 
                            alt="Apply for gigs"
                            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-[poppins] font-semibold text-sm sm:text-base text-[#645CF6] mb-1 sm:mb-2">
                            Apply for Gigs
                        </h3>
                        <p className="font-[poppins] font-medium text-xs sm:text-sm text-[#64748B] leading-relaxed">
                            Browse premium Web3 opportunities and submit proposals
                        </p>
                    </div>
                </div>

                {/* Step 3 - Get paid instantly */}
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-15 sm:h-15 flex-shrink-0 rounded-lg bg-[#645CF6]/20 flex items-center justify-center">
                        <img 
                            src="src/assets/icons/paid.svg" 
                            alt="Get paid instantly"
                            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                        />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h3 className="font-[poppins] font-semibold text-sm sm:text-base text-[#645CF6] mb-1 sm:mb-2">
                            Get paid instantly
                        </h3>
                        <p className="font-[poppins] font-medium text-xs sm:text-sm text-[#64748B] leading-relaxed">
                            Complete work and receive automatic payments through secure smart contracts
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section with Sliding Animation */}
            <div className="px-4 sm:px-6 py-4 mt-6 sm:mt-8">
                <h3 className="font-[poppins] font-semibold text-sm sm:text-base text-[#64748B] mb-3 sm:mb-4">
                    RECENT EARNERS
                </h3>
                
                {/* Sliding Container */}
                <div 
                    className="relative overflow-hidden rounded-lg bg-gray-50"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div 
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {earners.map((earner) => (
                            <div key={earner.id} className="flex items-start gap-3 p-3 sm:p-4 min-w-full flex-shrink-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
                                    <img 
                                        src={earner.avatar} 
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-[poppins] font-medium text-xs sm:text-sm text-gray-900 mb-1 line-clamp-2">
                                        {earner.project}
                                    </p>
                                    <p className="font-[poppins] font-medium text-xs text-[#64748B] mb-2 truncate">
                                        {earner.wallet}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        {renderStars(earner.rating)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Slide indicators */}
                    <div className="flex justify-center gap-2 pb-3">
                        {earners.map((_, index) => (
                            <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                    currentSlide === index ? 'bg-[#645CF6]' : 'bg-gray-300'
                                }`}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HowItWorks;