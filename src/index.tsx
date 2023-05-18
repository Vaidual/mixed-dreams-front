import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorPage from './components/pages/error/Error';
import Home from './components/pages/home/Home';
import Login from './components/pages/auth/login/Login';
import { StyledEngineProvider } from '@mui/material/styles';
import Contact from './components/pages/auth/register/contact/Contact';
import { FormProvider } from './hooks/useFormState';
import Business from './components/pages/auth/register/business/Business';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        index: true,
        element: <Home/>
      },
      {
        path: '/login',
        element: <Login/>
      },
      {
        path: '/signup',
        element: <Contact/>
      }
      ,
      {
        path: '/signup/business',
        element: <Business/>
      }
    ]
  }
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
    <FormProvider>
      <RouterProvider router={router}/>
    </FormProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
