"use client";
import { resetPassword } from "@/action/auth";
import PasswordInput from "@/components/input/PasswordInput";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [data, setData] = useState({
    newPassword: "",
    confirmPassword: "",
    email: "",
  });

  const router = useRouter();
  const [state, action, pending] = useActionState(resetPassword, undefined);

  // Fetch sessionStorage value on the client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setData((prev) => ({ ...prev, email: sessionStorage.getItem("email") || "" }));
    }
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.message);
      sessionStorage.removeItem("email");
      setData({
        newPassword: "",
        confirmPassword: "",
        email: "",
      });
      router.push("/login");
    } else if (state.message) {
      toast.error(state.message);
    } else {
      toast.error("Internal server error");
    }
  }, [state, router]);

  return (
    <>
      <h2 className="text-lg font-medium text-primary">Reset your password?</h2>
      <form action={() => action(data)}>
        <PasswordInput
          label="New Password"
          name="newPassword"
          placeholder="Your new password"
          value={data.newPassword}
          onChange={handleChange}
        />
        {state?.errors?.newPassword && (
          <p className="text-xs text-red-600">{state.errors.newPassword}</p>
        )}
        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Your confirm password"
          value={data.confirmPassword}
          onChange={handleChange}
        />
        {state?.errors?.confirmPassword && (
          <p className="text-xs text-red-600">{state.errors.confirmPassword}</p>
        )}
        <button
          type="submit"
          className="btn-small text-center block p-3 text-[16px] w-full mt-3"
          disabled={pending}
        >
          {pending ? <Loading text="Processing" /> : "Submit"}
        </button>
      </form>
    </>
  );
};

export default ResetPassword;
