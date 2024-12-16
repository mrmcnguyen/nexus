import React, { useState } from "react";
import StageOne from "./stageOne";
import StageTwo from "./stageTwo";
import StageThree from './stageThree'
import { motion, AnimatePresence } from "framer-motion";

const MultiStageForm = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [formData, setFormData] = useState({
    projName: "Assign a Project Name",
    orgName: "Assign an Organisation Name",
    description: "Add a project description",
  });

  // Stage components
  const stages = [
    <StageOne formData={formData} setFormData={setFormData} nextStage={() => setCurrentStage(currentStage + 1)} />,
    <StageTwo formData={formData} setFormData={setFormData} nextStage={() => setCurrentStage(currentStage + 1)} />,
    <StageThree formData={formData} setFormData={setFormData} nextStage={() => setCurrentStage(currentStage + 1)} />,
  ];

  // Progress percentage calculation
  const progress = ((currentStage + 1) / stages.length) * 100;

  // Navigation handlers
  const goToNextStage = () => {
    if (currentStage < stages.length - 1) setCurrentStage((prev) => prev + 1);
  };

  const goToPreviousStage = () => {
    if (currentStage > 0) setCurrentStage((prev) => prev - 1);
  };

  return (
    <div style={{ width: "50%", textAlign: "center" }}>

      {/* Progress Bar */}
      <div style={{ width: "100%", backgroundColor: "#4b5563", height: "10px", borderRadius: "5px" }}>
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: "#6db6fe",
            borderRadius: "5px",
            transition: "width 0.3s ease",
          }}
        ></div>
      </div>

      {/* Render Current Stage */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage} // Triggers re-render and animations on stage change
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ delay: 0.1 }}
        >
          {stages[currentStage]}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="button-group mt-4 flex flex-row gap-4 justify-center">
      <button 
  onClick={goToPreviousStage} 
  disabled={currentStage === 0} 
  className="group relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#454545] font-medium text-neutral-200 transition-all duration-300 hover:w-32"
>
  <div className="inline-flex whitespace-nowrap opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-3">
    Previous
  </div>
  <div className="absolute left-3.5 flex items-center justify-center">
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
      <path 
        d="M6.85355 3.14645C6.65829 2.95118 6.34171 2.95118 6.14645 3.14645L2.14645 7.14645C1.95118 7.34171 1.95118 7.65829 2.14645 7.85355L6.14645 11.8536C6.34171 12.0488 6.65829 12.0488 6.85355 11.8536C7.04882 11.6583 7.04882 11.3417 6.85355 11.1464L3.70711 8H12.5C12.7761 8 13 7.77614 13 7.5C13 7.22386 12.7761 7 12.5 7H3.70711L6.85355 3.85355C7.04882 3.65829 7.04882 3.34171 6.85355 3.14645Z" 
        fill="currentColor" 
        fillRule="evenodd" 
        clipRule="evenodd"
      />
    </svg>
  </div>
</button>
        <button onClick={goToNextStage} disabled={currentStage === stages.length - 1} className="group relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#6db6fe] font-medium text-neutral-200 transition-all duration-300 hover:w-32"><div className="inline-flex whitespace-nowrap opacity-0 transition-all duration-200 group-hover:-translate-x-3 group-hover:opacity-100">Next</div><div className="absolute right-3.5"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg></div></button>
      </div>

      {/* Summary Section */}
      <div className="mt-4 text-left mb-4 p-4 rounded-lg">
        <ul className="flex flex-col justify-between gap-2">
        <div className="flex flex-col text-center">
          <div className="text-sm text-gray-500">Project Name</div>
          <h1 className="text-gray-400 text-xl">{formData.projName }</h1>
        </div>
        <div className="flex flex-col text-center">
          <div className="text-sm text-gray-500">Organisation Name</div>
          <h1 className="text-gray-400 text-xl">{formData.orgName}</h1>
        </div>
        <div className="flex flex-col text-center">
          <div className="text-sm text-gray-500">Project Description</div>
          <h1 className="text-gray-400 text-xl">{formData.description}</h1>
        </div>
        </ul>
      </div>

    </div>
  );
};

export default MultiStageForm;
