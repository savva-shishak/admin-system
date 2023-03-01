import { Button, CircularProgress } from '@material-ui/core';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import './App.css';
import { Page } from './components/Page';
import { Login } from './login/Login';
import { v4 } from 'uuid';

export const socket = io('http://localhost:8080');

export function sendAction(actionId: string, params: any) {
  return new Promise((res) => {
    const id = v4();
    socket.emit('admin-message', { target: 'action', actionId, respondId: id, params })
    
    socket.on('admin-message', onAction)

    function onAction(data: any) {
      if (data.target === 'action' && data.action === id) {
        socket.off('admin-message', onAction);
        res(data.data);
      }
    }
  });
}

function App() {
  const [openLeftMenu, setOpenLeftMenu] = useState(true);
  const [openLogin, setOpenLogin] = useState(!localStorage.getItem('token'));
  const [paths, setPaths] = useState<string[]>([]);
  const [menu, setMenu] = useState<{ title: string, icon?: string, path: string }[]>([]);
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(!localStorage.getItem('token'))
  const navigate = useNavigate();
  const [title, setTitle] = useState('');

  useEffect(() => {
    socket.on('auth-success', (token) => {
      localStorage.setItem('token', token)
      socket.emit('admin-message', { target: 'get-paths' });
      setOpenLogin(false);
      setLoading(false);
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
        setTitle(data.title)
        setContent(data.content);
      }
      if (target === 'navigate') {
        navigate(data.href)
      }
      if (target === 'notify') {
        console.log(target);
        toast(data.message, data.options)
      }
    });

    socket.on('disconnect', () => {
      setLoading(true);
      setContent([]);
      setPaths([]);
    });

    socket.on('connect', () => {
      setLoading(false);
      if (localStorage.getItem('token')) {
        socket.emit('auth', { authCase: 'token', token: localStorage.getItem('token') });
      }
    });
  }, []);

  if (loading) {
    return <CircularProgress />
  }

  return (<>
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
        <div>
          {!!menu.length && (
            <div className="App__toggle-menu" onClick={() => setOpenLeftMenu(!openLeftMenu)}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          <div className='App__title'>
            {title}
          </div>
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
      <div className="App__left" style={{ width: openLeftMenu && menu.length ? 200 : 0 }}>
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
              element={<><Page content={content} path={path} /></>}
            />
          ))}
        </Routes>
      </div>
    </div>
    <ToastContainer />
  </>
  )
}

export default App
