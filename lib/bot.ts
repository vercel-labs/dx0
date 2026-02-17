// oxlint-disable jest/require-hook

import { createSlackAdapter } from "@chat-adapter/slack";
import { createRedisState } from "@chat-adapter/state-redis";
import { Chat, ConsoleLogger, emoji, Image, root } from "chat";

const { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, REDIS_URL } = process.env;

if (!SLACK_BOT_TOKEN || !SLACK_SIGNING_SECRET || !REDIS_URL) {
  throw new Error("Missing environment variables");
}

export const bot = new Chat({
  adapters: {
    slack: createSlackAdapter({
      botToken: SLACK_BOT_TOKEN,
      logger: new ConsoleLogger(),
      signingSecret: SLACK_SIGNING_SECRET,
    }),
  },
  logger: new ConsoleLogger(),
  state: createRedisState({
    logger: new ConsoleLogger(),
    url: REDIS_URL,
  }),
  userName: "dx0",
});

// Respond to @mentions
bot.onNewMention(async (thread) => {
  await thread.subscribe();

  await thread.post({
    ast: root([
      Image({
        url: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXliMGlnZXZ1ajU1dzcwNHk3MWd6aTZkZ204Y2R2cHM4bTJjNGE3aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dtfUJxOTqhHO/giphy.gif",
      }),
    ]),
  });
});

// Respond to follow-up messages in subscribed threads
bot.onSubscribedMessage(async (thread, message) => {
  //   await thread.post(`You said: ${message.text}`);
});

// Filter to specific emoji
bot.onReaction([emoji.thumbs_up, emoji.heart], async (event) => {
  //   if (event.added) {
  //     await event.thread.post(`Thanks for the ${event.emoji}!`);
  //   }
});
