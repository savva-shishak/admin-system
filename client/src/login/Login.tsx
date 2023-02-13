import "./Login.scss";
import { useLogin } from "./useLogin";
import { Button, Card, CardContent, CardHeader, CircularProgress, TextField, Typography } from "@material-ui/core";

export type AuthSubmitType = ((data: any) => Promise<number>);
export function Login({ onSubmit }: { onSubmit: AuthSubmitType }) {
  const { loading, accountExist, loginForm, registryForm, toggleForm, error } = useLogin(onSubmit);

  if (loading) {
    return (
      <div className="Login__form">
        <Card>
          <CardContent>
            <CircularProgress />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <form 
      onSubmit={accountExist ? loginForm.handleSubmit : registryForm.handleSubmit} 
      className="Login__form"
    >
      <Card>
        {accountExist && (
          <CardContent style={{ display: 'flex', flexFlow: 'column nowrap' }}>
            <CardHeader title="Вход" style={{ textAlign: 'center' }} />
            <TextField label="Логин" type="text" {...loginForm.getFieldProps('login')} />
            <br />
            <TextField label="Пароль" type="password" {...loginForm.getFieldProps('password')} />
            <br />
            <Button 
              type="submit"
              color="primary"
              variant="contained"
              disabled={!loginForm.values.login || !loginForm.values.password}
            >
              Войти
            </Button>
            <br />
            <Button type="button" color="primary" variant="text" onClick={toggleForm}>Создать аккаунт</Button>
          </CardContent>
        )}
        {!accountExist && (
          <CardContent style={{ display: 'flex', flexFlow: 'column nowrap' }}>
            <CardHeader title="Регистрация" style={{ textAlign: 'center' }} />
            <div className="Login__row">
              <TextField label="Имя" type="text" {...registryForm.getFieldProps('name')} />
              <TextField label="Логин" type="text" {...registryForm.getFieldProps('login')} />
            </div>
            <br />
            <div className="Login__row">
              <TextField label="Пароль" type="password" {...registryForm.getFieldProps('password')} />
              <TextField label="Пароль повторно" type="password" {...registryForm.getFieldProps('confirmPassword')} />
            </div>
            <br />
            <TextField label="URL адрес аватара" type="url" {...registryForm.getFieldProps('avatar')} />
            <br />
            <Button 
              type="submit"
              color="primary"
              variant="contained"
              disabled={
                !registryForm.values.name 
                || !registryForm.values.login 
                || !registryForm.values.password 
                || !registryForm.values.confirmPassword
              }
            >
              Продолжить
            </Button>
            <br />
            <Button type="button" color="primary" variant="text" onClick={toggleForm}>Уже есть аккаунт</Button>
          </CardContent>
        )}
        <Typography style={{ color: 'red', padding: 10, display: 'block', textAlign: 'center' }}>{error}</Typography>
      </Card>
    </form>
  )
}