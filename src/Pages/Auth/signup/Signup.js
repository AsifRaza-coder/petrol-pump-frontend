import React, { useState } from "react";
import Alert from "../../../Components/alert/Alert";
import SignupForm from "./SignupForm";

const SignUp = () => {
  //The use State hook and state used for holding values of textfield which includes
  const [state, setState] = useState({
    name: "",
    username: "",
    companyName: "",
    access: "web_admin",
    email: "",
    contact: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Alert />
      
      {/* Left Column: Signup Form */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 bg-white p-4 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Company Logo */}
          <div className="text-center mb-6">
            <img
              src="./img/logo1.png"
              className="w-16 h-16 mx-auto mb-6"
              alt="logo"
            />
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-center text-gray-600 mb-8 text-sm">
            Sign up to start managing your fuel station operations efficiently.
          </p>

          <SignupForm state={state} setState={setState} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an Account?{" "}
              <a href="/" className="text-[#1a4d4d] font-semibold hover:underline">
                Sign In
              </a>
            </p>
          </div>

          {/* Copyright */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Copyright © SaimonSoft {new Date().getFullYear()}
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

export default SignUp;
