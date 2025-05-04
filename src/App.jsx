// App.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Hero from "./components/Hero";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Videos from "./pages/Videos";
import Articles from "./pages/Articles";
import ProtectedRoute from "./components/ProtectedRoute";
import FirstAidList from "./pages/FirstAidList";
import SymptomList from "./pages/SymptomChecker";
import Home from "./pages/Home";
import SkinDiagnosis from "./pages/SkinDiagnosis";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FindDoctor from "./pages/FindDoctor";
import Dashboard from "./pages/DashBoard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
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
      </Routes>
    </Router>
  );
}

export default App;
