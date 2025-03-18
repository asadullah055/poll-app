"use client";
import { updatePassword } from "@/action/auth";
import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";
import PasswordInput from "../input/PasswordInput";
import Loading from "../Loading";

const ChangePassword = ({ user }) => {
  const [formData, setFormData] = useState({
    confirmPassword: "",
    oldPassword: "",
    newPassword: "",
    email: user.user.email,
  });
  const [state, action, pending] = useActionState(updatePassword, undefined);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (state?.success) {
      toast.success(state?.message);
      setFormData({
        confirmPassword: "",
        oldPassword: "",
        newPassword: "",
        email: user.user.email,
      });
    } else if (state?.errors?.auth) {
      toast.error(state.errors.auth);
    } else if (state?.errors?.server) {
      toast.error(state.errors.server);
    }
  }, [state]);
  return (
    <div className="bg-slate-50 rounded border-gray-200 border p-3 shadow-rounded">
      <form action={() => action(formData)}>
        <PasswordInput
          label="Old Password"
          name="oldPassword"
          value={formData.oldPassword}
          placeholder="Your old password"
          onChange={handleChange}
        />
        {state?.errors?.oldPassword && (
          <p className="text-xs text-red-600">{state.errors.oldPassword}</p>
        )}
        <PasswordInput
          label="New Password"
          name="newPassword"
          placeholder="Your new password"
          value={formData.newPassword}
          onChange={handleChange}
        />
        {state?.errors?.newPassword && (
          <p className="text-xs text-red-600">{state.errors.newPassword}</p>
        )}
        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Your confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {state?.errors?.confirmPassword && (
          <p className="text-xs text-red-600">{state.errors.confirmPassword}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="btn-small p-3 w-full text-center block text-sm mt-5"
        >
          {pending ? (
            <Loading text="Updating Password ..." />
          ) : (
            "Change Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
