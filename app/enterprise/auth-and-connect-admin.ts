import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { v4 } from 'uuid';
import { io } from '../context';
import { secretKey } from '../context/protect';
import { Admin } from '../lib/Admin';

export type User = {
  login: string;
  password: string;
  name: string;
  id: string;
  avatar: string | null;
}

export type ClientData = {
  socket: Socket;
  user: User;
}

export const admin = new Admin<ClientData>();

export const users: User[] = [
  {
    id: 'test',
    login: 'test login',
    password: 'test password',
    name: 'test name',
    avatar: null as string | null
  },
];

io.on('connection', (socket) => {
  socket.on('auth', ({ authCase, login, password, confirmPassword, name, avatar, token }) => {
    let user: User = null as any;

    if (authCase === 'login') {
      user = users.find((user) => user.login === login && user.password === password) as User;

      if (!user) {
        socket.emit('auth-error', 1);
        return;
      }
    } else if (authCase === 'token') {
      try {
        const { id } = verify(token, secretKey) as JwtPayload;

        user = users.find((user) => user.id === id) as User;

        if (!user) {
          throw new Error("Error");
        }

      } catch (err) {
        socket.emit('auth-error');
        return;
      }
    } else {
      if (confirmPassword !== password) {
        socket.emit('auth-error', 2);
        return;
      }
      if (users.some((user) => user.login === login)) {
        socket.emit('auth-error', 3);
        return;
      }
      user = {
        id: v4(),
        name,
        login,
        password,
        avatar,
      };

      users.push(user)
    }

    const client = admin.createClient(
      () => ({ user, socket }),
      (data) => socket.emit('admin-message', data)
    );

    socket.emit('auth-success', authCase === 'token' ? token : sign({ id: user.id, date: new Date() }, secretKey));

    function adminMessage(data: any) {
      client.emitMessage(data);
    }

    function logout() {
      socket.off('admin-message', adminMessage);
      socket.off('logout', logout)
    }

    socket.on('admin-message', adminMessage);
    socket.on('logout', logout);
  });
});
