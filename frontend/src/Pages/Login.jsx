import React, { useState } from "react";
import { Lock, Shield, Brain, Eye, EyeOff, LogIn } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from "react-router-dom";



const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    try{
      const response = await axios.post('http://localhost:3000/api/auth/login', formData, { withCredentials: true });
      console.log('Server response:', response.data);
      if(response.status === 200){
        localStorage.setItem("edu-relational-automation-platform", "true");
        localStorage.setItem('userRole', response.data.role);
        toast.success(`🎊 Welcome back! ${response.data.message}`, {
          position: 'bottom-right',
          autoClose: 1500,
          onClose: () => { window.location.href = '/'; }
        })
      }
      else{
        toast.error(`Login failed! ${response.data.message}`, {
          position: 'bottom-right',
          autoClose: 2000,
        })
      }
      // Further actions on successful login
    }catch(err){
      console.log(err);
    }
  };
  
  const features = [
    {
      icon: Shield,
      title: "Blockchain Verified",
      description: "Immutable record keeping"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Smart analytics & predictions"
    },
    {
      icon: Lock, 
      title: "Military-Grade Security",
      description: "End-to-end encryption"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Left Section - Hero */}
      <div className="lg:flex-1 relative overflow-hidden hidden md:flex">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/80 z-10" />
        <img
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2ZmaWNlJTIwc2V0dGluZ3N8ZW58MHx8MHx8fDA%3D&w=1000&q=80"
          alt="Modern office workspace"
          className="w-full h-full object-cover"
        />
        
        {/* Header */}
        <div className="absolute top-8 left-8 z-20 flex items-center space-x-3">
          <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-bold tracking-tight">NextStep</h1>
            <p className="text-sm text-white/80">AI-Powered Institutional Analysis</p>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 z-20 flex items-center justify-center px-8">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold leading-tight">
              AI-Based Analysis & Performance Indicators
            </h1>
            <h3 className="text-xl text-white/90 mb-12 font-light">
              For Institutional Approval (UGC & AICTE)
            </h3>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <feature.icon className="h-8 w-8 text-white mx-auto mb-3" />
                  <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-sm text-white/80">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="lg:flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg mb-4">
                <Lock className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Secure Login
              </h1>
              <p className="text-gray-600">
                Institution Approval & Review System
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="string"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end text-sm -mt-2">
                <button className="text-blue-600 hover:text-blue-800">forget password</button>
              </div>

              <button
                type="button"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2"
                onClick={() => {
                   localStorage.setItem("userRole", "institution");
                   navigate("/dashboard");
                   }}
              >
                <LogIn className="h-5 w-5" />
                <span>Login to Dashboard</span>
              </button>
            </form>
            <ToastContainer />

            {/* Security Note */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-2 text-blue-700">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Government-grade security with 2FA</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <h3 className="font-semibold text-gray-900 mb-1">
                Developed by Code for Change (CFC)
              </h3>
              <p className="text-sm text-gray-600">
                Smart India Hackathon 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;