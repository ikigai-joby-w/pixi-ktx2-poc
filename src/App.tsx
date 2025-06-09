import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PixiCanvas from "./components/PixiCanvas";
import Navigation from "./components/Navigation";
import 'pixi.js/ktx2';

function App() {
  return (
    <Router>
    <div style={{ width: "100vw", height: "100vh" }}>
        <Navigation />
        <Routes>
          <Route path="/bunny" element={<PixiCanvas />} />
          <Route path="/win" element={<PixiCanvas />} />
          <Route path="/" element={<Navigate to="/bunny" replace />} />
        </Routes>
    </div>
    </Router>
  );
}

export default App;
