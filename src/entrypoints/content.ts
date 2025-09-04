import { defineContentScript, injectScript } from "#imports";
import { messenger } from "@/utils/messaging";
import { liveChatCollapsed, liveChatReplayExpanded } from "@/utils/storage";

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

    const unwatchReplay = liveChatReplayExpanded.watch((value) =>
      messenger.sendMessage("liveChatReplayExpanded", value),
    );
    ctx.onInvalidated(() => unwatchReplay());

    const isLiveChatCollapsed = await liveChatCollapsed.getValue();
    messenger.sendMessage("liveChatCollapsed", isLiveChatCollapsed);

    const isLiveChatReplayExpanded = await liveChatReplayExpanded.getValue();
    messenger.sendMessage("liveChatReplayExpanded", isLiveChatReplayExpanded);
  },
});
