import { defineUnlistedScript } from "#imports";
import { channel } from "@/utils/messaging";
import type { LiveChatRenderer, WatchPageResponse } from "@/utils/types";

declare global {
  interface DocumentEventMap {
    "yt-page-data-fetched": CustomEvent<{
      pageData: { response?: WatchPageResponse };
    }>;
  }
}

export default defineUnlistedScript(async () => {
  let isEnabled = await channel.sendMessage("get");

  channel.onMessage("set", ({ data }) => {
    isEnabled = data;
  });

  const handler = (ev: DocumentEventMap["yt-page-data-fetched"]) => {
    const liveChatRenderer = getLiveChatRenderer(ev);
    if (!liveChatRenderer || liveChatRenderer.isReplay) {
      return;
    }

    if (isEnabled && isLiveChatExpanded(liveChatRenderer)) {
      liveChatRenderer.initialDisplayState =
        "LIVE_CHAT_DISPLAY_STATE_COLLAPSED";
    }
  };

  document.addEventListener("yt-page-data-fetched", handler);
});

function getLiveChatRenderer(ev: DocumentEventMap["yt-page-data-fetched"]) {
  return ev.detail.pageData.response?.contents?.twoColumnWatchNextResults
    ?.conversationBar?.liveChatRenderer;
}

function isLiveChatExpanded(renderer: LiveChatRenderer) {
  return renderer.initialDisplayState === "LIVE_CHAT_DISPLAY_STATE_EXPANDED";
}
