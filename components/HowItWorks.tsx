"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    number: 1,
    title: "Sign Up & Setup",
    description: "Create your account in seconds and customize your workspace with your preferred settings and integrations.",
    image: "/assets/images/home/setup.svg",
    color: "tw-bg-blue-600"
  },
  {
    number: 2,
    title: "Organize Your Tasks",
    description: "Import your existing projects or start fresh. Use our smart categorization to organize tasks by priority and deadline.",
    image: "/assets/images/home/organize.svg",
    color: "tw-bg-green-600"
  },
  {
    number: 3,
    title: "Boost Productivity",
    description: "Track your progress, collaborate with your team, and watch your productivity soar with data-driven insights.",
    image: "/assets/images/home/productivity.svg",
    color: "tw-bg-purple-600"
  }
];

export default function HowItWorks() {
  return (
    <section className="tw-py-20 tw-bg-gray-50 dark:tw-bg-gray-800">
      <div className="tw-container tw-mx-auto tw-px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="tw-text-center tw-mb-16"
        >
          <h2 className="tw-font-poly tw-text-4xl tw-font-bold tw-text-gray-900 dark:tw-text-white tw-mb-4">
            How It Works
          </h2>
          <p className="tw-text-gray-600 dark:tw-text-gray-300 tw-text-xl tw-max-w-2xl tw-mx-auto">
            Get started in three simple steps and transform your productivity in minutes
          </p>
        </motion.div>

        <div className="tw-flex tw-flex-col lg:tw-flex-row tw-justify-between tw-items-center tw-gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="tw-flex tw-flex-col tw-items-center tw-text-center tw-max-w-sm"
            >
              {/* Step Number */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`${step.color} tw-text-white tw-rounded-full tw-w-16 tw-h-16 tw-flex tw-items-center tw-justify-center tw-text-2xl tw-font-bold tw-mb-6 tw-shadow-lg`}
              >
                {step.number}
              </motion.div>

              {/* Illustration */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="tw-mb-6 tw-w-48 tw-h-48 tw-bg-white dark:tw-bg-gray-700 tw-rounded-2xl tw-shadow-md tw-flex tw-items-center tw-justify-center tw-p-6"
              >
                <Image
                  src={step.image}
                  alt={step.title}
                  width={120}
                  height={120}
                  className="tw-w-32 tw-h-32"
                />
              </motion.div>

              {/* Content */}
              <div>
                <h3 className="tw-font-poly tw-text-2xl tw-font-semibold tw-text-gray-900 dark:tw-text-white tw-mb-4">
                  {step.title}
                </h3>
                <p className="tw-text-gray-600 dark:tw-text-gray-300 tw-leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector Arrow (hidden on mobile) */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.2 }}
                  viewport={{ once: true }}
                  className="tw-hidden lg:tw-block tw-absolute tw-right-[-6rem] tw-top-1/2 tw-transform tw--translate-y-1/2"
                >
                  <svg
                    className="tw-w-12 tw-h-12 tw-text-gray-300 dark:tw-text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="tw-text-center tw-mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="tw-bg-blue-600 tw-text-white tw-rounded-lg tw-px-8 tw-py-4 tw-text-lg tw-font-semibold hover:tw-bg-blue-700 tw-transition-colors tw-duration-200 tw-shadow-lg hover:tw-shadow-xl"
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

