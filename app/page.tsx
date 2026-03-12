'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogoIcon } from '@/components/Icons';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <LogoIcon className="w-20 h-20 animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">DoceKiosk</h1>
        <p className="text-slate-500">Carregando sistema...</p>
        <div className="mt-6 flex justify-center">
          <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
