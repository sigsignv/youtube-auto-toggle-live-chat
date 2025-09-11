import { createSignal, onMount } from "solid-js";
import { liveChatCollapsed, liveChatReplayCollapsed } from "@/utils/storage";

import "./App.css";

function App() {
  const [isLiveCollapsed, setIsLiveCollapsed] = createSignal(true);
  const [isReplayCollapsed, setIsReplayCollapsed] = createSignal(true);

  onMount(async () => {
    const fetchLiveCollapsed = liveChatCollapsed
      .getValue()
      .then((value) => setIsLiveCollapsed(value));
    liveChatCollapsed.watch((value) => setIsLiveCollapsed(value));

    const fetchReplayCollapsed = liveChatReplayCollapsed
      .getValue()
      .then((value) => setIsReplayCollapsed(value));
    liveChatReplayCollapsed.watch((value) => setIsReplayCollapsed(value));

    await Promise.allSettled([fetchLiveCollapsed, fetchReplayCollapsed]);
  });

  return (
    <form>
      <fieldset>
        <legend>Live streaming</legend>
        <label>
          Live chat auto-expanded :
          <input
            type="checkbox"
            checked={!isLiveCollapsed()}
            onChange={async (e) => {
              await liveChatCollapsed.setValue(!e.target.checked);
            }}
          />
        </label>
      </fieldset>
      <fieldset>
        <legend>Live archive / Premieres</legend>
        <label>
          Live chat replay auto-expanded :
          <input
            type="checkbox"
            checked={!isReplayCollapsed()}
            onChange={async (e) => {
              await liveChatReplayCollapsed.setValue(!e.target.checked);
            }}
          />
        </label>
      </fieldset>
    </form>
  );
}

export default App;
