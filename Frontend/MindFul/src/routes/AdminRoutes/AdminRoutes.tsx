import { Routes, Route } from "react-router-dom";
import AdminLayout from "../../component/AdminLayout/AdminLayout";
import Analytics from "../../pages/Admin/Analytics";
import User_Management from "../../pages/Admin/User_Management"; 
import Journal_Management from "../../pages/Admin/Journal_Management";
import AI_Management from "../../pages/Admin/AI_Management";


const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/user-management" element={<User_Management />} />
        <Route path="/journal-management" element={<Journal_Management />} />
        <Route path="/ai-management" element={<AI_Management />} />
        
      </Route>
    </Routes>
  );
};

export default AdminRoutes;