"use client";
import { sendOtp } from "@/action/auth";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleOtp = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      const res = await sendOtp(email);
      if (res?.success) {
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("expireTime", res.expireTime);
        toast.success(res.message);
        router.push("/verify");
      } 
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <h2 className="text-lg font-medium text-primary">
        Forgot your password?
      </h2>
      <p className="text-[13px] font-medium text-slate-600 mt-3 mb-3">
        Please enter the account for which you want to reset the password.
      </p>
      <div className="flex gap-3 flex-col">
        <label className="text-sm font-medium" htmlFor="email">
          Please Enter Email
        </label>
        <input
          id="email"
          className="border-2 border-gray-200 focus:outline-0 p-2 rounded"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <button
          onClick={handleOtp}
          className="btn-small text-center block p-3 text-[16px] disabled:opacity-50"
          disabled={loading}
        >
          {loading ? <Loading text="Sending OTP..." /> : "Submit"}
        </button>
      </div>
    </>
  );
};

export default ForgotPassword;
