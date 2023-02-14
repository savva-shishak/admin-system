import { createTheme, ThemeProvider } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ru } from 'date-fns/locale';
import DateFnsUtils from '@date-io/date-fns';
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App'
import './index.css'

ReactDOM
  .createRoot(document.getElementById('root') as HTMLElement)
  .render(
    <BrowserRouter>
      <MuiPickersUtilsProvider locale={ru} utils={DateFnsUtils}>
        <ThemeProvider theme={createTheme({
          palette: {
            primary: blue,
          }
        })}>
          <App />
        </ThemeProvider>
      </MuiPickersUtilsProvider>
    </BrowserRouter>
  );
