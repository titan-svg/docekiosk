'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogoIcon } from '@/components/Icons';

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simular envio de e-mail
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch {
      setError('Erro ao enviar e-mail. Tente novamente.');
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

          {!success ? (
            <>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Recuperar Senha</h2>
              <p className="text-slate-500 mb-8">
                Digite seu e-mail para receber as instrucoes de recuperacao
              </p>

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

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Enviando...
                    </span>
                  ) : (
                    'Enviar E-mail de Recuperacao'
                  )}
                </button>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="text-sm text-rose-500 hover:text-rose-600 font-medium"
                  >
                    Voltar para o Login
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">E-mail Enviado!</h2>
              <p className="text-slate-500 mb-8">
                Verifique sua caixa de entrada e siga as instrucoes para redefinir sua senha.
              </p>
              <Link
                href="/login"
                className="inline-block py-3 px-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all"
              >
                Voltar para o Login
              </Link>
            </motion.div>
          )}

          <p className="mt-8 text-center text-sm text-slate-400">
            Lembrou a senha?{' '}
            <Link href="/login" className="text-rose-500 hover:text-rose-600 font-medium">
              Fazer login
            </Link>
          </p>
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
            Recuperacao de Senha
          </p>
          <div className="space-y-4 text-white/80">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Verificacao segura por e-mail</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Link valido por 24 horas</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Suporte disponivel</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-4 left-0 right-0 text-center">
        <p className="text-sm text-slate-400">&copy; 2026 DoceKiosk. Todos os direitos reservados.</p>
      </div>
    </div>
  );
}
