"use client";

import { updateProfileImage } from "@/action/auth";
import Image from "next/image";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const ProfilePhoto = ({ profileImage, user }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(profileImage);
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const changeImage = async () => {
    if (!image || !user?.user?.email) {
      toast.error("Something went wrong");
      return;
    }

    try {
      const response = await updateProfileImage(user.user.email, image);

      if (response.success) {
        setPreviewUrl(response.profileImageUrl);
        toast.success("Profile image updated successfully!");
      } else {
        toast.error(response.errors || "Image update failed");
      }
    } catch (error) {
      toast.error("Image update failed");
    }
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

      <div className="relative">
        <Image
          width={300}
          height={300}
          src={previewUrl}
          alt="profile photo"
          className="w-30 h-30 rounded-full border-2 p-1 border-primary"
        />
      </div>

      <div className="flex gap-3 mt-2">
        <button onClick={onChooseFile} className="btn-small p-2">
          Change Your Photo
        </button>
        {profileImage !== previewUrl && (
          <button onClick={changeImage} className="btn-small">
            Update
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePhoto;
