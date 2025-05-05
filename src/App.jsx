import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import About from "./pages/AboutUs";
import ProtectedRoute from "./components/ProtectedRoute";
import FirstAidList from "./pages/FirstAidList";
import SymptomList from "./pages/SymptomChecker";
import Home from "./pages/Home";
import SkinDiagnosis from "./pages/SkinDiagnosis";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FindDoctor from "./pages/FindDoctor";
import Dashboard from "./pages/DashBoard";
import Education from "./pages/Education";
import Appointments from "./pages/appointments";
import ViewProfile from "./pages/ViewProfile";
import NearbyClinics from "./pages/Clinics";
import Layout from "./Layout";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/find-doctor/:id" element={<ViewProfile />} />

          <Route path="/education" element={<Education />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/first-aid"
            element={
              <ProtectedRoute>
                <FirstAidList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/symptom-checker"
            element={
              <ProtectedRoute>
                <SymptomList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/find-doctor"
            element={
              <ProtectedRoute>
                <FindDoctor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/find-clinic"
            element={
              <ProtectedRoute>
                <NearbyClinics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skin-diagnosis"
            element={
              <ProtectedRoute>
                <SkinDiagnosis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
