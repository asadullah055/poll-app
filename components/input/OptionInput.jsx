"use client";
import { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { HiMiniPlus } from "react-icons/hi2";
const OptionInput = ({ optionList, setOptionList }) => {
  const [option, setOption] = useState("");
  const handleAddOption = () => {
    if (option.trim() && optionList.length < 4) {
      setOptionList([...optionList, option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    const updatedArr = optionList.filter((_, idx) => idx !== index);
    setOptionList(updatedArr);
  };

  return (
    <div className="">
      {optionList.map((item, index) => (
        <div
          key={index}
          className="flex justify-between bg-gray-200/80 px-4 py-2 rounded-md mb-3"
        >
          <p className="text-xs font-medium text-black">{item}</p>
          <button onClick={() => handleDeleteOption(index)}>
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}
      {optionList.length < 4 && (
        <div className="flex items-center gap-5 mt-4">
          <input
            type="text"
            placeholder="Enter option"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddOption()}
            className="w-full text-[13px] text-black outline-none bg-gray-200/80 px-3 py-[6px] rounded-md"
          />
          <button
            className="btn-small text-nowrap py-[6x]"
            onClick={handleAddOption}
          >
            <HiMiniPlus className="text-lg" /> Add Option
          </button>
        </div>
      )}
    </div>
  );
};

export default OptionInput;
