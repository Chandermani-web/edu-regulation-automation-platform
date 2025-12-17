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

    // Animate feature cards
    gsap.from(".feature-card", {
      scrollTrigger: {
        trigger: ".feature-card",
        start: "top 80%",
      },
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power2.out",
    });

    // Animate statistics
    gsap.from(".statistics-section .group", {
      scrollTrigger: {
        trigger: ".statistics-section",
        start: "top 80%",
      },
      scale: 0.8,
      opacity: 0,
      stagger: 0.15,
      duration: 0.6,
      ease: "back.out(1.7)",
    });
  }, []);

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      {/* HERO SECTION */}
      <header className="py-32 px-6 text-center bg-linear-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Government Seal/Emblem */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 opacity-90 z-0">
          <div className="w-32 h-32 border-4 border-blue-600 rounded-full flex items-center justify-center bg-white shadow-xl">
            <div className="text-center">
              <div className="text-xs font-bold text-blue-600 tracking-wider">GOVERNMENT</div>
              <div className="text-xs text-blue-600 font-semibold">OF INDIA</div>
            </div>
          </div>
        </div>

        {/* Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-5 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: "url('/indian-government-building-with-flags-clear-day-generative-ai_437323-24135.avif')"
          }}
        ></div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-center items-center gap-6 mb-8">
              <div className="rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <img
                  src="/Generated Image November 30, 2025 - 3_11PM.png"
                  alt="AICTE Logo"
                  className="h-16 w-auto object-contain rounded-2xl"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'h-16 w-20 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm';
                    fallback.textContent = 'AICTE';
                    e.target.parentElement.appendChild(fallback);
                  }}
                />
              </div>
              <div className="h-16 w-px bg-gray-400"></div>
              <div className="rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <img
                  src="/Generated Image November 30, 2025 - 3_11PM (1).png"
                  alt="UGC Logo"
                  className="h-16 w-auto object-contain rounded-2xl"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'h-16 w-20 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-sm';
                    fallback.textContent = 'UGC';
                    e.target.parentElement.appendChild(fallback);
                  }}
                />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight max-w-5xl mx-auto leading-tight mb-6 text-gray-900">
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

          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mt-8 mb-12 leading-relaxed font-normal">
            A Unified Digital Framework for Automated Application Evaluation,
            AI-Driven Validation, and Complete Process Transparency
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <Link
              to="/login"
              className="bg-blue-600 text-white py-4 px-8 rounded-lg text-base font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300"
            >
              Register Institution
            </Link>
            <Link
              to="/login"
              className="bg-white text-blue-600 py-4 px-8 rounded-lg text-base font-medium border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              Official Login
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Secure & Encrypted
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Government Certified
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              AI Powered
            </div>
          </div>
        </div>
      </header>

      {/* KEY OBJECTIVES / FEATURES */}
      <section className="py-24 px-6 max-w-7xl mx-auto feature-card bg-white">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 bg-blue-50 rounded-full mb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-medium">
              Platform Capabilities
            </p>
          </div>
          <h2 className="text-4xl font-semibold text-gray-900 mb-6">
            Advanced AI Automation Framework
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
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
              fallback: "📄",
              color: "blue"
            },
            {
              icon: "/Generated Image November 30, 2025 - 3_20PM.png",
              title: "Intelligent Risk Analysis",
              desc: "Real-time fraud detection and inconsistency identification using predictive analytics",
              stats: "Real-time Analysis",
              fallback: "🔍",
              color: "indigo"
            },
            {
              icon: "/Generated Image November 30, 2025 - 3_21PM (1).png",
              title: "Centralized Dashboard",
              desc: "Comprehensive monitoring system with real-time tracking of all application stages",
              stats: "Live Monitoring",
              fallback: "📊",
              color: "purple"
            },
            {
              icon: "/Generated Image November 30, 2025 - 3_21PM.png",
              title: "Transparency Engine",
              desc: "Automated audit trails and RTI-compliant report generation for complete accountability",
              stats: "100% Audit Ready",
              fallback: "🔒",
              color: "green"
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
            >
              <div className="flex flex-col h-full">
                <div className="mb-6 mx-auto w-24 h-24 flex items-center justify-center bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors duration-300">
                  <img
                    src={feature.icon}
                    className="w-20 h-20 object-contain group-hover:scale-110 transition-all duration-300"
                    alt={feature.title}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'text-4xl';
                      fallback.textContent = feature.fallback;
                      e.target.parentElement.appendChild(fallback);
                    }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed grow mb-4">
                  {feature.desc}
                </p>
                <div className="pt-4 border-t border-gray-200">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {feature.stats}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WORKFLOW SECTION */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-blue-50 rounded-full mb-6">
              <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-medium">
                Process Flow
              </p>
            </div>
            <h2 className="text-4xl font-semibold text-gray-900 mb-6">
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
                  <div className="shrink-0 w-12 h-12 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <span className="font-mono text-sm font-bold text-blue-600 group-hover:text-white">
                      {item.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-8 shadow-lg">
                <img
                  src="/Generated Image November 30, 2025 - 3_27PM.png"
                  className="w-full h-auto rounded"
                  alt="Government Workflow Process"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-blue-600"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="py-24 px-6 bg-white statistics-section">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 bg-blue-50 rounded-full mb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-medium">
              System Impact
            </p>
          </div>
          <h2 className="text-4xl font-semibold text-gray-900 mb-6">
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
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg p-8 border-2 border-blue-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
                <div className="text-5xl font-bold text-blue-600 mb-4 group-hover:text-blue-700">
                  {stat.value}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {stat.label}
                </h3>
                <p className="text-gray-600 text-sm">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STAKEHOLDERS SECTION */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-blue-50 rounded-full mb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-medium">
              Stakeholders
            </p>
          </div>
          <h2 className="text-4xl font-semibold text-gray-900 mb-8">
            Comprehensive Governance Ecosystem
          </h2>

          <p className="text-gray-600 text-lg mb-12 leading-relaxed max-w-3xl mx-auto">
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
                className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {org.count}
                </div>
                <div className="text-sm text-gray-700">{org.name}</div>
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
                className="bg-white text-gray-700 px-6 py-3 rounded-full text-sm border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-6 bg-linear-to-br from-blue-600 to-indigo-700 border-t border-blue-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-white mb-8">
            Ready to Transform Government Processes?
          </h2>
          <p className="text-blue-100 text-lg mb-12 max-w-2xl mx-auto">
            Join the digital transformation initiative for transparent,
            efficient, and automated government operations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/signup"
              className="bg-white text-blue-600 py-4 px-12 rounded-lg text-base font-medium hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started Now
            </Link>
            <Link
              to="/demo"
              className="bg-transparent text-white py-4 px-12 rounded-lg text-base font-medium border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 border-t border-gray-700 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-lg font-semibold text-white">GovAI Platform</span>
              </div>
              <p className="text-gray-300 text-sm">
                Advanced AI Automation for Government Excellence
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    API Access
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-700 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-300 text-sm">
                &copy; {new Date().getFullYear()} National AI Automation
                Platform • Developed under Smart India Hackathon
              </div>
              <div className="text-gray-400 text-sm">
                AICTE & UGC Approved System
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
