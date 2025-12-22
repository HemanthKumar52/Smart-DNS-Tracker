"use client";

import { motion } from "framer-motion";
import { Shield, Zap, BookOpen } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    title: "Instant Diagnostics",
    description: "Get a comprehensive analysis of your DNS records in milliseconds. We check A, MX, TXT, SPF, and DMARC records automatically.",
  },
  {
    icon: <Shield className="w-6 h-6 text-green-400" />,
    title: "Security Logic",
    description: "Identify vulnerabilities in your email setup. We explain risks in plain English so you don't need to be a security expert.",
  },
  {
    icon: <BookOpen className="w-6 h-6 text-blue-400" />,
    title: "Learn & Fix",
    description: "Don't just see errors—understand them. Our AI-driven explanations guide you through the 'why' and 'how' of every record.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-4">
                Why Smart DNS?
            </h2>
            <p className="text-gray-400">
                Most DNS tools are built for sysadmins. Smart DNS is built for product teams, developers, and founders who need things to just work.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-2xl border border-white/5 hover:border-white/10 group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
