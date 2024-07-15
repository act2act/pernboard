import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import UserProfile from './pages/UserProfile';
import LogIn from './pages/LogIn';
import NewPost from './pages/NewPost';
import Post from './pages/Post';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/profile' element={<UserProfile />}  />
          <Route path='/login' element={<LogIn />} />
          <Route path='/posts/new' element={<NewPost />} />
          <Route path='/posts/:id' element={<Post />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;