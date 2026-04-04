import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import PaperPage from './pages/PaperPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/papers/:id" element={<PaperPage />} />
      </Routes>
    </BrowserRouter>
  );
}
