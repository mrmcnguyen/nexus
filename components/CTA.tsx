"use client";

import React from "react";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="tw-py-20 tw-bg-gradient-to-r tw-from-blue-600 tw-to-purple-600 tw-relative tw-overflow-hidden">
      {/* Background Pattern */}
      <div className="tw-absolute tw-inset-0 tw-bg-[url('/assets/images/background/cta-pattern.svg')] tw-bg-cover tw-bg-center tw-opacity-10" />
      
      {/* Floating Elements */}
      <div className="tw-absolute tw-top-10 tw-left-10 tw-w-20 tw-h-20 tw-bg-white tw-opacity-10 tw-rounded-full tw-animate-pulse" />
      <div className="tw-absolute tw-top-32 tw-right-20 tw-w-16 tw-h-16 tw-bg-white tw-opacity-10 tw-rounded-full tw-animate-pulse tw-delay-1000" />
      <div className="tw-absolute tw-bottom-20 tw-left-1/4 tw-w-12 tw-h-12 tw-bg-white tw-opacity-10 tw-rounded-full tw-animate-pulse tw-delay-2000" />

      <div className="tw-container tw-mx-auto tw-px-6 tw-relative tw-z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="tw-text-center tw-max-w-4xl tw-mx-auto"
        >
          <h2 className="tw-font-poly tw-text-5xl tw-font-bold tw-text-white tw-mb-6 tw-leading-tight">
            Ready to Transform Your Productivity?
          </h2>
          
          <p className="tw-text-xl tw-text-blue-100 tw-mb-8 tw-leading-relaxed tw-max-w-2xl tw-mx-auto">
            Join thousands of professionals who have already revolutionized their workflow. 
            Start your free trial today and experience the difference.
          </p>

          <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-4 tw-justify-center tw-items-center tw-mb-8">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="tw-bg-white tw-text-blue-600 tw-rounded-lg tw-px-8 tw-py-4 tw-text-lg tw-font-semibold hover:tw-bg-gray-100 tw-transition-colors tw-duration-200 tw-shadow-lg hover:tw-shadow-xl tw-w-full sm:tw-w-auto"
            >
              Start Free Trial
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="tw-border-2 tw-border-white tw-text-white tw-rounded-lg tw-px-8 tw-py-4 tw-text-lg tw-font-semibold hover:tw-bg-white hover:tw-text-blue-600 tw-transition-colors tw-duration-200 tw-w-full sm:tw-w-auto"
            >
              Schedule Demo
            </motion.button>
          </div>

          {/* Trust Indicators */}
          <div className="tw-flex tw-flex-col sm:tw-flex-row tw-items-center tw-justify-center tw-gap-6 tw-text-blue-100">
            <div className="tw-flex tw-items-center tw-gap-2">
              <svg className="tw-w-5 tw-h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="tw-flex tw-items-center tw-gap-2">
              <svg className="tw-w-5 tw-h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>14-day free trial</span>
            </div>
            <div className="tw-flex tw-items-center tw-gap-2">
              <svg className="tw-w-5 tw-h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

