import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  useEffect(() => {
    const tl = gsap.timeline();

    tl.from("header h1 span span", {
      y: -100,
      opacity: 0,
      stagger: 0.05,
      duration: 0.15,
      ease: "bounce.out",
    });

    tl.from("header p", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* HERO SECTION */}
      <header className="py-32 px-6 text-center bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
        {/* Government Seal/Emblem */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 opacity-20">
          <div className="w-32 h-32 border-2 border-white rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs font-bold">GOVERNMENT</div>
              <div className="text-xs">OF INDIA</div>
            </div>
          </div>
        </div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-5 bg-[url('/gov-pattern.png')] bg-repeat"></div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-center items-center gap-4 mb-6">
              <img
                src="/Generated Image November 30, 2025 - 3_11PM.png"
                alt="AICTE"
                className="h-20 object-contain opacity-90"
              />
              <div className="h-12 w-px bg-white/30"></div>
              <img
                src="/Generated Image November 30, 2025 - 3_11PM (1).png"
                alt="UGC"
                className="h-20 object-contain opacity-90"
              />
            </div>

            <h1 className="text-5xl md:text-6xl font-light tracking-tight max-w-5xl mx-auto leading-tight mb-6">
              {"National AI Automation Platform"
                .split(" ")
                .map((word, index) => (
                  <span key={index} className="inline-block mr-3">
                    {word.split("").map((char, charIndex) => (
                      <span key={charIndex} className="inline-block">
                        {char}
                      </span>
                    ))}
                  </span>
                ))}
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mt-8 mb-12 leading-relaxed font-light">
            A Unified Digital Framework for Automated Application Evaluation,
            AI-Driven Validation, and Complete Process Transparency
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <Link
              to="/login"
              className="bg-white text-black py-4 px-8 rounded-sm text-base font-medium hover:bg-gray-100 transition-all duration-300 border border-white"
            >
              Register Institution
            </Link>
            <Link
              to="/login"
              className="bg-transparent text-white py-4 px-8 rounded-sm text-base font-medium border border-white hover:bg-white hover:text-black transition-all duration-300"
            >
              Official Login
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex justify-center items-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Secure & Encrypted
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Government Certified
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              AI Powered
            </div>
          </div>
        </div>
      </header>

      {/* KEY OBJECTIVES / FEATURES */}
      <section className="py-24 px-6 max-w-7xl mx-auto feature-card">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 bg-gray-900 rounded-full mb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-300 font-medium">
              Platform Capabilities
            </p>
          </div>
          <h2 className="text-4xl font-light text-gray-100 mb-6">
            Advanced AI Automation Framework
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Enterprise-grade solution designed for government workflow
            optimization, ensuring complete transparency and efficiency in
            application processing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: "/Generated Image November 30, 2025 - 3_16PM.png",
              title: "AI Document Verification",
              desc: "Advanced ML algorithms for automated validation of submitted documents with 99.8% accuracy",
              stats: "99.8% Accuracy",
            },
            {
              icon: "/Generated Image November 30, 2025 - 3_20PM.png",
              title: "Intelligent Risk Analysis",
              desc: "Real-time fraud detection and inconsistency identification using predictive analytics",
              stats: "Real-time Analysis",
            },
            {
              icon: "/Generated Image November 30, 2025 - 3_21PM (1).png",
              title: "Centralized Dashboard",
              desc: "Comprehensive monitoring system with real-time tracking of all application stages",
              stats: "Live Monitoring",
            },
            {
              icon: "/Generated Image November 30, 2025 - 3_21PM.png",
              title: "Transparency Engine",
              desc: "Automated audit trails and RTI-compliant report generation for complete accountability",
              stats: "100% Audit Ready",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-lg p-8 border border-gray-800 hover:border-gray-600 transition-all duration-300 group"
            >
              <div className="flex flex-col h-full">
                <div className="mb-6 mx-auto">
                  <img
                    src={feature.icon}
                    className="w-26 h-26 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    alt={feature.title}
                  />
                </div>
                <h3 className="text-xl font-medium text-white mb-4 group-hover:text-gray-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-grow mb-4">
                  {feature.desc}
                </p>
                <div className="pt-4 border-t border-gray-800">
                  <span className="text-xs font-medium text-gray-300 bg-gray-800 px-3 py-1 rounded-full">
                    {feature.stats}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WORKFLOW SECTION */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-black rounded-full mb-6">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-300 font-medium">
                Process Flow
              </p>
            </div>
            <h2 className="text-4xl font-light text-gray-100 mb-6">
              Streamlined Government Workflow
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Institution Registration",
                  desc: "Secure onboarding with KYC verification",
                },
                {
                  step: "02",
                  title: "Document Submission",
                  desc: "Structured upload with format validation",
                },
                {
                  step: "03",
                  title: "AI Processing",
                  desc: "Automated analysis and risk assessment",
                },
                {
                  step: "04",
                  title: "Committee Review",
                  desc: "Expert evaluation of flagged cases",
                },
                {
                  step: "05",
                  title: "Approval & Notification",
                  desc: "Final decision with automated updates",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-6 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-black border border-gray-700 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                    <span className="font-mono text-sm font-bold">
                      {item.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="bg-black border border-gray-800 rounded-lg p-8">
                <img
                  src="/Generated Image November 30, 2025 - 3_27PM.png"
                  className="w-full h-auto rounded"
                  alt="Government Workflow Process"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-gray-600"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-gray-600"></div>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="py-24 px-6 bg-black statistics-section">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 bg-gray-900 rounded-full mb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-300 font-medium">
              System Impact
            </p>
          </div>
          <h2 className="text-4xl font-light text-gray-100 mb-6">
            Measurable Government Efficiency
          </h2>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          {[
            {
              value: "70%",
              label: "Faster Processing",
              desc: "Reduced application processing time",
            },
            {
              value: "90%",
              label: "Error Reduction",
              desc: "Decrease in manual processing errors",
            },
            {
              value: "100%",
              label: "Transparency",
              desc: "Complete audit trail maintained",
            },
            {
              value: "24/7",
              label: "Availability",
              desc: "Round-the-clock system access",
            },
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 hover:border-gray-600 transition-all duration-300">
                <div className="text-5xl font-light text-white mb-4 group-hover:text-gray-200">
                  {stat.value}
                </div>
                <h3 className="text-lg font-medium text-gray-200 mb-2">
                  {stat.label}
                </h3>
                <p className="text-gray-400 text-sm">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STAKEHOLDERS SECTION */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-black rounded-full mb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-300 font-medium">
              Stakeholders
            </p>
          </div>
          <h2 className="text-4xl font-light text-gray-100 mb-8">
            Comprehensive Governance Ecosystem
          </h2>

          <p className="text-gray-400 text-lg mb-12 leading-relaxed max-w-3xl mx-auto">
            Serving all levels of government infrastructure with a unified
            platform that ensures standardization, fairness, and transparency
            across all processes.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { name: "Government Bodies", count: "500+" },
              { name: "Educational Institutes", count: "10K+" },
              { name: "Review Committees", count: "2K+" },
              { name: "Audit Authorities", count: "200+" },
            ].map((org, index) => (
              <div
                key={index}
                className="bg-black rounded-lg p-6 border border-gray-800"
              >
                <div className="text-2xl font-light text-white mb-2">
                  {org.count}
                </div>
                <div className="text-sm text-gray-400">{org.name}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-center flex-wrap gap-4">
            {[
              "Government Departments",
              "Educational Institutions",
              "NGOs & Trusts",
              "Review Committees",
              "Audit Teams",
              "Applicants",
            ].map((tag, index) => (
              <span
                key={index}
                className="bg-black text-white px-6 py-3 rounded-full text-sm border border-gray-800 hover:border-gray-600 transition-all duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-6 bg-black border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-light text-gray-100 mb-8">
            Ready to Transform Government Processes?
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            Join the digital transformation initiative for transparent,
            efficient, and automated government operations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/signup"
              className="bg-white text-black py-4 px-12 rounded-sm text-base font-medium hover:bg-gray-100 transition-all duration-300 border border-white"
            >
              Get Started Now
            </Link>
            <Link
              to="/demo"
              className="bg-transparent text-white py-4 px-12 rounded-sm text-base font-medium border border-gray-600 hover:border-white transition-all duration-300"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-full"></div>
                <span className="text-lg font-medium">GovAI Platform</span>
              </div>
              <p className="text-gray-400 text-sm">
                Advanced AI Automation for Government Excellence
              </p>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Access
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} National AI Automation
                Platform • Developed under Smart India Hackathon
              </div>
              <div className="text-gray-500 text-sm">
                AICTE & UGC Approved System
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
