"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#000000]">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 bg-[#1e2a47] opacity-20" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              Fusion Plus Swap
            </motion.h1>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-col md:flex-row justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 px-8 py-4 rounded-full text-lg font-semibold transition-all"
                onClick={() => window.location.href = "/app"}
              >
                Start Swapping
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-white/50 hover:border-white/70 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all"
                onClick={() => window.location.href = "/docs"}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 px-4"
          >
            <div className="p-6 rounded-2xl bg-[#1e2a47] border border-[#1e2a47]/50 hover:border-white/10 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">Cross-Chain</h3>
              <p className="text-gray-400">Seamless swaps across multiple blockchain networks</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#1e2a47] border border-[#1e2a47]/50 hover:border-white/10 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">Atomic Swaps</h3>
              <p className="text-gray-400">Secure, trustless token exchanges</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#1e2a47] border border-[#1e2a47]/50 hover:border-white/10 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">HTLC Technology</h3>
              <p className="text-gray-400">Guaranteed transaction completion</p>
            </div>
          </motion.div>

          {/* Particle Animation */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ delay: 1, duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          >
            <div className="absolute inset-0">
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 0.5 }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Particle Animation */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ delay: 1 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-[#0a192f]" />
          </motion.div>
        </div>
      </div>


    </div>
  );
}
