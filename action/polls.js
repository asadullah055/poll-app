"use server";
import { getUser } from "@/lib/dal";
import { uploadImages } from "@/lib/upload";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createPoll(state, formData) {
  // Keep for Next.js server actions
 
  
  const {user} = await getUser();


  const question = formData.question;
  const type = formData.type;
  const options = formData.options;
  const files = formData.imageOption;

  if (!question) {
    return {
      error: { question: "Question is required" },
    };
  }
  if (!type) {
    return {
      error: { type: "Type is required" },
    };
  }
  if (!user.id) {
    return {
      error: { user: "You are not login please login first" },
    };
  }

  try {
    let processedOption = [];

    switch (type) {
      case "single-choice":
        if (options.length < 2) {
          return {
            error: {
              single: "Single-choice poll must have at least two options.",
            },
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
          return { error:{ image: "Image-based poll must have at least two images." }};
        }
        for (const file of files) {
          if (file.size > 1048576) {
            return {
              error: { fileSize: "Each image file must be 1MB or smaller." },
            };
          }
        }
        const { urls } = await uploadImages(files);
        processedOption = urls.map((url) => ({ optionText: url }));
        break;

      default:
        return { error: { default: "Invalid poll type." } };
    }
    await prisma.poll.create({
      data: {
        question,
        type,
        options: processedOption,
        creator: { connect: { id: user.id } },
      },
    });
    revalidatePath('/create-poll')
    return { success: true, message: "Poll created successfully!" };
  } catch (err) {
    return {
      error: {
        server: "Something went wrong. Please try again",
      },
    };
  }
}
