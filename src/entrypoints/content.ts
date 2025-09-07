import { defineContentScript, injectScript } from "#imports";
import { messenger } from "@/utils/messaging";
import { liveChatCollapsed, liveChatReplayExpanded } from "@/utils/storage";
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
    await injectScript("/injected.js");

    const unwatch = liveChatCollapsed.watch((value) =>
      messenger.sendMessage("liveChatCollapsed", value),
    );
    ctx.onInvalidated(() => unwatch());

    messenger.onMessage("isReady", async () => {
      const sendLiveChatCollapsed = liveChatCollapsed
        .getValue()
        .then((value) => messenger.sendMessage("liveChatCollapsed", value));

      await Promise.allSettled([sendLiveChatCollapsed]);
    });

    ctx.addEventListener(document, "yt-navigate-finish", async (ev) => {
      if (!hasLiveChatReplay(ev)) {
        return;
      }

      const value = await liveChatReplayExpanded.getValue();
      if (!value) {
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
