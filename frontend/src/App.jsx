import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";

import DashboardPage from "./pages/DashboardPage";
import TodayPage from "./pages/TodayPage";
import UpcomingPage from "./pages/UpcomingPage";
import MissedPage from "./pages/MissedPage";
import UploadLeadsPage from "./pages/UploadLeadsPage";
import TotalLeadsPage from "./pages/TotalLeadsPage";
import DuplicateLeadsPage from "./pages/DuplicateLeadsPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/today" element={<TodayPage />} />
        <Route path="/upcoming" element={<UpcomingPage />} />
        <Route path="/missed" element={<MissedPage />} />
        <Route path="/upload" element={<UploadLeadsPage />} />
        <Route path="/leads" element={<TotalLeadsPage />} />
        <Route path="/duplicates" element={<DuplicateLeadsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
