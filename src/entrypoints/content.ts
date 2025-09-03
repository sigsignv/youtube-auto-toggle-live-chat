import { defineContentScript, injectScript } from "#imports";
import { onMessage } from "@/utils/messaging";

export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  runAt: "document_start",
  allFrames: false,

  async main() {
    const key = "ext:live-chat-display-options";

    onMessage("load", () => {
      const options = localStorage.getItem(key);
      console.log({ kind: "load", options });
      return options ? JSON.parse(options) : {};
    });

    onMessage("store", ({ data }) => {
      console.log({ kind: "store", data });
      if (data.liveChatCollapsed || data.liveChatReplayExpanded) {
        localStorage.setItem(key, JSON.stringify(data));
      } else {
        localStorage.removeItem(key);
      }
    });

    await injectScript("/injected.js");
  },
});
