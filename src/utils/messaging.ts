import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
  load(): LiveChatOptions;
  store(options: LiveChatOptions): void;
}

export type LiveChatOptions = {
  liveChatCollapsed?: boolean;
  liveChatReplayExpanded?: boolean;
};

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>();
