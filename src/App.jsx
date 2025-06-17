import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Styles
import "./styles/translate.css";

// Components
import LanguageSelector from "./components/Languageselector";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import SignupPatient from "./pages/SignupPatient";
import SignupDoctor from "./pages/SignupDoctor";
import About from "./pages/AboutUs";
import FirstAidList from "./pages/FirstAidList";
import SymptomList from "./pages/SymptomChecker";
import Home from "./pages/Home";
import SkinDiagnosis from "./pages/SkinDiagnosis";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FindDoctor from "./pages/FindDoctor";
import Dashboard from "./pages/Dashboard";
import Education from "./pages/Education";
import ViewProfile from "./pages/ViewProfile";
import NearbyClinics from "./pages/Clinics";
import Layout from "./Layout";

function App() {
  return (
    <Router>
      {/* 🌍 Language Selector always visible */}
      <LanguageSelector />

      <Routes>
        {/* Authentication routes outside Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup/patient" element={<SignupPatient />} />
        <Route path="/signup/doctor" element={<SignupDoctor />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Routes inside Layout wrapper */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/find-doctor/:id" element={<ViewProfile />} />
          <Route path="/education" element={<Education />} />
          <Route path="/about" element={<About />} />

          {/* Protected Routes */}
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