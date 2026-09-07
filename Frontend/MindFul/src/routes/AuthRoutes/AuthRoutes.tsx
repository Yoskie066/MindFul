import { Routes, Route } from "react-router-dom";
import UserLogin from "../../pages/Auth/User/UserLogin/UserLogin";
import UserRegister from "../../pages/Auth/User/UserRegister/UserRegister";
import UserForgotPassword from "../../pages/Auth/User/UserForgotPassword/UserForgotPassword";
import AdminLogin from "../../pages/Auth/Admin/AdminLogin/AdminLogin";
import AdminRegister from "../../pages/Auth/Admin/AdminRegister/AdminRegister";
import AdminForgotPassword from "../../pages/Auth/Admin/AdminForgotPassword/AdminForgotPassword";

const AuthRoutes = () => {
  return (
    <>
        <Routes>
            <Route path='/' element={<UserLogin/>}/>
            <Route path='/login' element={<UserLogin/>}/>
            <Route path='/register' element={<UserRegister/>}/>
            <Route path='/forgot-password' element={<UserForgotPassword/>}/>
            <Route path='/admin-login' element={<AdminLogin/>}/>
            <Route path='/admin-register' element={<AdminRegister/>}/>
            <Route path='/admin-forgot-password' element={<AdminForgotPassword/>}/>
        </Routes>
    </>
  )
}

export default AuthRoutes;