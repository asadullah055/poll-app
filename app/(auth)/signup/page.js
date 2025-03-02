
import AuthInput from "@/components/Auth/AuthInput";
import ProfilePhotoSelector from "@/components/Auth/ProfilePhotoSelector";
import Link from "next/link";

const Signup = () => {
  return (
    <div className="bg-white p-4 rounded-md">
      <h2 className="text-2xl mb-3 font-semibold p-2 rounded text-center">
        Create an Account
      </h2>
      <p className="text-sm text-slate-700 font-semibold mt-[5px] mb-6 text-center">
        join us today by entering your details below
      </p>
      <form >
        <ProfilePhotoSelector/>
        <AuthInput
          label="Full Name"
          type="text"
          name="fullname"
          placeholder="jon dou"
        />
        <AuthInput
          label="Email"
          type="email"
          name="email"
          placeholder="abc@gmail.com"
        />
        <AuthInput
          label="User Name"
          type="text"
          name="username"
          placeholder="@abc"
        />

        <AuthInput
          label="Password"
          type="password"
          name="password"
          placeholder="Enter password"
        />
        <AuthInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Re-enter password"
        />

        <button
          type="submit"
          className="bg-blue-500 w-full text-white rounded-md px-7 py-2 mb-3 cursor-pointer"
        >
          Create Account
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
