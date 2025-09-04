import { storage } from "#imports";

export const liveChatCollapsed = storage.defineItem<boolean>(
  "local:liveChatCollapsed",
  {
    fallback: false,
  },
);

export const liveChatReplayExpanded = storage.defineItem<boolean>(
  "local:liveChatReplayExpanded",
  {
    fallback: false,
  },
);
