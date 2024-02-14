import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './components/ErrorPage';
import Home from './components/Home';
import Register from './components/Register'
import Login from './components/Login';
import UserCompany from './components/UserCompany';
import ContactForm from './components/Contact';
import HistoryDocs from './components/History';
import { ConfirmationPage } from './components/ConfirmationPage';
import { UserVerifyPage } from './components/EmailVerify';
import { ForgotPassword, PasswordResetRequest, UpdatePassword } from './components/UpdatePassword';

const router = createBrowserRouter([
  {
    "path": "/",
    "element": <App />,
    "errorElement": <ErrorPage></ErrorPage>,

    "children": [
      { index: true, element: <Home /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/user_company", element: <UserCompany /> },
      { path: "/contact", element: <ContactForm /> },
      { path: "/history", element: <HistoryDocs /> },
      { path: "/update-password", element: <UpdatePassword /> },
      { path: "/password-reset-request", element: <PasswordResetRequest /> },
    ],
  },
  { path: "/confirmation", element: <ConfirmationPage /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/email-verification", element: <UserVerifyPage /> },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
