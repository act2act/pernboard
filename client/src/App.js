import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import LogIn from './pages/LogIn';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/login' element={<LogIn />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;