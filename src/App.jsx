import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

// Styles
import "./styles/translate.css";

// Components (not lazy loaded - needed immediately)
import LanguageSelector from "./components/Languageselector";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./Layout";
import { LoadingSpinner } from "./components/ui/loading";

// Lazy load pages for better performance
const Login = lazy(() => import("./pages/Login"));
const SignupPatient = lazy(() => import("./pages/SignupPatient"));
const SignupDoctor = lazy(() => import("./pages/SignupDoctor"));
const About = lazy(() => import("./pages/AboutUs"));
const FirstAidList = lazy(() => import("./pages/FirstAidList"));
const SymptomList = lazy(() => import("./pages/SymptomChecker"));
const Home = lazy(() => import("./pages/Home"));
const SkinDiagnosis = lazy(() => import("./pages/SkinDiagnosis"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const FindDoctor = lazy(() => import("./pages/FindDoctor"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Education = lazy(() => import("./pages/Education"));
const ViewProfile = lazy(() => import("./pages/ViewProfile"));
const NearbyClinics = lazy(() => import("./pages/Clinics"));

function App() {
  return (
    <Router>
      {/* 🌍 Language Selector always visible */}
      <LanguageSelector />

      <Suspense fallback={<LoadingSpinner message="Loading MediHelp+..." />}>
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
      </Suspense>
    </Router>
  );
}

export default App;