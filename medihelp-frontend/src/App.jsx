import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import LanguageSelector from "./components/Languageselector";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <LanguageSelector />
      <AppRoutes />
      <Footer />
    </Router>
  );
}

export default App;