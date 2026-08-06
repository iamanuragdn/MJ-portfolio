import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import useLenis from "@/hooks/useLenis";
import { NoiseOverlay } from "@/components/site/NoiseOverlay";
import { Home } from "@/components/site/Home";
import { Studio } from "@/components/site/Studio";

function App() {
  useLenis();
  return (
    <div className="App bg-ink text-white">
      <NoiseOverlay />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/studio" element={<Studio />} />
        </Routes>
      </BrowserRouter>
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}

export default App;
