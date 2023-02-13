import { Button } from '@material-ui/core';
import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import './App.css';
import { Page } from './components/Page';
import { Login } from './login/Login';

export const socket = io('http://localhost:8080');

function App() {
  const [openLeftMenu, setOpenLeftMenu] = useState(true);
  const [openLogin, setOpenLogin] = useState(!localStorage.getItem('token'));
  const [paths, setPaths] = useState<string[]>([]);
  const [menu, setMenu] = useState<{ title: string, icon?: string, path: string }[]>([]);
  const [content, setContent] = useState<any[]>([]);

  useEffect(() => {
    socket.on('auth-success', (token) => {
      localStorage.setItem('token', token)
      socket.emit('admin-message', { target: 'get-paths' });
      setOpenLogin(false);
    });
    socket.on('auth-error', () => {
      setOpenLogin(true);
      localStorage.removeItem('token');
    });

    socket.on('admin-message', ({ target, ...data }) => {
      if (target === 'paths') {
        setPaths(data.paths.map(({ path }: any) => path));
        setMenu(
          data
            .paths
            .filter((page: any) => page.menu)
            .map(({ menu, path }: any) => ({ ...menu, path }))
        );
      }
      if (target === 'page') {
        document.title = data.title;
        setContent(data.content);
      }
    });

    if (localStorage.getItem('token')) {
      socket.emit('auth', { authCase: 'token', token: localStorage.getItem('token') });
    }
  }, []);

  return (
    <div className="App">
      <div className="App__login" style={{ top: openLogin ? 0 : '-100vh' }}>
        <Login
          onSubmit={async (data) => {
            socket.emit('auth', data);

            return new Promise<number>((res) => socket.once('auth-error', res));
          }}  
         />
      </div>
      <div className="App__header">
        <div className="App__toggle-menu" onClick={() => setOpenLeftMenu(!openLeftMenu)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <Button 
          variant="text"
          type="button"
          style={{ color: 'white' }}
          onClick={() => {
            socket.emit('logout');
            setOpenLogin(true);
            localStorage.removeItem('token');
          }}
        >
          Выйти
        </Button>
      </div>
      <div className="App__left" style={{ width: openLeftMenu ? 200 : 0 }}>
        <div className="App__left-menu">
          {menu.map(({ title, icon, path }) => (
            <Link 
              className="App__left-menu-item"
              to={path}
              key={path}
            >
              {icon ? <img src={icon} /> : <div />}
              {title}
            </Link>
          ))}
        </div>
      </div>
      <div className="App__body">
        <Routes>
          {paths.map((path) => (
            <Route 
              key={path}
              path={path}
              element={<Page content={content} path={path} />}
            />
          ))}
        </Routes>
      </div>
    </div>
  )
}

export default App
