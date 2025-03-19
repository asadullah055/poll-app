"use client";
import { createPoll } from "@/action/polls";
import OptionImageSelector from "@/components/input/OptionImageSelector";
import OptionInput from "@/components/input/OptionInput";
import Loading from "@/components/Loading";
import { POLL_TYPE } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";

const PollForm = () => {
  const [state, action, pending] = useActionState(createPoll, undefined);

  const router = useRouter();
  const [pollData, setPollData] = useState({
    question: "",
    type: "",
    options: [],
    imageOption: [],
    error: "",
  });
  const handleValueChange = (key, value) => {
    setPollData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const clearData = () => {
    setPollData({
      question: "",
      type: "",
      options: [],
      imageOption: [],
      error: "",
    });
  };
  useEffect(() => {
    if (state?.error?.user) {
      toast.error(state.error.user);
      router.push("/login");
    } else if (state?.error?.default) {
      toast.error(state.error.default);
    } else if (state?.message) {
      toast.success(state?.message);
      clearData();
    }
  }, [state, router]);
  return (
    <form
      className="bg-gray-100/50 my-5 p-5 rounded-lg mx-auto"
      action={() => action(pollData)}
    >
      <h2 className="text-lg text-black font-medium">Create Poll</h2>
      <div className="mt-3">
        <label className="text-xs font-medium text-slate-600">QUESTION</label>
        <textarea
          className="w-full text-[13px] text-black outline-none bg-slate-200/80 p-2 rounded-md"
          rows={4}
          placeholder="what's in your mind"
          value={pollData.question}
          name="question"
          onChange={({ target }) => handleValueChange("question", target.value)}
        ></textarea>
        {state?.error?.question && (
          <p className="text-xs text-red-600">{state.error.question}</p>
        )}
      </div>
      <div className="mt-3">
        <label className="text-xs font-medium text-slate-600">POLL TYPE</label>
        <div className="flex gap-4 flex-wrap mt-3">
          {POLL_TYPE.map((item) => (
            <div
              key={item.id}
              className={`option-chip border-sky-200 hover:border-primary ${
                pollData.type === item.value
                  ? "text-white bg-primary border-primary"
                  : "border-sky-100"
              }`}
              onClick={() => handleValueChange("type", item.value)}
            >
              {item.label}
            </div>
          ))}
        </div>
        {state?.error?.type && (
          <p className="text-xs mt-2 text-red-600">{state.error.type}</p>
        )}
        {pollData.type === "single-choice" && (
          <div className="mt-5">
            <label htmlFor="" className="text-xs font-medium text-slate-600">
              OPTIONS
            </label>
            <p className="text-amber-500 text-xs">
              Warning: If you {"don't"} click on the add option, that option{" "}
              {"won't"} be added.
            </p>
            <div className="mt-3">
              <OptionInput
                optionList={pollData.options}
                setOptionList={(value) => {
                  handleValueChange("options", value);
                }}
              />
            </div>
            {state?.error?.single && (
              <p className="text-xs mt-2 text-red-600">{state.error.single}</p>
            )}
          </div>
        )}
        {pollData.type === "image-based" && (
          <div className="mt-5">
            <label
              htmlFor=""
              className="text-xs font-medium text-slate-600 uppercase"
            >
              Image option
            </label>
            <div className="mt-3">
              <OptionImageSelector
                imageList={pollData.imageOption}
                setImageList={(value) => {
                  handleValueChange("imageOption", value);
                }}
              />
            </div>
            {state?.error?.image && (
              <p className="text-xs mt-2 text-red-600">{state.error.image}</p>
            )}
          </div>
        )}
        {state?.error?.fileSize && (
          <p className="text-xs mt-2 text-red-600">{state.error.fileSize}</p>
        )}
      </div>
      {state?.error?.server && (
        <p className="text-xs font-medium text-red-500 mt-5">
          {state.error.server}
        </p>
      )}
      <button
        disabled={pending}
        type="submit"
        className="btn-primary py-2 mt-6 cursor-pointer"
      >
        {pending ? <Loading text="Creating ..." /> : "Create Poll"}
      </button>
    </form>
  );
};

export default PollForm;
