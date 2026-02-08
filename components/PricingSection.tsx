// File: /components/PricingSection.tsx

// import Link from 'next/link';
// import { StripeBuyButton } from './StripeBuyButton';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// interface PricingSectionProps {
//   showFullDetails?: boolean;
// }

const pricingTiers = [
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    interval: "/month",
    description: "Perfect for small teams and startups",
    features: [
      "All template features",
      "Priority support",
      "Custom branding",
      "Analytics dashboard",
      "Team collaboration"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$49",
    interval: "/month",
    description: "For larger organizations",
    features: [
      "Everything in Pro",
      "Advanced security",
      "Custom integrations",
      "24/7 support",
      "SLA guarantee"
    ],
    cta: "Start Trial",
    popular: true
  },
  {
    id: "custom",
    name: "Custom",
    price: "Custom",
    interval: "",
    description: "Tailored to your needs",
    features: [
      "Custom development",
      "Dedicated support",
      "Custom SLA",
      "On-premise options",
      "Training sessions"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

export function PricingSection() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<string | null>("enterprise");

  const handleTierClick = (tierId: string) => {
    setSelectedTier(currentTier => currentTier === tierId ? null : tierId);
  };

  const handleCTAClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push('/profile');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      {pricingTiers.map((tier, i) => (
        <motion.div
          key={tier.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => handleTierClick(tier.id)}
          className={`relative rounded-2xl p-8 shadow-lg cursor-pointer transition-all duration-300 ${
            selectedTier === tier.id
              ? 'bg-brand-500/5 dark:bg-brand-500/10 ring-2 ring-brand-500 transform scale-105'
              : 'bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-brand-500/50'
          }`}
        >
          {/* Show Popular badge only for Enterprise tier */}
          {tier.popular && (
            <span className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 text-sm bg-brand-500 text-white rounded-full">
              Popular
            </span>
          )}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{tier.name}</h3>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">{tier.price}</span>
            <span className="ml-1 text-gray-500 dark:text-gray-400">{tier.interval}</span>
          </div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">{tier.description}</p>
          <ul className="mt-8 space-y-4">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-brand-500 mr-3" />
                <span className="text-gray-600 dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCTAClick}
            className={`mt-8 w-full py-3 px-4 rounded-lg text-center font-medium transition-colors ${
              selectedTier === tier.id
                ? 'bg-brand-500 text-white hover:bg-brand-600'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {tier.cta}
          </motion.button>
        </motion.div>
      ))}
    </div>
  );
}