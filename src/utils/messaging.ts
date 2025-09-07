import { defineCustomEventMessaging } from "@webext-core/messaging/page";

interface ChannelSchema {
  get(): Promise<boolean>;
  set(value: boolean): void;
}

export const channel = defineCustomEventMessaging<ChannelSchema>({
  namespace: "youtube-live-chat-auto-collapsed-config-channel",
});
