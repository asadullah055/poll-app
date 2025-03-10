"use server";
import { getUser } from "@/lib/dal";
import { uploadImages } from "@/lib/upload";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createPoll(state, formData) {
  // Keep for Next.js server actions

  const { user } = await getUser();

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
          return {
            error: { image: "Image-based poll must have at least two images." },
          };
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
    revalidatePath("/create-poll");
    return { success: true, message: "Poll created successfully!" };
  } catch (err) {
    return {
      error: {
        server: "Something went wrong. Please try again",
      },
    };
  }
}
export async function voteOnPoll(state, formData) {
  const { optionIndex, voterId, responseText, id } = formData;

  try {
    const poll = await prisma.poll.findUnique({
      where: { id },
      include: { responses: true },
    });

    if (!poll) {
      return { message: "Poll not found" };
    }

    if (poll.closed) {
      return { message: "Poll is closed" };
    }

    if (poll.votersId.includes(voterId)) {
      return { message: "User has already voted on this poll" };
    }

    if (poll.type === "open-ended") {
      if (!responseText) {
        return { message: "Response text is required for open-ended polls" };
      }

      await prisma.response.create({
        data: {
          pollId: id,
          voterId,
          responseText,
        },
      });
    } else {
      if (
        optionIndex === undefined ||
        optionIndex < 0 ||
        optionIndex >= poll.options.length
      ) {
        return { message: "Invalid option index" };
      }

      const updatedOptions = [...poll.options];
      updatedOptions[optionIndex].votes += 1;

      await prisma.poll.update({
        where: { id },
        data: {
          options: updatedOptions,
        },
      });
    }

    await prisma.poll.update({
      where: { id },
      data: {
        votersId: {
          push: voterId,
        },
      },
    });

    return { message: "Voted successfully" };
  } catch (err) {
    console.log(err);
    return {
      message: "Error creating vote",
      error: err.message,
    };
  }
}

export async function closePoll(state, formData) {
  const { id, userId } = formData;

  try {
    const poll = await prisma.poll.findUnique({ where: { id } });

    if (!poll) {
      return { message: "Poll not found" };
    }

    if (poll.creatorId !== userId) {
      return { message: "You are not authorized to close this poll." };
    }

    await prisma.poll.update({
      where: { id },
      data: { closed: true },
    });

    return { message: "Poll closed successfully" };
  } catch (err) {
    console.error(err);
    return {
      message: "Error closing poll",
      error: err.message,
    };
  }
}

export async function bookmarkPoll(state, formData) {
  const { id, userId } = formData;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { message: "User not found" };
    }

    const isBookmarked = user.bookmarkedPolls.includes(id);

    if (isBookmarked) {
      const updatedBookmarks = user.bookmarkedPolls.filter(
        (pollId) => pollId !== id
      );

      await prisma.user.update({
        where: { id: userId },
        data: { bookmarkedPolls: updatedBookmarks },
      });

      return {
        message: "Poll removed from bookmarks",
        bookmarkedPolls: updatedBookmarks,
      };
    }

    const updatedBookmarks = [...user.bookmarkedPolls, id];
    await prisma.user.update({
      where: { id: userId },
      data: { bookmarkedPolls: updatedBookmarks },
    });

    return {
      message: "Poll bookmarked successfully",
      bookmarkedPolls: updatedBookmarks,
    };
  } catch (err) {
    console.error(err);
    return {
      message: "Error bookmarking poll",
      error: err.message,
    };
  }
}
