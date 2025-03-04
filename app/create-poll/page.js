'use client'
import OptionImageSelector from "@/components/input/OptionImageSelector";
import OptionInput from "@/components/input/OptionInput";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { POLL_TYPE } from "@/lib/data";
import { useState } from "react";

const CreatePollPage = () => {
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
      const updateImageAndGetLink = async (imageOptions) => {
        const optionsPromises = imageOptions.map(async (imageOption) => {
          try {
            const imageUploadsRes = await uploadImage(imageOption.file);
    
            return imageUploadsRes.imageUrl || "";
          } catch (error) {
            toast.error(`Error uploading image: ${imageOption.file.name}`);
            return "";
          }
        });
        const optionArr = await Promise.all(optionsPromises);
        return optionArr;
      };
    
      const getOptions = async () => {
        switch (pollData.type) {
          case "single-choice":
            return pollData.options;
          case "image-based":
            const options = await updateImageAndGetLink(pollData.imageOption);
            return options;
          default:
            return [];
        }
      };
      const handleCreatePoll = async () => {
        const { question, type, options, error } = pollData;
        if (!question || !type) {
          console.log("CREATE", { question, type, options, error });
          handleValueChange("error", "Question and type are required");
          return;
        }
        if (type === "single-choice" && options.length < 2) {
          handleValueChange("error", "Enter at two option");
          return;
        }
        if (type === "image-based" && pollData.imageOption.length < 2) {
          handleValueChange("error", "Enter at least two image options");
          return;
        }
        handleValueChange("error", "");
        
        const optionData = await getOptions();
        try {
          const response = await axiosInstance.post(API_PATHS.POLLS.CREATE, {
            question,
            type,
            options: optionData,
            creatorId: user._id,
          });
          if (response) {
            toast.success("Poll create successfully");
            onPollCreateOrDelete();
            clearData();
          }
        } catch (error) {
          if (error.response && error.response.data.message) {
            toast.error(error.response.data.message);
            handleValueChange("error", error.response.data.message);
          } else {
            handleValueChange("error", "Something went wrong. Please try again");
          }
        }
      };
    return (
        <DashboardLayout >
        <div className="bg-gray-100/50 my-5 p-5 rounded-lg mx-auto">
          <h2 className="text-lg text-black font-medium">Create Poll</h2>
          <div className="mt-3">
            <label className="text-xs font-medium text-slate-600">QUESTION</label>
            <textarea
              className="w-full text-[13px] text-black outline-none bg-slate-200/80 p-2 rounded-md"
              rows={4}
              placeholder="what's in your mind"
              value={pollData.question}
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
          <button className="btn-primary py-2 mt-6" onClick={handleCreatePoll}>
            CREATE
          </button>
        </div>
      </DashboardLayout>
    );
};

export default CreatePollPage;