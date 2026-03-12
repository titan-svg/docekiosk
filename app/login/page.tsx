'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { LogoIcon } from '@/components/Icons';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('E-mail ou senha inválidos');
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-3 mb-8">
            <LogoIcon className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-bold text-slate-800">DoceKiosk</h1>
              <p className="text-sm text-slate-500">Self-Service Sobremesas</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">Bem-vindo de volta!</h2>
          <p className="text-slate-500 mb-8">Entre com suas credenciais para acessar o sistema</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="********"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.p>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                />
                <span className="text-sm text-slate-600">Lembrar-me</span>
              </label>
              <Link
                href="/recuperar-senha"
                className="text-sm text-rose-500 hover:text-rose-600 font-medium"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed btn-press"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Usuários de demonstração:
            </p>
            <div className="mt-2 space-y-1 text-xs text-slate-400">
              <p>eduardo@docekiosk.com.br (Dono)</p>
              <p>ana.paula@docekiosk.com.br (Gerente)</p>
              <p>carlos@docekiosk.com.br (Operador)</p>
              <p className="text-slate-300">Use qualquer senha</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-rose-500 via-pink-500 to-amber-400 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-white"
        >
          <div className="w-32 h-32 mx-auto mb-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <LogoIcon className="w-20 h-20 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4">DoceKiosk</h2>
          <p className="text-xl text-white/90 mb-8">
            Sistema Integrado de PDV,<br />Financeiro e Estoque
          </p>
          <div className="space-y-4 text-white/80">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Vendas por peso e à la carte</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Controle financeiro completo</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Gestão inteligente de estoque</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Relatórios e tendências</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
