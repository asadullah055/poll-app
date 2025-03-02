import AuthInput from "@/components/Auth/AuthInput";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="bg-white p-4 rounded-md">
      <h2 className="text-2xl mb-3 font-semibold p-2 rounded text-center">
        Welcome Back
      </h2>
      <p className="text-sm text-slate-700 font-semibold mt-[5px] mb-6 text-center">
        Please enter your email and password to log in
      </p>
      <form>
        <AuthInput
          label="Email"
          type="email"
          name="email"
          placeholder="abc@gmail.com"
        />

        <AuthInput
          label="Password"
          type="password"
          name="password"
          placeholder="Enter password"
        />

        <div className="flex justify-between items-center">
          <div className="flex  gap-2 mb-3 items-center mt-3 ">
            <input
              className="px-3 py-2 outline-none border border-gray-700 bg-transparent rounded-md  focus:border-gray-500 overflow-hidden w-4 h-4"
              type="checkbox"
              name="remember"
              id="remember"
            />
            <label htmlFor="remember">Remember me</label>
          </div>
          <Link href="/forget-password" className="text-blue-600">
            Forgot Password
          </Link>
        </div>

        <button
          type="submit"
          className="bg-blue-500 w-full text-white rounded-md px-7 py-2 mb-3 cursor-pointer"
        >
          Login
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
