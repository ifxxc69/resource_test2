import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentsManagement from './components/StudentsManagement';
import StudentDetails from './components/StudentDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentsManagement />} />
        <Route path="/student" element={<StudentsManagement />} />
        <Route path="/student/:studentId" element={<StudentDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
