import MyHeader from "@/components/MyHeader/MyHeader"
import Testimonials from "@/components/PremiumFeature/Testimonials"

const Plan = () => {
  return (
    <div className="mx-auto w-full px-4 md:px-0">
        <MyHeader 
            title="Take Your Party Planning to the Next Level"
            subtitle="Unlock unlimited AI-powered party planning, premium templates, and advanced tools that make every celebration unforgettable"
            className="text-3xl sm:text-5xl md:text-6xl"
            >    
        </MyHeader>
        <Testimonials />
    </div>
  )
}

export default Plan