import { HashRouter, Routes, Route } from "react-router-dom";
import AnimeItem from "./Components/AnimeItem";
import Homepage from "./Components/Homepage";
import Gallery from "./Components/Gallery";


function App() {
  
  return (
    <HashRouter>
      <Routes>
        {/* //Routing to popular */}
        <Route path="/" element={<Homepage />} />
        {/* Routing to each individual item clicked */}
        <Route path="/anime/:id" element={<AnimeItem />} />
        {/* Routing to each Anime Character */}
        <Route path="/character/:id" element={<Gallery />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
