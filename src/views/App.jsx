import './App.scss';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles2 } from '../styles/GlobalStyles'
import { theme2 } from '../utils/constansts';
import React from 'react';
import { AuthProvider } from '../contexts/authContext';
import AppRoute from '../routes/AppRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className='app-container'>
      <ThemeProvider theme={theme2}>
        <GlobalStyles2 />
        <AuthProvider>
          <AppRoute />
        </AuthProvider>

        <ToastContainer position="top-right"
          autoClose={1800}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={true}
          theme="light"
          className={'col-6 col-sm-3'}
        />
      </ThemeProvider>
    </div>

  );
}

export default App;
