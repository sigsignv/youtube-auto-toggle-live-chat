import { createSignal, onMount, Show } from "solid-js";
import { browser } from "#imports";
import { sendMessage } from "@/utils/messaging";

async function getActiveTabId(): Promise<number | undefined> {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });

  const activeTab = tabs[0];
  if (activeTab?.id && activeTab?.url) {
    const url = new URL(activeTab.url);
    if (url.hostname === "www.youtube.com") {
      return activeTab.id;
    }
  }

  return;
}

function App() {
  const [tabId, setTabId] = createSignal<number>();
  const [liveChatCollapsed, setLiveChatCollapsed] = createSignal(false);

  onMount(async () => {
    const tabId = await getActiveTabId();
    if (!tabId) {
      return;
    }

    const options = await sendMessage("load", undefined, tabId);
    if (options.liveChatCollapsed) {
      setLiveChatCollapsed(true);
    }
    setTabId(tabId);
  });

  return (
    <Show when={tabId() !== null} fallback={<div>No active YouTube tab</div>}>
      <section>
        <h2>Live Chat</h2>
        <input
          type="checkbox"
          checked={liveChatCollapsed()}
          onChange={async (e) => {
            const id = tabId();
            if (!id) {
              return;
            }

            await sendMessage(
              "store",
              {
                liveChatCollapsed: e.target.checked,
              },
              id,
            );
          }}
        />
      </section>
    </Show>
  );
}

export default App;
