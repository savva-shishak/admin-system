import "./Login.scss";
import { useFormik } from 'formik';
import { useState } from "react";
import { AuthSubmitType } from "./Login";

export function useLogin(onSubmit: AuthSubmitType) {
  const [accountExist, setAccountExist] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loginForm = useFormik({
    initialValues: {
      login: 'test login',
      password: 'test password',
    },
    onSubmit({ login, password }) {
      setLoading(true);
      onSubmit({ authCase: 'login', login, password })
        .then(() => setError('Не правильный логин или пароль'))
        .finally(() => setLoading(false));
    },
  });
  const registryForm = useFormik({
    initialValues: {
      name: '',
      avatar: '',
      login: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit({ name, avatar, login, password, confirmPassword }) {
      setLoading(true);
      onSubmit({ authCase: 'registry', name, avatar, login, password, confirmPassword })
        .then((err) => setError(err === 2 ? 'Пароли не совпадают' : 'Такой логин уже существует'))
        .finally(() => setLoading(false));
    },
  });

  return {
    loading,
    loginForm,
    registryForm,
    accountExist,
    error,
    toggleForm: () => {
      setError('');
      setAccountExist(v => !v);
    },
  }
}