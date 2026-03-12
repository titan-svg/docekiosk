'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  LogoIcon,
  MenuIcon,
  XIcon,
  LogoutIcon,
  UserIcon,
  SettingsIcon,
  ChevronDownIcon,
} from './Icons';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-rose-100 shadow-sm">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <MenuIcon className="w-6 h-6" />
        </button>

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <LogoIcon className="w-8 h-8" />
          <span className="font-bold text-slate-800">DoceKiosk</span>
        </Link>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
              {user?.name.charAt(0)}
            </div>
            <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-rose-100 overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-rose-100">
                    <p className="text-sm font-medium text-slate-800">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-rose-100 text-rose-600 text-xs font-medium rounded-full capitalize">
                      {user?.role}
                    </span>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/configuracoes/usuarios"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      Meu Perfil
                    </Link>
                    <Link
                      href="/configuracoes"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <SettingsIcon className="w-4 h-4" />
                      Configurações
                    </Link>
                  </div>
                  <div className="border-t border-rose-100 py-1">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogoutIcon className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
