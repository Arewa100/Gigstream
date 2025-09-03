const NavBar = () => {
    return(
        <>
            <div className="fixed top-[68px] left-0 right-0 z-50">
                <div className="w-full max-w-[1440px] h-[102px] mx-auto flex items-center justify-between bg-[#645CF6]/60">
                   <div className="h-full w-[533.2px] ">
                    <img 
                            src="src\assets\gigLogo.svg" 
                            alt="Header image"
                            className="w-full h-full max-w-[250px] md:max-w-full max-h-[200px] md:max-h-full object-contain opacity-20"
                        />  
                   </div>
                </div>
            </div>
        </>
    )
}

export default NavBar