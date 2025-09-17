"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechCorp",
    content: "Nexus has completely transformed how I manage my projects. The time tracking features alone saved me 3 hours per week, and the collaboration tools made my team 40% more efficient.",
    avatar: "/assets/images/people/sarah-chen.jpg",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    role: "Software Engineer",
    company: "StartupXYZ",
    content: "The integration with my existing tools was seamless. I can now focus on coding instead of managing tasks across multiple platforms. The analytics insights are incredibly valuable.",
    avatar: "/assets/images/people/marcus-johnson.jpg",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "GrowthCo",
    content: "As someone who juggles multiple campaigns, Nexus helps me stay organized and on track. The visual project boards and deadline reminders are game-changers for my workflow.",
    avatar: "/assets/images/people/emily-rodriguez.jpg",
    rating: 5
  },
  {
    name: "David Kim",
    role: "Freelance Designer",
    company: "Independent",
    content: "The Pomodoro timer and focus mode features have significantly improved my concentration. I've been able to complete projects 25% faster while maintaining higher quality.",
    avatar: "/assets/images/people/david-kim.jpg",
    rating: 5
  },
  {
    name: "Lisa Thompson",
    role: "Operations Manager",
    company: "Enterprise Inc",
    content: "The team collaboration features are outstanding. Real-time updates and shared workspaces have eliminated communication gaps and improved our project delivery times.",
    avatar: "/assets/images/people/lisa-thompson.jpg",
    rating: 5
  },
  {
    name: "Alex Patel",
    role: "Consultant",
    company: "Strategy Partners",
    content: "Nexus gives me complete visibility into my productivity patterns. The detailed reports help me optimize my time and identify areas for improvement. Highly recommended!",
    avatar: "/assets/images/people/alex-patel.jpg",
    rating: 5
  }
];

export default function Testimonials() {
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
            What Our Users Say
          </h2>
          <p className="tw-text-gray-600 dark:tw-text-gray-300 tw-text-xl tw-max-w-2xl tw-mx-auto">
            Join thousands of professionals who have transformed their productivity with Nexus
          </p>
        </motion.div>

        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="tw-bg-white dark:tw-bg-gray-900 tw-rounded-xl tw-shadow-md tw-p-6 tw-transition-all tw-duration-300 hover:tw-shadow-xl"
            >
              {/* Rating */}
              <div className="tw-flex tw-items-center tw-mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="tw-w-5 tw-h-5 tw-text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <blockquote className="tw-text-gray-600 dark:tw-text-gray-300 tw-leading-relaxed tw-mb-6">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="tw-flex tw-items-center">
                <div className="tw-relative tw-w-12 tw-h-12 tw-rounded-full tw-overflow-hidden tw-mr-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="tw-object-cover"
                  />
                </div>
                <div>
                  <div className="tw-font-poly tw-font-semibold tw-text-gray-900 dark:tw-text-white">
                    {testimonial.name}
                  </div>
                  <div className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="tw-mt-16 tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-8 tw-text-center"
        >
          <div>
            <div className="tw-text-4xl tw-font-bold tw-text-blue-600 tw-mb-2">10,000+</div>
            <div className="tw-text-gray-600 dark:tw-text-gray-300">Active Users</div>
          </div>
          <div>
            <div className="tw-text-4xl tw-font-bold tw-text-green-600 tw-mb-2">40%</div>
            <div className="tw-text-gray-600 dark:tw-text-gray-300">Productivity Increase</div>
          </div>
          <div>
            <div className="tw-text-4xl tw-font-bold tw-text-purple-600 tw-mb-2">4.9/5</div>
            <div className="tw-text-gray-600 dark:tw-text-gray-300">User Rating</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

