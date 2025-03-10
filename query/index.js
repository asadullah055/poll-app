"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllPolls({ user, type, page = 1, limit = 10 }) {
  try {
    // const user = await getUser();
    const filter = {};

    if (type) filter.type = type;
    if (user) filter.createById = user.id;
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    const polls = await prisma.poll.findMany({
      where: filter,
      include: {
        creator: {
          select: {
            fullname: true,
            email: true,
            username: true,
            profileImage: true,
          },
        },
        responses: {
          include: {
            user: {
              select: { fullname: true, username: true, profileImage: true },
            },
          },
        },
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });
    const updatedPolls = polls.map((poll) => {
      const userHasVoted = poll.votersId.some((voterId) => voterId === user.id);
      return {
        ...poll,
        userHasVoted,
      };
    });
    const totalPolls = await prisma.poll.count({ where: filter });
    const stats = await prisma.poll.groupBy({
      by: ["type"],
      _count: { _all: true },
    });
    const allTypes = [
      { label: "Yes/No", type: "yes/no" },
      { label: "Single Choice", type: "single-choice" },
      { label: "Rating", type: "rating" },
      { label: "Image Based", type: "image-based" },
      { label: "Open Ended", type: "open-ended" },
    ];

    const statsWithDefaults = allTypes
      .map((pollType) => {
        const stat = stats.find((item) => item.type === pollType.type);
        return {
          label: pollType.label,
          type: pollType.type,
          count: stat ? stat._count._all : 0,
        };
      })
      .sort((a, b) => b.count - a.count);

    return {
      polls: updatedPolls,
      currentPage: pageNumber,
      totalPage: Math.ceil(totalPolls / pageSize),
      totalPolls,
      stats: statsWithDefaults,
    };
  } catch (error) {
    console.error("Error fetching polls:", error);
    return [];
  }
}
export async function getVotedPolls({ user, type, page = 1, limit = 10 }) {
  try {
    // const user = await getUser();
    const filter = {};

    if (type) filter.type = type;
    if (user) filter.createById = user.id;
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    const polls = await prisma.poll.findMany({
      where: { createById: user.id },
      include: {
        creator: {
          select: {
            fullname: true,
            email: true,
            username: true,
            profileImage: true,
          },
        },
        responses: {
          include: {
            user: {
              select: { fullname: true, username: true, profileImage: true },
            },
          },
        },
      },
      skip,
      take: pageSize,
    });
    const updatedPolls = polls.map((poll) => {
      const userHasVoted = poll.votersId.some((voterId) => voterId === user.id);
      return {
        ...poll,
        userHasVoted,
      };
    });
    const totalVotedPolls = await prisma.poll.count({
      where: { createById: user.id },
    });
    return {
      polls: updatedPolls,
      currentPage: pageNumber,
      totalPage: Math.ceil(totalPolls / pageSize),
      totalPolls,
      totalVotedPolls,
    };
  } catch (error) {
    console.error("Error fetching polls:", error);
    return [];
  }
}
export async function getPollById(id) {
  try {
    const poll = await prisma.poll.findUnique({
      where: { id: id },
      include: {
        creator: {
          select: {
            email: true,
            username: true,
          },
        },
        responses: {
          include: {
            user: {
              select: { fullname: true, username: true, profileImage: true },
            },
          },
        },
      },
    });
    if (!poll) {
      return { message: "Poll not found" };
    }
    return poll;
  } catch (error) {
    console.error("Error fetching polls:", error);
    return [];
  }
}
export async function getBookmarkedPolls(id) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      include: {
        pollId: {
          select: {
            creator: {
              select: {
                fullname: true,
                username: true,
                profileImage: true,
              },
            },
          },
        },
        responses: {
          select: {
            voter: {
              select: {
                fullname: true,
                username: true,
                profileImage: true,
              },
            },
          },
        },
      },
    });
    if (!user) {
      return { message: "user not found" };
    }
    
    const bookmarkPolls = user.bookmarkedPolls.map((poll) => {
      const userHasVoted = poll.voters.some((voter) => voter.id === id);
      return {
        ...poll,
        userHasVoted,
      };
    });

    return bookmarkPolls;
  } catch (error) {
    console.error("Error fetching polls:", error);
    return [];
  }
}
