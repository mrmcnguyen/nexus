"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="tw-relative tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-overflow-hidden">
      {/* Background with subtle assets */}
      <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-br tw-from-gray-50 tw-to-gray-100 dark:tw-from-gray-900 dark:tw-to-gray-800">
        <div className="tw-absolute tw-inset-0 tw-bg-[url('/assets/images/background/hero-bg.svg')] tw-bg-cover tw-bg-center tw-opacity-10" />
      </div>

      <div className="tw-relative tw-z-10 tw-container tw-mx-auto tw-px-6 tw-text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="tw-max-w-4xl tw-mx-auto"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="tw-mb-8"
          >
            <Image
              src="/assets/logo/logo.png"
              alt="Nexus Logo"
              width={120}
              height={120}
              className="tw-mx-auto tw-rounded-2xl tw-shadow-lg"
            />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="tw-font-poly tw-text-5xl tw-font-bold tw-text-gray-900 dark:tw-text-white tw-mb-6 tw-leading-tight"
          >
            Master Your Productivity
            <br />
            <span className="tw-text-blue-600">One Task at a Time</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="tw-text-gray-600 dark:tw-text-gray-300 tw-text-xl tw-mb-8 tw-leading-relaxed tw-max-w-2xl tw-mx-auto"
          >
            Transform your workflow with intelligent task management, time tracking, and seamless collaboration tools designed for modern professionals.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-4 tw-justify-center tw-items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="tw-bg-blue-600 tw-text-white tw-rounded-lg tw-px-8 tw-py-4 tw-text-lg tw-font-semibold hover:tw-bg-blue-700 tw-transition-colors tw-duration-200 tw-shadow-lg hover:tw-shadow-xl"
            >
              Start Your Free Trial
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="tw-border-2 tw-border-gray-300 dark:tw-border-gray-600 tw-text-gray-700 dark:tw-text-gray-300 tw-rounded-lg tw-px-8 tw-py-4 tw-text-lg tw-font-semibold hover:tw-bg-gray-50 dark:hover:tw-bg-gray-800 tw-transition-colors tw-duration-200"
            >
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="tw-mt-16 tw-text-sm tw-text-gray-500 dark:tw-text-gray-400"
          >
            <p className="tw-mb-4">Trusted by 10,000+ professionals worldwide</p>
            <div className="tw-flex tw-justify-center tw-items-center tw-gap-8 tw-opacity-60">
              <div className="tw-w-20 tw-h-8 tw-bg-gray-300 dark:tw-bg-gray-600 tw-rounded" />
              <div className="tw-w-20 tw-h-8 tw-bg-gray-300 dark:tw-bg-gray-600 tw-rounded" />
              <div className="tw-w-20 tw-h-8 tw-bg-gray-300 dark:tw-bg-gray-600 tw-rounded" />
              <div className="tw-w-20 tw-h-8 tw-bg-gray-300 dark:tw-bg-gray-600 tw-rounded" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="tw-absolute tw-bottom-8 tw-left-1/2 tw-transform tw--translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="tw-w-6 tw-h-10 tw-border-2 tw-border-gray-400 dark:tw-border-gray-500 tw-rounded-full tw-flex tw-justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="tw-w-1 tw-h-3 tw-bg-gray-400 dark:tw-bg-gray-500 tw-rounded-full tw-mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

