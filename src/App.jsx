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
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/articles" element={<Articles />} />
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
      </Routes>
    </Router>
  );
}

export default App;
