import { Routes, Route } from "react-router-dom";
import Layout from "../../component/Layout/Layout";
import Landingpage from "../../component/Homepage/LandingPage";
import Home from "../../component/Homepage/Home";
import About from "../../component/Homepage/About";
import Services from "../../component/Homepage/Services";
import Contact from "../../component/Homepage/Contact";

const HomepageRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landingpage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact-us" element={<Contact />} />
      </Route>
    </Routes>
  );
};

export default HomepageRoutes;