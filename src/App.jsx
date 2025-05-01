// App.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Hero from "./components/Hero";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
// import SymptomChecker from "./pages/SymptomChecker";
import Articles from "./pages/Articles";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* <Route
          path="/symptom-checker"
          element={
            <ProtectedRoute>
              <SymptomChecker />
            </ProtectedRoute>
          }
        />
         */}
        <Route path="/articles" element={<Articles />} />
      </Routes>
    </Router>
  );
}

export default App;