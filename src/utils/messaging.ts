import { defineCustomEventMessaging } from "@webext-core/messaging/page";

interface ChannelSchema {
  fetch(): boolean;
  sync(value: boolean): void;
}

export const channel = defineCustomEventMessaging<ChannelSchema>({
  namespace: "youtube-live-chat-collapsed-by-default",
});
