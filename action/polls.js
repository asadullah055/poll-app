"use server";
import { getUser } from "@/lib/dal";
import { uploadImages } from "@/lib/upload";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createPoll(state, formData) {
  // Keep for Next.js server actions
  const user = await getUser();

  const question = formData.question;
  const type = formData.type;
  const options = formData.options;
  const files = formData.imageOption;

  if (!question || !type || !user?.id) {
    return { message: "Question, type, and creator ID are required" };
  }

  try {
    let processedOption = [];

    switch (type) {
      case "single-choice":
        if (options.length < 2) {
          return {
            message: "Single-choice poll must have at least two options.",
          };
        }
        processedOption = options.map((opt) => ({ optionText: opt }));
        break;

      case "open-ended":
        processedOption = [];
        break;

      case "rating":
        processedOption = [1, 2, 3, 4, 5].map((value) => ({
          optionText: value.toString(),
        }));
        break;

      case "yes/no":
        processedOption = ["Yes", "No"].map((value) => ({ optionText: value }));
        break;

      case "image-based":
        if (files.length < 2) {
          return { message: "Image-based poll must have at least two images." };
        }
        const { urls } = await uploadImages(files);
        processedOption = urls.map((url) => ({ optionText: url }));
        break;

      default:
        return { message: "Invalid poll type." };
    }

    await prisma.poll.create({
      data: {
        question,
        type,
        options: processedOption,
        creator: { connect: { id: user.id } },
      },
    });

    return { success: true, message: "Poll created successfully!" };
  } catch (err) {
    console.error(err);
    return { message: "Internal server error" };
  }
}
