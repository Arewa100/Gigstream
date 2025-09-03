import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
const Header = ()=> {     
    return(         
        <>             
            <section className="w-full h-[400px] md:h-[556px] bg-[#5B3AED] flex flex-col justify-between px-4 md:px-6 lg:px-8">                 
                <div></div>                  
                <article className="w-full max-w-[1176px] h-[250px] md:h-[374px] mx-auto rounded-lg md:rounded-none flex flex-col md:flex-row justify-between gap-4 md:gap-0 bg-pink-400">                     
                    <div className="w-full md:w-[517.5px] h-full bg-red-500 text-white text-lg md:text-2xl font-bold flex flex-col justify-between">                         
                        <div className="bg-gray-700 p-3 md:p-4">                             
                            <h1 className="font-bold text-[18px] md:text-[32.4px] w-full md:w-[388.8px] h-auto md:h-[117px] bg-amber-300 font-[poppins] text-white mb-3 md:mb-4 p-2 md:p-0">                                 
                                Stream Into Your Next Big Opportunity                             
                            </h1>                             
                            <p className="font-medium text-[12px] md:text-[18px] w-full md:w-[499.5px] h-auto md:h-[105.3px] text-white font-[poppins] mb-3 md:mb-4">                                 
                                Discover premium Web3 gigs and connect to blockchain's first truly decentralized freelance platform                             
                            </p>   

                             <div className="w-full md:w-[293.4px] h-[35px] md:h-[39.6px] bg-amber-800 flex items-center justify-between text-xs md:text-base px-2 md:px-3 rounded-md">                             
                                <motion.button 
                                    className="w-[100px] md:w-[135px] h-[28px] md:h-full bg-white text-[#5B3AED] font-[poppins] rounded-[6px] md:rounded-[9px] font-medium text-xs md:text-sm transition-colors" 
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    whileHover={{ 
                                        scale: 1.05,
                                        backgroundColor: "#f3f4f6",
                                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
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
                    <div className="w-full md:w-[517.5px] h-full bg-red-500 p-2 md:p-4 flex items-center justify-center">                         
                        <div className="w-full h-full max-w-[250px] md:max-w-full max-h-[200px] md:max-h-full">
                            <Canvas
                                camera={{ position: [0, 0, 3], fov: 45 }}
                                style={{ width: '100%', height: '100%' }}
                            >
                                <ambientLight intensity={0.8} />
                                <pointLight position={[10, 10, 10]} intensity={0.5} />
                                <AnimatedImage />
                            </Canvas>
                        </div>                   
                    </div>                 
                </article>             
            </section>         
        </>     
    ) 
}  

export default Header;