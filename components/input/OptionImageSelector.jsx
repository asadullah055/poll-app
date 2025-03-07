"use client";
import { HiOutlineTrash } from "react-icons/hi";
import { HiMiniPlus } from "react-icons/hi2";

const OptionImageSelector = ({ imageList, setImageList }) => {
  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file && imageList.length < 4) {
      setImageList([...imageList, file]);
    }
  };

  const handleDeleteImage = (index) => {
    setImageList(imageList.filter((_, idx) => idx !== index));
  };

  return (
    <div>
      {imageList.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {imageList.map((item, index) => (
            <div key={index} className="bg-gray-600/10 rounded-md relative">
              <img
                src={URL.createObjectURL(item)}
                alt={`selected_${index}`}
                className="w-full h-36 object-contain rounded-md"
              />
              <button
                onClick={() => handleDeleteImage(index)}
                className="text-red-500 bg-gray-100 rounded-full p-2 absolute top-2 right-2"
              >
                <HiOutlineTrash className="text-lg" />
              </button>
            </div>
          ))}
        </div>
      )}
      {imageList.length < 4 && (
        <div className="flex items-center gap-5">
          <input
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            onChange={handleAddImage}
            className="hidden"
            id="imageInput"
          />
          <label
            htmlFor="imageInput"
            className="btn-small text-nowrap py-1 cursor-pointer"
          >
            <HiMiniPlus className="text-lg" /> Select Image
          </label>
        </div>
      )}
    </div>
  );
};

export default OptionImageSelector;
