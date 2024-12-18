import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StageThree( {formData, setFormData, nextStage}){

    const [description, setDescription] = useState('');
    const [descriptionError, setDescriptionError] = useState(false);

    const handleNext = () => {
        if (!formData.description.trim()) {
            setDescriptionError(true);
        } else {
          nextStage();
        }
      };

    return (
        <>
        <AnimatePresence mode='wait'>
      <div 
      className="w-full h-full px-5 sm:px-20 md:px-[100px] md:py-[46px] text-blue-marine flex flex-col">
        <div className="py-9 px-6 md:p-0 rounded-lg shadow-xl md:shadow-none relative z-20">
          <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ delay: 0.05 }}
          className="text-center mb-4 md:mb-6">
              <h1 className="text-2xl md:text-4xl font-semibold mb-2">What is your project about?</h1>
              <p className="text-gray-cool text-sm">Write a desciption of the project.</p>
          </motion.div>
          <form className='text-sm'>
              <motion.div 
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ delay: 0.075 }}
              className="flex items-center justify-between">
                <label htmlFor="name" className='block font-medium'>Project Description</label>
                {descriptionError && <p className='font-semibold text-red-600'>This field is required</p>}
              </motion.div>
              <motion.textarea 
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ delay: 0.1 }}
                onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    setDescriptionError(false);
                  }}
                value={formData.description}
                type="text" id='name' placeholder='e.g. Develop a machine learning model to predict customer churn for a telecommunications company, using historical customer data and incorporating feature engineering techniques.' className={`p-2.5 rounded-lg bg-[#1f1f1f] focus:outline-none focus:border-[#6db6fe] focus:ring-1 focus:ring-[#6db6fe] border-2 border-[#454545] w-full mt-1 mb-3 md:mb-6 ${descriptionError && 'border-red-600 bg-red-100 animate-bergetar'}`} />
            
          </form>
        </div>
        <div className="flex-1 flex items-end justify-end py-5 md:p-0">
            <button name={'Next Step'} onClick={handleNext} />
        </div>
      </div>
    </AnimatePresence>
        </>
    );
}