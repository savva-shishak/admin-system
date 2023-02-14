import { createTheme, ThemeProvider } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App'
import './index.css'

ReactDOM
  .createRoot(document.getElementById('root') as HTMLElement)
  .render(
    <BrowserRouter>
      <ThemeProvider theme={createTheme({
        palette: {
          primary: blue,
        }
      })}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  );
