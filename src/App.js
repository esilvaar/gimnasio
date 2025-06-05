import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from './Components/LoginForm/LoginForm';
import UserPage from './Components/User/User';
import MannagerPage from './Components/Mannager/Mannager';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/mannager" element={<MannagerPage />} />
      </Routes>
    </Router>
  );
}

export default App;