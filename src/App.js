import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './identity/LoginPage'
import DashboardPage from './dashboard/DashboardPage';
import SaveInstitutionScreen from './dashboard/SaveInstitutionScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/institution" element={<SaveInstitutionScreen />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>

  );
}

export default App;
