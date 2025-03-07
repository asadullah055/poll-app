"use client";
import { createPoll } from "@/action/polls";
import OptionImageSelector from "@/components/input/OptionImageSelector";
import OptionInput from "@/components/input/OptionInput";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { POLL_TYPE } from "@/lib/data";
import { useActionState, useState } from "react";

const CreatePollPage = () => {
  const [state, action, pending] = useActionState(createPoll, undefined);
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

  return (
    <DashboardLayout>
      <form
        className="bg-gray-100/50 my-5 p-5 rounded-lg mx-auto"
        action={()=>action(pollData)}
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
            onChange={({ target }) =>
              handleValueChange("question", target.value)
            }
          ></textarea>
        </div>
        <div className="mt-3">
          <label className="text-xs font-medium text-slate-600">
            POLL TYPE
          </label>
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
          {pollData.type === "single-choice" && (
            <div className="mt-5">
              <label htmlFor="" className="text-xs font-medium text-slate-600">
                OPTIONS
              </label>
              <div className="mt-3">
                <OptionInput
                  optionList={pollData.options}
                  setOptionList={(value) => {
                    handleValueChange("options", value);
                  }}
                />
              </div>
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
            </div>
          )}
        </div>
        {pollData.error && (
          <p className="text-xs font-medium text-red-500 mt-5">
            {pollData.error}
          </p>
        )}
        <button type="submit" className="btn-primary py-2 mt-6">CREATE</button>
      </form>
    </DashboardLayout>
  );
};

export default CreatePollPage;
