import React, { useContext } from "react";
import Alert from "../../../Components/alert/Alert";
import ModeContext from "../../../context/mode/ModeContext";
import LoginForm from "./LoginForm";

const Login = () => {
  const { darkMode } = useContext(ModeContext);
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Alert />
      
      {/* Left Column: Login Form */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 bg-white p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Company Logo */}
          <div className="text-center mb-6">
            <img
              src={`${darkMode === "dark" ? "./img/logo1.png" : "./img/logo1.png"}`}
              className="w-16 h-16 mx-auto mb-6"
              alt="logo"
            />
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Welcome Back!
          </h1>
          <p className="text-center text-gray-600 mb-8 text-sm">
            Sign in to access your dashboard and manage your fuel station operations efficiently.
          </p>

          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an Account?{" "}
              <a href="/signup" className="text-[#1a4d4d] font-semibold hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Promotional Content */}
      <div 
        className="hidden lg:flex flex-col items-center justify-center w-1/2 text-white p-8 relative overflow-hidden"
        style={{
          backgroundImage: 'url(https://res.cloudinary.com/djlpb1ld5/image/upload/v1761950016/shutterstock_1838506285-2-750x430_ubtpk2.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Green Overlay */}
        <div className="absolute inset-0 bg-[#1a4d4d]/85"></div>
        
        <div className="max-w-md text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Manage Your Fuel Station with Smart Technology
          </h2>
          
          <blockquote className="text-xl italic mb-8 text-gray-100">
            &ldquo;Mudasar Filling Station has revolutionized our fuel management system. It's efficient, accurate, and helps us serve our customers better every day.&rdquo;
          </blockquote>
          
          <div className="mb-12">
            <p className="font-semibold text-lg mb-1">Ahmed Khan</p>
            <p className="text-sm text-gray-300">Station Manager at Mudasar Filling Station</p>
          </div>

          <div className="mt-12">
            <p className="text-sm uppercase tracking-wider mb-6 text-gray-300">Trusted by 500+ Stations</p>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
