import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Shield, Lock, UserCheck, RefreshCw, Mail } from 'lucide-react';

const FeatureCard = ({ icon, title, description }: { icon: JSX.Element, title: string, description: string }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
    <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-gray-800 dark:text-white">Privacy Policy</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Your privacy is our top priority at NeatNGO</p>
        </header>

        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800 dark:text-white">Our Commitment to You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-blue-500" />}
              title="Data Protection"
              description="We use industry-standard encryption to keep your data safe and secure."
            />
            <FeatureCard
              icon={<Lock className="w-8 h-8 text-blue-500" />}
              title="Privacy Controls"
              description="You have full control over your personal information and how it's used."
            />
            <FeatureCard
              icon={<UserCheck className="w-8 h-8 text-blue-500" />}
              title="Transparency"
              description="We're always clear about what data we collect and why we collect it."
            />
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-20">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">How We Handle Your Data</h2>
          <div className="space-y-6">
            {[
              { title: "Collection", content: "We collect minimal personal information through Google Auth, including your name, email, and profile picture." },
              { title: "Usage", content: "Your data is used solely to provide and improve our NGO management services." },
              { title: "Storage", content: "We use secure, encrypted databases to store your information, ensuring it's protected from unauthorized access." },
              { title: "Sharing", content: "We never sell your personal data. We only share it with your explicit consent or when required by law." },
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-blue-500">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800 dark:text-white">Your Rights</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <ul className="space-y-4">
              {[
                "Access and view your personal data",
                "Correct any inaccuracies in your data",
                "Request deletion of your data",
                "Object to processing of your data",
                "Request restriction of data processing",
                "Data portability",
                "Withdraw consent at any time",
              ].map((right, index) => (
                <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                  <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {right}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-blue-600 dark:bg-blue-800 rounded-xl shadow-lg p-8 text-white mb-20">
          <h2 className="text-3xl font-semibold mb-6">Stay Updated</h2>
          <p className="mb-6">We may update our Privacy Policy from time to time. Subscribe to receive notifications about important changes.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow p-3 rounded-l-lg text-gray-800 focus:outline-none"
            />
            <button className="bg-indigo-700 hover:bg-indigo-800 transition-colors duration-300 p-3 rounded-r-lg">
              Subscribe
            </button>
          </div>
        </section>

        <footer className="text-center">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">If you have any questions about our Privacy Policy, please reach out to us.</p>
          <a href="mailto:farhan@neatngo.com" className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors duration-300">
            <Mail className="w-5 h-5 mr-2" />
            farhan@neatngo.com
          </a>
        </footer>
      </div>
    </div>
  );
}