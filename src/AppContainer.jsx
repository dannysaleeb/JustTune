import { useState } from "react";
import AudioGate from "./components/main/AudioGate.jsx";
import App from "./App.jsx";

export default function AppContainer() {
  const [audioReady, setAudioReady] = useState(false);

  if (!audioReady) {
    return <AudioGate onReady={() => setAudioReady(true)} />;
  }

  return <App />;
}
