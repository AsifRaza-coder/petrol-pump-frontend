import React, { useContext } from "react";
import AuthContext from "../../../context/auth/AuthContext";
import PhoneInput from 'react-phone-input-2'
import { toast } from "react-toastify";

//This is a makeStyles function used for making custom styles
//in this use Style "form" object is used to styling form JSX element
// Submit object is used to styling the submit button in the form

const SignupForm = ({ state, setState }) => {
  //Initialization of Auth Context and Alert Context
  const { register } = useContext(AuthContext);

  //Destructing of textfield values from state used with the name of values
  const { name, username, email, companyName, address, password, confirmPassword } = state;

  //On change function will execute on changing the value in Text Field
  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  //On Submit function first checks that all fields must not be empty
  //password and confirm password must match
  //the it passes values to the register function

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast("Passwords don't match", {position: "top-right", type: "error"});
    } else if(email === "") {
      toast("Please enter valid email", {position: "top-right", type: "error"})
    } else {
      const newState = {...state}
      register(newState)
    }
  };

  return (
    <form className="signupForm w-full space-y-4" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="sm:col-span-1">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            id="Name"
            required
            autoFocus
            onChange={onChange}
            value={name}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d4d] focus:border-[#1a4d4d] transition-all duration-200 text-gray-900 bg-white placeholder:text-gray-400"
            placeholder="Enter your full name"
          />
        </div>

        {/* Username */}
        <div className="sm:col-span-1">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="username"
            id="Username"
            required
            autoComplete="username"
            onChange={onChange}
            value={username}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d4d] focus:border-[#1a4d4d] transition-all duration-200 text-gray-900 bg-white placeholder:text-gray-400"
            placeholder="Enter your username"
          />
        </div>

        {/* Email */}
        <div className="sm:col-span-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="Email"
            required
            autoComplete="email"
            onChange={onChange}
            value={email}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d4d] focus:border-[#1a4d4d] transition-all duration-200 text-gray-900 bg-white placeholder:text-gray-400"
            placeholder="Enter your email"
          />
        </div>

        {/* Contact */}
        <div className="sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Number <span className="text-red-500">*</span>
          </label>
          <div className="phone-input-wrapper">
            <PhoneInput
              country={'pk'}
              masks={{pk: '...-.......'}}
              placeholder="+92 300-1234567"
              value={state.contact || ""}
              onChange={contact => setState({...state, contact })}
              inputClass="phone-input-field"
              buttonClass="phone-input-button"
              containerClass="phone-input-container"
            />
          </div>
        </div>
      </div>

      {/* Tenant/Organization Name */}
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
          Tenant / Organization Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="companyName"
          id="companyName"
          required
          onChange={onChange}
          value={companyName}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d4d] focus:border-[#1a4d4d] transition-all duration-200 text-gray-900 bg-white placeholder:text-gray-400"
          placeholder="Enter organization name"
        />
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address"
          id="address"
          required
          onChange={onChange}
          value={address}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d4d] focus:border-[#1a4d4d] transition-all duration-200 text-gray-900 bg-white placeholder:text-gray-400"
          placeholder="Enter your address"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            id="Password"
            required
            autoComplete="new-password"
            onChange={onChange}
            value={password}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d4d] focus:border-[#1a4d4d] transition-all duration-200 text-gray-900 bg-white placeholder:text-gray-400"
            placeholder="Enter your password"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="ConfirmPassword"
            required
            autoComplete="new-password"
            onChange={onChange}
            value={confirmPassword}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d4d] focus:border-[#1a4d4d] transition-all duration-200 text-gray-900 bg-white placeholder:text-gray-400"
            placeholder="Confirm your password"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-[#1a4d4d] hover:bg-[#155050] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1a4d4d] focus:ring-offset-2 active:bg-[#0f3a3a] mt-5"
      >
        Sign Up
      </button>
    </form>
  );
};
export default SignupForm;
