import WorkDisplay from "./workdisplay"
import HowItWorks from "./howItWorks"

const BrowseOpportunitySection = () => {
    return (
        <>
            <div className="w-full h-auto md:h-[677px] flex flex-col lg:flex-row justify-center gap-4 lg:gap-1.5 items-center p-4 lg:p-0">
                <WorkDisplay/>
                <HowItWorks/>
            </div>
        </>
    )
}

export default BrowseOpportunitySection