"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllPolls({ user, type, page = 1, limit = 10 }) {
  console.log(user);
  
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
``;
