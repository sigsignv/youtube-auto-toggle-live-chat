import { defineUnlistedScript } from "#imports";
import { channel } from "@/utils/messaging";
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

export default defineUnlistedScript(async () => {
  let isEnabled = await channel.sendMessage("get");

  channel.onMessage("set", ({ data }) => {
    isEnabled = data;
  });

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
      isEnabled
    ) {
      liveChatRenderer.initialDisplayState =
        "LIVE_CHAT_DISPLAY_STATE_COLLAPSED";
    }
  };

  document.addEventListener("yt-page-data-fetched", handler);
});
