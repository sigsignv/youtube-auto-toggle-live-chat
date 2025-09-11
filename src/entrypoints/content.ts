import { defineContentScript, injectScript } from "#imports";
import { channel } from "@/utils/messaging";
import { liveChatCollapsed, liveChatReplayCollapsed } from "@/utils/storage";
import type { WatchPageResponse } from "@/utils/types";

declare global {
  interface DocumentEventMap {
    "yt-navigate-finish": CustomEvent<{
      response?: { response?: WatchPageResponse };
    }>;
  }
}

export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  runAt: "document_start",
  allFrames: false,

  async main(ctx) {
    channel.onMessage("get", async () => {
      return await liveChatCollapsed.getValue();
    });

    await injectScript("/injected.js");

    const unwatch = liveChatCollapsed.watch((value) =>
      channel.sendMessage("set", value),
    );
    ctx.onInvalidated(() => unwatch());

    ctx.addEventListener(document, "yt-navigate-finish", async (ev) => {
      if (!hasLiveChatReplay(ev)) {
        return;
      }

      const value = await liveChatReplayCollapsed.getValue();
      if (value) {
        return;
      }

      const id = ctx.setInterval(() => {
        const button = findOpenChatButton();
        if (button) {
          button.click();
          clearInterval(id);
        }
      }, 100);

      const timeout = AbortSignal.timeout(10000);
      timeout.addEventListener("abort", () => clearInterval(id), {
        once: true,
      });
    });
  },
});

function hasLiveChatReplay(ev: DocumentEventMap["yt-navigate-finish"]) {
  return (
    ev.detail.response?.response?.contents?.twoColumnWatchNextResults
      ?.conversationBar?.liveChatRenderer?.isReplay === true
  );
}

function findOpenChatButton(root: Document | HTMLElement = document) {
  return root.querySelector<HTMLElement>(
    "#show-hide-button:not([hidden]) > ytd-button-renderer.ytd-live-chat-frame",
  );
}
