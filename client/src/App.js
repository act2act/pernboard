import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import UserProfile from './pages/UserProfile';
import LogIn from './pages/LogIn';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/profile' element={<UserProfile />}  />
          <Route path='/login' element={<LogIn />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;