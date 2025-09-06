import { createSignal, onMount } from "solid-js";
import { liveChatCollapsed, liveChatReplayExpanded } from "@/utils/storage";

import "./App.css";

function App() {
  const [isLiveChatCollapsed, setIsLiveChatCollapsed] = createSignal(false);
  const [isLiveChatReplayExpanded, setIsLiveChatReplayExpanded] =
    createSignal(false);

  onMount(async () => {
    const fetchLiveChatCollapsed = liveChatCollapsed
      .getValue()
      .then((value) => setIsLiveChatCollapsed(value));
    const fetchLiveChatReplayExpanded = liveChatReplayExpanded
      .getValue()
      .then((value) => setIsLiveChatReplayExpanded(value));

    await Promise.allSettled([
      fetchLiveChatCollapsed,
      fetchLiveChatReplayExpanded,
    ]);
  });

  return (
    <form>
      <fieldset>
        <legend>Live streaming</legend>
        <label>
          Live chat auto-expanded :
          <input
            type="checkbox"
            checked={!isLiveChatCollapsed()}
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
            checked={isLiveChatReplayExpanded()}
            onChange={async (e) => {
              await liveChatReplayExpanded.setValue(e.target.checked);
            }}
          />
        </label>
      </fieldset>
    </form>
  );
}

export default App;
