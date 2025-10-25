import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Navbar from './components/Navbar';
import PostList from './components/PostList';
import PostView from './components/PostView';
import PostForm from './components/PostForm';
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider } from "./context/AuthProvider";


function App() {
  

  return (
    <div className="min-h-screen bg-gray-900 text-gray-900">
          <AuthProvider>

    <Navbar/>

    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/view" element={<PostList />} />
        <Route path="/posts/:id" element={<PostView />} />
        <Route path="/create" element={<PostForm />} />
        <Route path="/edit/:id" element={<PostForm />} />
      </Routes>
    </AuthProvider>

    </div>
  ) 

}

export default App;