import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Signin from './components/login/signin.jsx';
import Signup from './components/signup/signup.jsx';
import About from './pages/about/about.jsx';
import Articles from "./pages/articles/articles.jsx"
import EmailConfirm from './components/confirmationemail/emailConfirm.jsx';
import EmailConfirm2 from './components/confirmationemail2/emailConfirm2.jsx';
import Addemail from './components/addemail/addemail.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { Toaster } from "react-hot-toast";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/addemail",
    element: <Addemail />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/confirmation",
    element: <EmailConfirm />,
  },
  {
    path: "/articles",
    element: <Articles />,
  },
  {
    path: "/confirmation2",
    element: <EmailConfirm2 />,
  },
 
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
     <RouterProvider router={router} />
     <Toaster position="top-right" />
     </AuthProvider>
   </React.StrictMode>
)
