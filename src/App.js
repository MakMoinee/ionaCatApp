import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./components/pages/Homepage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route expect path="/" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
