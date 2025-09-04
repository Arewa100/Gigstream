const WorkDisplay = () => {
    return (
        <>
            <article className="w-full max-w-[582px] h-auto bg-white rounded-2xl shadow-[0_0_0_0_rgba(255,255,255,0)] overflow-hidden">
                {/* Header with Browse Opportunities and filters */}
                <div className="bg-white border-b border-gray-100 w-full px-6 py-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
                        <h2 className="font-[poppins] font-semibold text-[18px] md:text-[20px] text-gray-900">Browse Opportunities</h2>
                        
                        {/* Filter buttons - cleaner style */}
                        <div className="flex items-center space-x-1">
                            <button className="font-[poppins] font-medium text-[13px] text-[#64748B] px-4 py-2 rounded-lg hover:bg-gray-100 hover:text-[#00D4AA] transition-all duration-200">
                                All
                            </button>
                            <button className="font-[poppins] font-medium text-[13px] text-[#64748B] px-4 py-2 rounded-lg hover:bg-gray-100 hover:text-[#00D4AA] transition-all duration-200">
                                Recent
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cards container */}
                <div className="bg-gray-50">
                    {/* Individual opportunity cards */}
                    {[
                        { title: "Build DeFi Dashboard UI/UX", company: "0x1234...5678", due: "3 days", reviews: "12", amount: 2500 },
                        { title: "Smart Contract Security Audit", company: "0x9876...4321", due: "1 week", reviews: "8", amount: 5000 },
                        { title: "NFT Marketplace Frontend", company: "0xABCD...EFGH", due: "2 weeks", reviews: "25", amount: 3200 },
                        { title: "Token Economics Whitepaper", company: "0x5555...7777", due: "5 days", reviews: "6", amount: 1800 },
                        { title: "Web3 Mobile App Development", company: "0x9999...1111", due: "1 month", reviews: "15", amount: 8000 }
                    ].map((gig, index) => (
                        <div key={index} className="mb-0 last:mb-4">
                            <div className="bg-white hover:bg-[#00D4AA]/20 p-4 transition-all duration-200 cursor-pointer group">
                                <div className="flex items-start justify-between gap-4">
                                    {/* Left side - Original icon restored */}
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="h-12 w-12 bg-black rounded-lg flex-shrink-0">
                                            <img 
                                                src="src/assets/icons/first.svg" 
                                                alt="Opportunity icon"
                                                className="w-full h-full object-contain rounded-lg"
                                            /> 
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-[poppins] font-semibold text-[14px] text-gray-900 mb-1 line-clamp-1 group-hover:text-[#645CF6] transition-colors">
                                                {gig.title}
                                            </h3>
                                            <p className="font-[poppins] font-medium text-[12px] text-[#64748B] mb-2">
                                                {gig.company}
                                            </p>
                                            <div className="flex items-center gap-4 text-[11px] text-[#64748B]">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                    Due in {gig.due}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    {gig.reviews} reviews
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right side - Payment info */}
                                    <div className="flex items-center gap-1 text-right">
                                        <div className="w-4 h-4">
                                            <img 
                                                src="src/assets/suilogo.svg" 
                                                alt="SUI logo"
                                                className="w-full h-full object-contain"
                                            />    
                                        </div>
                                        <p className="font-[poppins] font-bold text-[16px] text-gray-900">
                                            {gig.amount.toLocaleString()}
                                        </p>
                                        <p className="font-[poppins] font-bold text-[16px] text-[#64748B]">
                                            SUI
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* View All Button - UPDATED */}
                    <div className="px-4 pt-2 bg-white">
                        <button className="w-full h-[40px] font-[poppins] font-medium text-[14px] text-white bg-[#5B3AED] rounded-lg hover:bg-[#5B3AED]/20 hover:text-[#5B3AED] transition-all duration-200 ">
                            View All
                        </button>
                    </div>
                </div>
            </article>
        </>
    )
}

export default WorkDisplay