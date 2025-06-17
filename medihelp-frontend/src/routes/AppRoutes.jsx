import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PatientLogin from "../pages/patient/PatientLogin";
import PatientSignup from "../pages/patient/PatientSignup";
import PatientDashboard from "../pages/patient/PatientDashboard";
import DoctorLogin from "../pages/doctor/DoctorLogin";
import DoctorSignup from "../pages/doctor/DoctorSignup";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import Home from "../pages/Home";
import AboutUs from "../pages/AboutUs";
import Clinics from "../pages/Clinics";
import Education from "../pages/Education";
import FirstAidList from "../pages/FirstAidList";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Videos from "../pages/Videos";
import SkinDiagnosis from "../pages/SkinDiagnosis";
import SymptomChecker from "../pages/SymptomChecker";
import ViewProfile from "../pages/ViewProfile";
import FindDoctor from "../pages/FindDoctor";
import Appointments from "../pages/Appointments";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/clinics" element={<Clinics />} />
        <Route path="/education" element={<Education />} />
        <Route path="/first-aid" element={<FirstAidList />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/skin-diagnosis" element={<SkinDiagnosis />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
        <Route path="/view-profile/:id" element={<ViewProfile />} />
        <Route path="/find-doctor" element={<FindDoctor />} />
        <Route path="/appointments" element={<Appointments />} />

        {/* Patient Routes */}
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/signup" element={<PatientSignup />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />

        {/* Doctor Routes */}
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/signup" element={<DoctorSignup />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;