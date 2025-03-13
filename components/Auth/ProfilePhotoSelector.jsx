"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { LuTrash, LuUpload, LuUser } from "react-icons/lu";

const ProfilePhotoSelector = ({ profileImage, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Send the file directly to the parent
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };
  return (
    <div className="flex flex-col items-center justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        name="profileImage"
        onChange={handleImageChange}
        className="hidden"
      />

      {!previewUrl ? (
        <div className="w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full relative">
          <LuUser className="text-4xl text-primary" />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full absolute -bottom-1 -right-1"
            onClick={onChooseFile}
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Image
            width={200}
            height={200}
            src={previewUrl}
            alt="profile photo"
            className="w-20 h-20 rounded-full object-cover"
          />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
      {profileImage && (
        <p className="text-xs text-red-600 mt-4">{profileImage}</p>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
