import { clerkClient } from "@clerk/nextjs";
import { type Newsletter } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { filterUserForClient } from "~/server/helper/filterClerkUserForClient";

// const ratelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(3, "1 m"),
//   analytics: true,
// });

const addUserDataToNewsletters = async (newsletters: Newsletter[]) => {
  const userId = newsletters.map((newsletter) => newsletter.authorId);
  const users = (
    await clerkClient.users.getUserList({
      userId: userId,
      limit: 110,
    })
  ).map(filterUserForClient);

  return newsletters.map((newsletter) => {
    const author = users.find((user) => user.id === newsletter.authorId);

    if (!author) {
      console.error("AUTHOR NOT FOUND", newsletter);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for newsletter not found. POST ID: ${newsletter.id}, USER ID: ${newsletter.authorId}`,
      });
    }
    // if (!author.username) {
    //   // user the ExternalUsername
    //   if (!author.externalUsername) {
    //     throw new TRPCError({
    //       code: "INTERNAL_SERVER_ERROR",
    //       message: `Author has no GitHub Account: ${author.id}`,
    //     });
    //   }
    //   author.username = author.externalUsername;
    // }
    return {
      newsletter,
      author: {
        ...author,
        // username: author.username ?? "(username not found)",
      },
    };
  });
};

export const newsletterRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const newsletter = await ctx.prisma.newsletter.findUnique({
        where: { id: input.id },
      });

      if (!newsletter) throw new TRPCError({ code: "NOT_FOUND" });

      return (await addUserDataToNewsletters([newsletter]))[0];
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const newsletters = await ctx.prisma.newsletter.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    return addUserDataToNewsletters(newsletters);
  }),

  getNewslettersByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ ctx, input }) =>
      ctx.prisma.newsletter
        .findMany({
          where: {
            authorId: input.userId,
          },
          take: 100,
          orderBy: [{ createdAt: "desc" }],
        })
        .then(addUserDataToNewsletters)
    ),
  create: privateProcedure
    .input(
      z.object({
        content: z.string().min(2).max(28000),
        generated: z.string().min(0).max(28000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      // const { success } = await ratelimit.limit(authorId);
      // if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const newsletter = await ctx.prisma.newsletter.create({
        data: {
          authorId,
          content: input.content,
          generated: input.generated ?? "",
        },
      });

      return newsletter;
    }),
  edit: privateProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string().min(2).max(28000),
        generated: z.string().min(0).max(28000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      // const { success } = await ratelimit.limit(authorId);
      // if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      // Check if the newsletter exists and belongs to the author
      const existingNewsletter = await ctx.prisma.newsletter.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!existingNewsletter) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (existingNewsletter.authorId !== authorId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const updatedNewsletter = await ctx.prisma.newsletter.update({
        where: {
          id: input.id,
        },
        data: {
          content: input.content,
          generated: input.generated ?? "",
        },
      });

      return updatedNewsletter;
    }),
});
