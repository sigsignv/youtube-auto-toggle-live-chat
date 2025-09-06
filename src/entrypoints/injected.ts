import { defineUnlistedScript } from "#imports";
import { messenger } from "@/utils/messaging";

declare global {
  interface DocumentEventMap {
    "yt-page-data-fetched": YTPageDataFetchedEvent;
  }
}

type YTPageDataFetchedEvent = CustomEvent<{ pageData: PageData }>;

type PageData = {
  response?: {
    contents?: {
      twoColumnWatchNextResults?: {
        conversationBar?: {
          liveChatRenderer?: LiveChatRenderer;
        };
      };
    };
  };
};

type LiveChatRenderer = {
  initialDisplayState:
    | "LIVE_CHAT_DISPLAY_STATE_COLLAPSED"
    | "LIVE_CHAT_DISPLAY_STATE_EXPANDED";
};

export default defineUnlistedScript(() => {
  let isLiveChatCollapsed = false;
  let isLiveChatReplayExpanded = false;

  const handler = (ev: YTPageDataFetchedEvent) => {
    const liveChatRenderer =
      ev.detail.pageData.response?.contents?.twoColumnWatchNextResults
        ?.conversationBar?.liveChatRenderer;
    if (!liveChatRenderer) {
      return;
    }

    const { initialDisplayState } = liveChatRenderer;
    if (
      initialDisplayState === "LIVE_CHAT_DISPLAY_STATE_EXPANDED" &&
      isLiveChatCollapsed
    ) {
      liveChatRenderer.initialDisplayState =
        "LIVE_CHAT_DISPLAY_STATE_COLLAPSED";
    }
  };

  document.addEventListener("yt-page-data-fetched", handler);

  messenger.onMessage("liveChatCollapsed", ({ data }) => {
    isLiveChatCollapsed = data;
  });

  messenger.onMessage("liveChatReplayExpanded", ({ data }) => {
    isLiveChatReplayExpanded = data;
  });

  messenger.sendMessage("isReady");
});
