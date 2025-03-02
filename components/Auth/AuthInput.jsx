"use client";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
const AuthInput = ({ label, type, name, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex flex-col w-full gap-1 mb-3 mt-3 input-box">
      <label htmlFor={label}>{label}</label>
      <div className="bg-slate-100 w-full flex items-center px-3 mt-1 py-2 rounded-md gap-2 border border-gray-300">
        <input
          className="focus:outline-none  bg-transparent  w-full"
          type={
            type === "password" ? (showPassword ? "text" : "password") : "text"
          }
          name={name}
          placeholder={placeholder}
          id={label}
        />
        {type === "password" && (
          <>
            {showPassword ? (
              <FaRegEye
                size={22}
                className="text-blue-500 cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            ) : (
              <FaRegEyeSlash
                size={22}
                className="text-slate-400 cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
