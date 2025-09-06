import { defineCustomEventMessaging } from "@webext-core/messaging/page";

interface MessengerSchema {
  liveChatCollapsed(value: boolean): void;
  liveChatReplayExpanded(value: boolean): void;
  isReady(): Promise<void>;
}

export const messenger = defineCustomEventMessaging<MessengerSchema>({
  namespace: "youtube-live-chat-default-state-messenger",
});
