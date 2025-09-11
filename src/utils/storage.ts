import { storage } from "#imports";

export const liveChatCollapsed = storage.defineItem<boolean>(
  "local:liveChatCollapsed",
  {
    fallback: true,
  },
);

export const liveChatReplayCollapsed = storage.defineItem<boolean>(
  "local:liveChatReplayCollapsed",
  {
    fallback: true,
  },
);
