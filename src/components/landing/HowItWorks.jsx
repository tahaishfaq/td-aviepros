const steps = [
    { id: 1, text: "Fill out personal info" },
    { id: 2, text: "Verify your info" },
    { id: 3, text: "Login to your app" },
  ];
  
  const HowItWorks = () => {
    return (
      <div className="py-12 sm:px-0 px-4">
        <div className="max-w-7xl mx-auto bg-[#57C11314] rounded-[16px]">
          <div className="p-12 text-center max-w-md mx-auto space-y-6">
            <h2 className="text-4xl font-medium">Get Set Up in 3 Easy Steps</h2>
  
            <div className="flex flex-col items-center gap-16 relative">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center relative">
                  {/* Dotted Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-[95px] left-1/2 transform -translate-x-1/2 w-px h-12 border-l-2 border-dotted border-[#D5D7DA] z-0" />
                  )}
  
                  {/* Step Number */}
                  <div className="bg-green-600 text-white text-lg rounded-full w-12 h-12 flex items-center justify-center z-10 font-semibold">
                    {step.id}
                  </div>
  
                  {/* Step Text */}
                  <p className="mt-3 text-xl font-light text-black">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default HowItWorks;
  