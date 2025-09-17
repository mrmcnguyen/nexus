"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    icon: "/assets/images/home/task-management.svg",
    title: "Smart Task Management",
    description: "Organize your work with intelligent task prioritization, deadlines, and progress tracking that adapts to your workflow."
  },
  {
    icon: "/assets/images/home/time-tracking.svg",
    title: "Advanced Time Tracking",
    description: "Monitor your productivity with detailed time analytics, Pomodoro timers, and automated time logging for better insights."
  },
  {
    icon: "/assets/images/home/collaboration.svg",
    title: "Seamless Collaboration",
    description: "Work together effortlessly with real-time updates, shared workspaces, and integrated communication tools."
  },
  {
    icon: "/assets/images/home/analytics.svg",
    title: "Productivity Analytics",
    description: "Gain valuable insights into your work patterns with comprehensive reports and data-driven recommendations."
  },
  {
    icon: "/assets/images/home/integrations.svg",
    title: "Powerful Integrations",
    description: "Connect with your favorite tools including Slack, Google Calendar, Notion, and 50+ other popular applications."
  },
  {
    icon: "/assets/images/home/security.svg",
    title: "Enterprise Security",
    description: "Bank-level security with end-to-end encryption, SSO, and compliance with SOC 2 and GDPR standards."
  }
];

export default function Features() {
  return (
    <section className="tw-py-20 tw-bg-white dark:tw-bg-gray-900">
      <div className="tw-container tw-mx-auto tw-px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="tw-text-center tw-mb-16"
        >
          <h2 className="tw-font-poly tw-text-4xl tw-font-bold tw-text-gray-900 dark:tw-text-white tw-mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="tw-text-gray-600 dark:tw-text-gray-300 tw-text-xl tw-max-w-2xl tw-mx-auto">
            Powerful features designed to boost your productivity and streamline your workflow
          </p>
        </motion.div>

        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-2xl tw-shadow-md tw-p-8 tw-transition-all tw-duration-300 hover:tw-shadow-xl"
            >
              <div className="tw-mb-6">
                <div className="tw-w-16 tw-h-16 tw-bg-blue-100 dark:tw-bg-blue-900 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-mb-4">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={32}
                    height={32}
                    className="tw-w-8 tw-h-8"
                  />
                </div>
                <h3 className="tw-font-poly tw-text-xl tw-font-semibold tw-text-gray-900 dark:tw-text-white tw-mb-3">
                  {feature.title}
                </h3>
                <p className="tw-text-gray-600 dark:tw-text-gray-300 tw-leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="tw-text-center tw-mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="tw-bg-blue-600 tw-text-white tw-rounded-lg tw-px-8 tw-py-4 tw-text-lg tw-font-semibold hover:tw-bg-blue-700 tw-transition-colors tw-duration-200 tw-shadow-lg hover:tw-shadow-xl"
          >
            Explore All Features
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

