import { createSignal, onMount } from "solid-js";
import { liveChatCollapsed } from "@/utils/storage";

import "./App.css";

function App() {
  const [isLiveChatCollapsed, setIsLiveChatCollapsed] = createSignal(false);

  onMount(async () => {
    const value = await liveChatCollapsed.getValue();
    setIsLiveChatCollapsed(value);
  });

  return (
    <section>
      <h2>Live Chat</h2>
      <input
        type="checkbox"
        checked={isLiveChatCollapsed()}
        onChange={async (e) => {
          await liveChatCollapsed.setValue(e.target.checked);
        }}
      />
    </section>
  );
}

export default App;
