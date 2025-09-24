// src/App.tsx
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Contact from "./components/Contact";
import Cuadricula from "./components/cuadricula";
import Hero from "./components/hero";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Layout from "./components/Layout";
import Album from "./components/Album";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Cuadricula />
                <Contact />
                <Footer />
              </>
            }
          />
          <Route path="/albums/:slug" element={<Album />} />
          {/* si querés rutas estáticas para cada álbum podríamos agregar:
              <Route path="/albums/mediaday" element={<Album ... />} />
          */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
