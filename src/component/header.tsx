import { motion } from "framer-motion";

const Header = () => {     
    return(         
        <>             
            <section className="w-full h-[400px] md:h-[556px] bg-[#5B3AED] flex flex-col justify-between px-4 md:px-6 lg:px-8">                 
                <div></div>                  
                <article className="w-full max-w-[1176px] h-[250px] md:h-[374px] mx-auto rounded-lg md:rounded-none flex flex-col md:flex-row justify-between gap-4 md:gap-0 ">                     
                    <div className="w-full md:w-[517.5px] h-full  text-white text-lg md:text-2xl font-bold flex flex-col justify-between">                         
                        <div className=" p-3 md:p-4">                             
                            <h1 className="font-bold text-[18px] md:text-[32.4px] w-full md:w-[388.8px] h-auto md:h-[117px]  font-[poppins] text-white mb-3 md:mb-4 p-2 md:p-0">                                 
                                Stream Into Your Next Big Opportunity                             
                            </h1>                             
                            <p className="font-medium text-[12px] md:text-[18px] w-full md:w-[499.5px] h-auto md:h-[105.3px] text-white font-[poppins] mb-3 md:mb-4">                                 
                                Discover premium Web3 gigs and connect to blockchain's first truly decentralized freelance platform                             
                            </p>   
                             <div className="w-full md:w-[293.4px] h-[35px] md:h-[39.6px]  flex items-center justify-between text-xs md:text-base rounded-md">                             
                                <motion.button 
                                    className="w-[100px] md:w-[135px] h-[28px] md:h-full bg-white text-[#5B3AED] font-[poppins] rounded-[6px] md:rounded-[9px] font-medium text-xs md:text-sm transition-colors shadow-lg" 
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
                                >
                                    Sign Up
                                </motion.button>
                                <div className="font-medium font-[poppins] text-[10px] md:text-[14.4px] text-white">join 11000+ others</div>                         
                            </div>                       
                        </div>                         
                        
                    </div>                     
                    <div className="w-full md:w-[517.5px] h-full  p-2 md:p-4 flex items-center justify-center">                         
                        <img 
                            src="src\assets\human.svg" 
                            alt="Header image"
                            className="w-full h-full max-w-[250px] md:max-w-full max-h-[200px] md:max-h-full object-contain"
                        />                     
                    </div>                 
                </article>             
            </section>         
        </>     
    ) 
}  

export default Header;