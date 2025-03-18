"use client";

import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ label, name, placeholder, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col w-full gap-1 mb-3 mt-3 input-box">
      <label htmlFor={name}>{label}</label>
      <div className="bg-slate-100 w-full flex items-center px-3 mt-1 py-2 rounded-md gap-2 border border-gray-300">
        <input
          className="focus:outline-none bg-transparent w-full"
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          id={name}
          value={value}
          onChange={onChange}
        />
        {showPassword ? (
          <FaRegEye
            size={22}
            className="text-primary cursor-pointer"
            onClick={() => setShowPassword(false)}
          />
        ) : (
          <FaRegEyeSlash
            size={22}
            className="text-slate-400 cursor-pointer"
            onClick={() => setShowPassword(true)}
          />
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
