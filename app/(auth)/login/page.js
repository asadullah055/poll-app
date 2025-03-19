"use client";
import { login } from "@/action/auth";
import AuthInput from "@/components/Auth/AuthInput";
import Loading from "@/components/Loading";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [state, action, pending] = useActionState(login, undefined);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  useEffect(() => {
    if (state?.success) {
      toast.success(state?.message);
      router.push("/");
      router.refresh();
      setFormData({
        email: "",
        password: "",
        remember: false,
      });
    } else if (state?.errors?.auth) {
      toast.error(state.errors.auth);
    } else if (state?.errors?.server) {
      toast.error(state.errors.server);
    }
  }, [state, router]);
  useEffect(() => {
    router.prefetch("/");
  }, [router]);
  return (
    <div className="bg-white p-4 rounded-md">
      <h2 className="text-2xl mb-3 font-semibold p-2 rounded text-center">
        Welcome Back
      </h2>
      <p className="text-sm text-slate-700 font-semibold mt-[5px] mb-6 text-center">
        Please enter your email and password to log in
      </p>
      <form
        action={() =>
          action({
            ...formData,
            remember: formData.remember || false,
          })
        }
      >
        <AuthInput
          label="Email"
          type="email"
          name="email"
          placeholder="abc@gmail.com"
          value={formData.email}
          onChange={handleChange}
        />
        {state?.errors?.email && (
          <p className="text-xs text-red-600">{state.errors.email}</p>
        )}
        <AuthInput
          label="Password"
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
        />
        {state?.errors?.password && (
          <p className="text-xs text-red-600">{state.errors.password}</p>
        )}
        <div className="flex justify-end items-center pb-3">
          <Link href="/forget-password" className="text-blue-600">
            Forgot Password
          </Link>
        </div>

        <button
          type="submit"
          className="bg-primary w-full text-white rounded-md px-7 py-2 mb-3 cursor-pointer"
          disabled={pending}
        >
          {pending ? <Loading text="Login ..." /> : "Login"}
        </button>
        <div className="flex items-center mb-3 gap-3 justify-center">
          <p>
            Already have an no account ?{" "}
            <Link href="/signup" className="text-blue-600 underline">
              Signup here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
