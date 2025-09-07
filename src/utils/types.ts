export type LiveChatRenderer = {
  initialDisplayState:
    | "LIVE_CHAT_DISPLAY_STATE_COLLAPSED"
    | "LIVE_CHAT_DISPLAY_STATE_EXPANDED";
  isReplay?: boolean;
};

export type WatchPageResponse = {
  contents?: {
    twoColumnWatchNextResults?: {
      conversationBar?: {
        liveChatRenderer?: LiveChatRenderer;
      };
    };
  };
};
