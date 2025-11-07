import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

const LoginPage = () => {
  const { register, handleSubmit, formState } = useForm<LoginForm>();
  const { login } = useAuth();

  const onSubmit = handleSubmit(async (data) => {
    await login(data.email, data.password);
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Entrar</h2>
        <p className="text-sm text-gray-500">Acesse sua conta para continuar</p>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium">E-mail</label>
          <input
            type="email"
            className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
            {...register('email', { required: 'Informe seu e-mail' })}
          />
          {formState.errors.email && (
            <p className="text-sm text-red-500 mt-1">{formState.errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Senha</label>
          <input
            type="password"
            className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
            {...register('password', { required: 'Informe sua senha' })}
          />
          {formState.errors.password && (
            <p className="text-sm text-red-500 mt-1">{formState.errors.password.message}</p>
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register('remember')} className="rounded border-gray-300" />
            Lembrar-me
          </label>
          <button type="button" className="text-primary hover:underline">
            Esqueci a senha
          </button>
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p className="text-sm text-center text-gray-500">
        Ainda não tem conta?{' '}
        <Link to="/registro" className="text-primary hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
