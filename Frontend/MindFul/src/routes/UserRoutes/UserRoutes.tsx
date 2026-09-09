import { Routes, Route } from "react-router-dom";
import UserLayout from "../../component/UserLayout/UserLayout";
import Dashboard from "../../pages/User/Dashboard";
import DailyJournal from "../../pages/User/DailyJournal";
import History from "../../pages/User/History";
import AI_Assistant from "../../pages/User/AI_Assistant";

const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/daily-journal" element={<DailyJournal />} />
        <Route path="/history" element={<History />} />
        <Route path="/ai-assistant" element={<AI_Assistant />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;