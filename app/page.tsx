"use client";

import { useAuth } from '@/contexts/AuthContext';
import { PricingSection } from '@/components/PricingSection';
import { useTrialStatus } from '@/hooks/useTrialStatus';
// import { DemoWidget } from '@/components/DemoWidget';
// import { MetricCard } from '@/components/MetricCard';
import { TypewriterEffect } from '@/components/TypewriterEffect';
import { FaReddit } from 'react-icons/fa';
import { 
  FaGithub, 
  FaDiscord, 
  FaProductHunt,
  FaXTwitter,
  FaHackerNews,
  FaInstagram,
  FaTiktok,
  FaYoutube
} from 'react-icons/fa6';
import { 
 Lock, CreditCard, Moon
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link as ScrollLink } from 'react-scroll';
import { VideoModal } from '@/components/VideoModal';
import Image from 'next/image';

/* eslint-disable @typescript-eslint/no-unused-vars */

// Idea Validation Workflow Steps
const workflowSteps = [
  {
    title: "Step One — Describe Your Idea",
    description: "Provide a short description and key details of your startup idea.",
    preview: <TypewriterEffect text="📝 Analyzing your idea description..." />
  },
  {
    title: "Step Two — Validate Key Dimensions",
    description: "Evaluate market, competition, pain level, scalability, and other factors.",
    preview: <TypewriterEffect text="🔍 Evaluating market potential and competitive landscape..." />
  },
  {
    title: "Step Three — Score Your Idea",
    description: "Your idea receives a structured score across 20 dimensions.",
    preview: <TypewriterEffect text="📊 Calculating comprehensive validation score..." />
  },
  {
    title: "Step Four — Compare & Decide",
    description: "Review multiple ideas side-by-side and choose the strongest direction.",
    preview: <TypewriterEffect text="⚖️ Comparing ideas and generating recommendations..." />
  }
];

// Update platforms to be generic
const platforms = [
  { name: 'Platform 1', icon: FaGithub },
  { name: 'Platform 2', icon: FaDiscord },
  { name: 'Platform 3', icon: FaReddit },
  { name: 'Platform 4', icon: FaProductHunt },
  { name: 'Platform 5', icon: FaXTwitter },
  { name: 'Platform 6', icon: FaHackerNews },
  { name: 'Platform 7', icon: FaInstagram },
  { name: 'Platform 8', icon: FaTiktok },
  { name: 'Platform 9', icon: FaYoutube }
];

// Update workflowSections to be generic
const workflowSections = [
  {
    id: "overview",
    title: "Overview",
    description: "Everything you need to build modern SaaS applications",
    bgColor: "bg-white dark:bg-gray-950"
  },
  {
    id: "authentication",
    title: "Authentication",
    description: "Secure user authentication with multiple providers",
    bgColor: "bg-gray-50 dark:bg-gray-950",
    metrics: [
      { label: "Auth Providers", value: "5+" },
      { label: "Setup Time", value: "2min" },
      { label: "Security", value: "A+" }
    ]
  },
  {
    id: "payments",
    title: "Payments",
    description: "Seamless payment integration with Stripe",
    bgColor: "bg-white dark:bg-gray-950",
    metrics: [
      { label: "Integration", value: "1-Click" },
      { label: "Providers", value: "Stripe" },
      { label: "Setup Time", value: "5min" }
    ]
  },
  {
    id: "database",
    title: "Database",
    description: "Powerful database with Supabase integration",
    bgColor: "bg-gray-50 dark:bg-gray-950",
    metrics: [
      { label: "Database", value: "PostgreSQL" },
      { label: "Real-time", value: "Yes" },
      { label: "Security", value: "RLS" }
    ]
  },
  {
    id: "features",
    title: "Features",
    description: "Additional features to enhance your application",
    bgColor: "bg-white dark:bg-gray-950",
    metrics: [
      { label: "Dark Mode", value: "Built-in" },
      { label: "Components", value: "50+" },
      { label: "TypeScript", value: "100%" }
    ]
  },
  {
    id: "pricing",
    title: "Pricing",
    description: "Simple, transparent pricing for your needs",
    bgColor: "bg-gray-50 dark:bg-gray-950"
  }
];

// Custom Hook to create section progress values
function useSectionProgressValues(numSections: number) {
  const { scrollYProgress } = useScroll();
  
  // Create all transforms at once, at the top level
  const section1Progress = useTransform(
    scrollYProgress,
    [0 / numSections, 1 / numSections],
    [0, 1]
  );
  const section2Progress = useTransform(
    scrollYProgress,
    [1 / numSections, 2 / numSections],
    [0, 1]
  );
  const section3Progress = useTransform(
    scrollYProgress,
    [2 / numSections, 3 / numSections],
    [0, 1]
  );
  const section4Progress = useTransform(
    scrollYProgress,
    [3 / numSections, 4 / numSections],
    [0, 1]
  );

  return [section1Progress, section2Progress, section3Progress, section4Progress];
}

// Feature cards data
const featureCards = [
  {
    title: "Authentication",
    description: "Supabase auth with social providers",
    icon: <Lock className="h-6 w-6 text-brand-500" />,
    bgGradient: "from-blue-500/10 to-purple-500/10"
  },
  {
    title: "Payments",
    description: "Stripe subscription management",
    icon: <CreditCard className="h-6 w-6 text-brand-500" />,
    bgGradient: "from-success-500/10 to-success-500/10"
  },
  {
    title: "Dark Mode",
    description: "Built-in theme management",
    icon: <Moon className="h-6 w-6 text-brand-500" />,
    bgGradient: "from-orange-500/10 to-error-500/10"
  }
];

export default function LandingPage() {
  const { user } = useAuth();
  const { isInTrial } = useTrialStatus();
  const [activeSection, setActiveSection] = useState("overview");
  const sectionProgressValues = useSectionProgressValues(workflowSections.length);
  
  const router = useRouter();

  const [dashboardRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const { scrollYProgress } = useScroll();

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const showDevBanner = process.env.NEXT_PUBLIC_DEV_BANNER === 'true';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 relative">
      {showDevBanner && (
        <div className="fixed top-4 left-1/2 -trangray-x-1/2 z-50 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold shadow-lg">
          DEV ENVIRONMENT
        </div>
      )}
      {/* Enhanced Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 overflow-x-auto hide-scrollbar">
            {workflowSections.map((section, index) => (
              <ScrollLink
                key={section.id}
                to={section.id}
                spy={true}
                smooth={true}
                offset={-100}
                duration={500}
                onSetActive={() => setActiveSection(section.id)}
                className={`flex items-center cursor-pointer group min-w-fit mx-4 first:ml-0 last:mr-0`}
              >
                <div className="relative">
                  <span 
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 transition-all duration-300
                      ${activeSection === section.id 
                      ? 'bg-brand-500 dark:bg-brand-400 text-white' 
                      : 'bg-brand-500/10 dark:bg-brand-400/10 text-brand-500 dark:text-brand-400 group-hover:bg-brand-500/20 dark:group-hover:bg-brand-400/20'}`}
                  >
                    {index + 1}
                  </span>
                </div>
                <span 
                  className={`text-sm font-medium transition-colors duration-300 hidden md:block whitespace-nowrap
                    ${activeSection === section.id 
                    ? 'text-brand-500 dark:text-brand-400' 
                    : 'text-gray-600 dark:text-gray-300 group-hover:text-brand-500 dark:group-hover:text-brand-400'}`}
                >
                  {section.title}
                </span>
              </ScrollLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section - Now acts as Overview */}
      <div id="overview" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-400/10 to-blue-light-400/10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative pt-20 pb-16 sm:pb-24">
            {/* Header Content */}
            <div className="text-center">
              <div className="inline-block mb-4 px-4 py-2 bg-brand-500/10 dark:bg-brand-500/20 rounded-full">
                <span className="text-sm font-semibold text-brand-500 dark:text-brand-400">
                  🚀 Validate Faster, Launch Smarter
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                <span className="block mb-2">Your Ideas Validation</span>
                <span className="block bg-gradient-to-r from-brand-500 via-blue-light-500 to-brand-500 bg-clip-text text-transparent">
                  Framework
                </span>
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-xl sm:text-2xl text-gray-600 dark:text-gray-300 font-medium">
                Validate up to <span className="text-brand-500 dark:text-brand-400 font-bold">50 startup ideas</span> in under <span className="text-blue-light-500 dark:text-blue-light-400 font-bold">30 minutes</span>
              </p>
              <p className="mt-4 max-w-2xl mx-auto text-base text-gray-500 dark:text-gray-400">
                Stop wasting months on ideas that won&apos;t work. Get instant validation signals, market insights, and actionable feedback before you write a single line of code.
              </p>
              
              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={() => router.push('/dashboard')} 
                  className="group px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold text-lg relative overflow-hidden"
                >
                  <span className="relative z-10">Start Validating Now — Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-light-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    Watch How It Works
                  </span>
                </motion.button>
              </div>
              
              {/* Social Proof */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">★★★★★</span>
                  <span>No credit card required</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                <div>48-hour free trial</div>
                <div className="hidden sm:block w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                <div>Cancel anytime</div>
              </div>
            </div>

            {/* Combined Preview: Comparison Table + Workflow Steps */}
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Ideas Comparison Preview */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-700/50">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 via-transparent to-blue-light-500/20 opacity-50 blur-xl" />
                  
                  {/* Image container with hover effect */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10"
                  >
                    <Image 
                      src="/ideas-comparison-table.png" 
                      alt="Compare startup ideas side by side with scores and market data"
                      width={1344}
                      height={896}
                      className="w-full h-auto rounded-xl"
                      priority
                    />
                    
                    {/* Overlay badge */}
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-success-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-lg">
                      ✓ Live Preview
                    </div>
                  </motion.div>
                </div>
                
                {/* Caption */}
                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Side-by-side comparison of validated startup ideas
                </p>
              </motion.div>

              {/* Workflow Steps */}
              <div className="grid grid-cols-1 gap-4">
                {workflowSteps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 1, y: 0 }}
                    className="relative p-4 bg-white/5 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 backdrop-blur-sm rounded-xl shadow-lg hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-colors"
                  >
                    <div className="absolute -left-2 top-1/2 -trangray-y-1/2 w-8 h-8 bg-brand-500 dark:bg-brand-400 text-white rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div className="ml-8">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other sections */}
      {workflowSections.slice(1).map((section, index) => (
        <motion.section
          key={section.id}
          id={section.id}
          className={`py-20 ${section.bgColor}`}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          onViewportEnter={() => setActiveSection(section.id)}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {section.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {section.description}
              </p>
            </div>

            {/* Clean Metrics Display */}
            {section.metrics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {section.metrics.map((metric, i) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                  >
                    <div className="text-3xl font-bold text-brand-500 mb-2">
                      {metric.value}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {metric.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pricing Section */}
            {section.id === "pricing" && <PricingSection />}
          </div>
        </motion.section>
      ))}

      {/* Enhanced CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="relative py-20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-400/10 to-blue-light-400/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl p-12 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <motion.h2 
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                className="text-3xl font-bold text-gray-900 dark:text-white"
              >
                Ready to Get Started?
              </motion.h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Start using our product today
              </p>
              
              <div className="mt-10 flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Watch Demo
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/dashboard')}
                  className="px-8 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-brand-500 dark:text-brand-400 border-2 border-brand-500 dark:border-brand-400 rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Start Free Trial
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoId="S1cnQG0-LP4"
      />
    </div>
  );
}

