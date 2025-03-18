"use client";
import { signup } from "@/action/auth";
import AuthInput from "@/components/Auth/AuthInput";
import ProfilePhotoSelector from "@/components/Auth/ProfilePhotoSelector";
import Loading from "@/components/Loading";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import toast from "react-hot-toast";

const Signup = () => {
  const [profilePic, setProfilePic] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });
  const router = useRouter();
  const [state, action, pending] = useActionState(signup, undefined);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleProfileImageChange = (file) => {
    setFormData((prev) => ({ ...prev, profileImage: file }));
  };

  if (state?.success) {
    toast.success(state?.message);
    setFormData({
      fullname: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      profileImage: null,
    });
    router.push("/login");
  }

  return (
    <div className="bg-white p-4 rounded-md">
      <h2 className="text-2xl mb-3 font-semibold p-2 rounded text-center">
        Create an Account
      </h2>
      <p className="text-sm text-slate-700 font-semibold mt-[5px] mb-6 text-center">
        Join us today by entering your details below
      </p>
      <form action={() => action(formData)}>
        <ProfilePhotoSelector
          profileImage={state?.errors?.profileImage}
          image={profilePic}
          setImage={handleProfileImageChange}
        />

        <AuthInput
          label="Full Name"
          type="text"
          name="fullname"
          placeholder="Jon Doe"
          value={formData.fullname}
          onChange={handleChange}
        />
        {state?.errors?.fullname && (
          <p className="text-xs text-red-600">{state.errors.fullname}</p>
        )}
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
          label="Username"
          type="text"
          name="username"
          placeholder="@abc"
          value={formData.username}
          onChange={handleChange}
        />
        {state?.errors?.username && (
          <p className="text-xs text-red-600">{state.errors.username}</p>
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
        <AuthInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Re-enter password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {state?.errors?.confirmPassword && (
          <p className="text-xs text-red-600">{state.errors.confirmPassword}</p>
        )}
        <button
          type="submit"
          className="bg-primary w-full text-white rounded-md px-7 py-2 mb-3 mt-2 cursor-pointer"
          disabled={pending}
        >
          {pending ? <Loading text="Creating Account ..." /> : "Create Account"}
        </button>
        <div className="flex items-center mb-3 gap-3 justify-center">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 underline">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
