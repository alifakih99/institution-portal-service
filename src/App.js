import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './identity/LoginPage'
import DashboardPage from './dashboard/DashboardPage';
import SaveInstitutionScreen from './dashboard/SaveInstitutionScreen';

function App() {
  const access_token_exist = localStorage.getItem("access_token");
  return (
    <Router>
      <Routes>
        <Route path="/" element={access_token_exist ? <DashboardPage /> : <LoginPage />} />
        <Route path="/institution" element={access_token_exist ? <SaveInstitutionScreen /> : <LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>

  );
}

export default App;
