import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const { register: registerField, handleSubmit, formState } = useForm<RegisterForm>();
  const { register } = useAuth();

  const onSubmit = handleSubmit(async (data) => {
    await register(data.name, data.email, data.password);
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Criar conta</h2>
        <p className="text-sm text-gray-500">Comece a planejar suas rotas inteligentes</p>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium">Nome</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
            {...registerField('name', { required: 'Informe seu nome' })}
          />
          {formState.errors.name && <p className="text-sm text-red-500 mt-1">{formState.errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">E-mail</label>
          <input
            type="email"
            className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
            {...registerField('email', { required: 'Informe seu e-mail' })}
          />
          {formState.errors.email && <p className="text-sm text-red-500 mt-1">{formState.errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Senha</label>
          <input
            type="password"
            className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
            {...registerField('password', { required: 'Crie uma senha' })}
          />
          {formState.errors.password && (
            <p className="text-sm text-red-500 mt-1">{formState.errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? 'Enviando...' : 'Criar conta'}
        </button>
      </form>
      <p className="text-sm text-center text-gray-500">
        Já possui conta?{' '}
        <Link to="/login" className="text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
