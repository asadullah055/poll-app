"use server";
import cloudinary from "@/lib/cloudinary";

export async function uploadImages(formData) {
 console.log(formData);
 

  if (!formData || formData.length === 0) {
    return { success: false, error: "No images selected" };
  }

  try {
    const uploadPromises = formData.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = buffer.toString("base64");
      const dataUri = `data:${file.type};base64,${base64Image}`;

      const uploadedImage = await cloudinary.uploader.upload(dataUri, {
        folder: "poll_app",
      });

      return uploadedImage.secure_url;
    });

    const uploadedUrls = await Promise.all(uploadPromises);

    return { success: true, urls: uploadedUrls };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
