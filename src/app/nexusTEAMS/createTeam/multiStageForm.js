'use client';
import React, { useEffect, useState } from "react";
import StageOne from "./stageOne";
import StageTwo from "./stageTwo";
import StageThree from './stageThree'
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "../../../../supabase/client";
import { createProjectAction } from '../../project-actions';
import { useRouter } from "next/navigation";

const MultiStageForm = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [userID, setUserID] = useState(null);
  const [formData, setFormData] = useState({
    projName: "Assign a Project Name",
    orgName: "Assign an Organisation Name",
    description: "Add a project description",
  });
  const router = useRouter();
  const supabase = createClient();

  // Fetch user ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data: user, error } = await supabase.auth.getUser();
      if (user) {
        setUserID(user.user.id);
      } else {
        console.error('Error while fetching user ID: ', error);
      }
    };

    fetchUser();
  }, []);

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
    console.log(formData);
  };

  const goToPreviousStage = () => {
    if (currentStage > 0) setCurrentStage((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    const res = createProjectAction(formData.projName, formData.orgName, formData.description, userID);
    if (res) {
      console.log("Project Created: ", formData);
      router.push('./allTeams');
    } else {
      console.error("Error creating project. Please check logs.");
    }
  }

  return (
    <div className="flex flex-col w-full max-w-[600px] mt-10 mx-auto min-h-screen">
      {/* Container with flex-col to stack elements vertically */}
      <div className="flex-grow-0 w-full items-center">
        {/* Progress Bar */}
        <div className="w-full bg-gray-600 h-2 rounded-full mb-4">
          <div
            className="h-full bg-[#6db6fe] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Render Current Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ delay: 0.025 }}
          >
            {stages[currentStage]}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="button-group mt-4 flex flex-row gap-4 justify-center">
          {/* Previous and Next buttons (unchanged) */}
          <button
            onClick={goToPreviousStage}
            disabled={currentStage === 0}
            className="group relative inline-flex h-12 w-32 items-center justify-center overflow-hidden rounded-full bg-[#454545] hover:opacity-50 font-medium text-neutral-200 transition-all duration-300"
          >
            <div className="inline-flex whitespace-nowrap translate-x-3 opacity-100 transition-all duration-200">
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
          <button
            onClick={() => {
              if (currentStage === stages.length - 1) {
                handleSubmit();
              } else {
                goToNextStage();
              }
            }}
            className="group relative inline-flex h-12 w-32 items-center justify-center overflow-hidden rounded-full bg-[#6db6fe] hover:opacity-70 font-medium text-neutral-200 transition-all duration-300"
          >
            <div className="inline-flex whitespace-nowrap -translate-x-3 opacity-100 transition-all duration-200">
              {currentStage === stages.length - 1 ? "Submit" : "Next"}
            </div>
            <div className="absolute right-3.5">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
              >
                <path
                  d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </button>
        </div>

        {/* Summary Section */}
        <div className="mt-4 text-left mb-4 p-4 rounded-lg">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col text-center">
              <div className="text-sm text-gray-500">Project Name</div>
              <h1 className="text-gray-400 text-xl">{formData.projName}</h1>
            </div>
            <div className="flex flex-col text-center">
              <div className="text-sm text-gray-500">Organisation Name</div>
              <h1 className="text-gray-400 text-xl">{formData.orgName}</h1>
            </div>
            <div className="flex flex-col text-center">
              <div className="text-sm text-gray-500">Project Description</div>
              <h1 className="text-gray-400 text-xl break-words whitespace-pre-wrap overflow-wrap-break-word">
                {formData.description}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStageForm;