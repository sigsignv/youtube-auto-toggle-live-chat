import { defineUnlistedScript } from "#imports";
import { messenger } from "@/utils/messaging";
import type { WatchPageResponse } from "@/utils/types";

declare global {
  interface DocumentEventMap {
    "yt-page-data-fetched": YTPageDataFetchedEvent;
  }
}

type YTPageDataFetchedEvent = CustomEvent<{ pageData: PageData }>;

type PageData = {
  response?: WatchPageResponse;
};

export default defineUnlistedScript(() => {
  let isLiveChatCollapsed = false;

  const handler = (ev: YTPageDataFetchedEvent) => {
    const liveChatRenderer =
      ev.detail.pageData.response?.contents?.twoColumnWatchNextResults
        ?.conversationBar?.liveChatRenderer;
    if (!liveChatRenderer || liveChatRenderer.isReplay) {
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

  messenger.sendMessage("isReady");
});
