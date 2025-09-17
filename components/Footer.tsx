"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const footerLinks = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Integrations", href: "#integrations" },
    { name: "API", href: "#api" }
  ],
  Company: [
    { name: "About", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "Careers", href: "#careers" },
    { name: "Press", href: "#press" }
  ],
  Resources: [
    { name: "Help Center", href: "#help" },
    { name: "Documentation", href: "#docs" },
    { name: "Community", href: "#community" },
    { name: "Tutorials", href: "#tutorials" }
  ],
  Legal: [
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Cookie Policy", href: "#cookies" },
    { name: "Contact", href: "#contact" }
  ]
};

const socialLinks = [
  { name: "Twitter", href: "#", icon: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
  { name: "LinkedIn", href: "#", icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" },
  { name: "GitHub", href: "#", icon: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" }
];

export default function Footer() {
  return (
    <footer className="tw-bg-gray-900 tw-text-gray-300">
      <div className="tw-container tw-mx-auto tw-px-6 tw-py-16">
        {/* Main Footer Content */}
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-6 tw-gap-8 tw-mb-12">
          {/* Logo and Description */}
          <div className="lg:tw-col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="tw-mb-6"
            >
              <Image
                src="/assets/logo/logo.png"
                alt="Nexus Logo"
                width={120}
                height={40}
                className="tw-mb-4"
              />
              <p className="tw-text-gray-400 tw-leading-relaxed tw-max-w-sm">
                Empowering professionals worldwide with intelligent productivity tools that transform how you work, collaborate, and achieve your goals.
              </p>
            </motion.div>

            {/* Social Links */}
            <div className="tw-flex tw-gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="tw-w-10 tw-h-10 tw-bg-gray-800 tw-rounded-lg tw-flex tw-items-center tw-justify-center hover:tw-bg-blue-600 tw-transition-colors tw-duration-200"
                >
                  <svg className="tw-w-5 tw-h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="tw-font-poly tw-font-semibold tw-text-white tw-mb-4">
                {category}
              </h3>
              <ul className="tw-space-y-3">
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 5 }}
                      className="tw-text-gray-400 hover:tw-text-white tw-transition-colors tw-duration-200 tw-text-sm"
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="tw-border-t tw-border-gray-800 tw-pt-8 tw-mb-8"
        >
          <div className="tw-max-w-md tw-mx-auto tw-text-center">
            <h3 className="tw-font-poly tw-font-semibold tw-text-white tw-mb-2">
              Stay Updated
            </h3>
            <p className="tw-text-gray-400 tw-text-sm tw-mb-4">
              Get the latest productivity tips and feature updates delivered to your inbox.
            </p>
            <div className="tw-flex tw-gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="tw-flex-1 tw-bg-gray-800 tw-border tw-border-gray-700 tw-rounded-lg tw-px-4 tw-py-2 tw-text-white tw-placeholder-gray-400 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-600"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="tw-bg-blue-600 tw-text-white tw-px-6 tw-py-2 tw-rounded-lg hover:tw-bg-blue-700 tw-transition-colors tw-duration-200 tw-font-medium"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="tw-border-t tw-border-gray-800 tw-pt-8 tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-center"
        >
          <div className="tw-text-gray-500 dark:tw-text-gray-400 tw-text-sm tw-text-center md:tw-text-left tw-mb-4 md:tw-mb-0">
            © 2024 Nexus. All rights reserved.
          </div>
          <div className="tw-flex tw-gap-6 tw-text-sm">
            <a href="#privacy" className="tw-text-gray-500 hover:tw-text-white tw-transition-colors">
              Privacy
            </a>
            <a href="#terms" className="tw-text-gray-500 hover:tw-text-white tw-transition-colors">
              Terms
            </a>
            <a href="#cookies" className="tw-text-gray-500 hover:tw-text-white tw-transition-colors">
              Cookies
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

