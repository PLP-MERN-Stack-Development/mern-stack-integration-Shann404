import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { PostProvider } from "./context/PostProvider";


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <PostProvider>

    <BrowserRouter>
    <App />
    </BrowserRouter>
      </PostProvider>

  </StrictMode>,
)
