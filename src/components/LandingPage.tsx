import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Detection',
      description: 'Advanced machine learning algorithms analyze patterns and detect insider threats with 95% accuracy.'
    },
    {
      icon: '🛡️',
      title: 'Real-time Protection',
      description: 'Continuous monitoring and instant alerts for suspicious activities and malware detection.'
    },
    {
      icon: '📊',
      title: 'Behavioral Analytics',
      description: 'Deep analysis of user behavior patterns to identify anomalies and potential security breaches.'
    },
    {
      icon: '🏦',
      title: 'Financial Focus',
      description: 'Specifically designed for financial institutions in Kathmandu Valley with regulatory compliance.'
    },
    {
      icon: '📈',
      title: 'Risk Assessment',
      description: 'Comprehensive risk scoring and detailed reports for informed security decision making.'
    },
    {
      icon: '🔒',
      title: 'Secure Infrastructure',
      description: 'Enterprise-grade security with encryption, access controls, and audit trails.'
    }
  ];

  return (
    <div className="min-h-screen bg-charcoal text-white-smoke">
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-medium-slate-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            <span className="text-xl font-bold">ThreatGuard</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex space-x-4"
          >
            <Link
              to="/login"
              className="px-6 py-2 text-white-smoke hover:text-medium-slate-blue transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="btn-primary"
            >
              Sign Up
            </Link>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-medium-slate-blue rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            AI-Powered
            <span className="text-medium-slate-blue block">Threat Detection</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90"
          >
            Protect your financial institution with advanced AI-based insider threat and malware detection 
            specifically designed for the Kathmandu Valley banking sector.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/signup"
              className="btn-primary text-lg px-8 py-3"
            >
              Start Free Trial
            </Link>
            <button className="btn-secondary text-lg px-8 py-3">
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Floating AI Elements */}
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 text-6xl opacity-20"
        >
          🤖
        </motion.div>
        <motion.div
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-20 text-4xl opacity-20"
        >
          🛡️
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-slate-gray/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Advanced Security Features</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Our AI-powered platform provides comprehensive protection against insider threats and malware 
              with real-time monitoring and intelligent analysis.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card hover:bg-slate-gray/30 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="opacity-90">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div className="card">
              <div className="text-4xl font-bold text-medium-slate-blue mb-2">95%</div>
              <div className="text-lg">Detection Accuracy</div>
            </div>
            <div className="card">
              <div className="text-4xl font-bold text-sea-green mb-2">24/7</div>
              <div className="text-lg">Real-time Monitoring</div>
            </div>
            <div className="card">
              <div className="text-4xl font-bold text-orange-400 mb-2">&lt;1min</div>
              <div className="text-lg">Alert Response Time</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-medium-slate-blue/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Secure Your Institution?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join leading financial institutions in Kathmandu Valley who trust our AI-powered security platform.
            </p>
            <Link
              to="/signup"
              className="btn-primary text-lg px-8 py-3 inline-block"
            >
              Get Started Today
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-charcoal border-t border-slate-gray">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-medium-slate-blue rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <span className="font-semibold">ThreatGuard</span>
          </div>
          <p className="opacity-75">
            © 2024 AI ThreatGuard. Securing Financial Institutions in Kathmandu Valley.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;