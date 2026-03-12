import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'DoceKiosk - Sistema de Quiosque de Sobremesas Self-Service',
  description: 'Sistema completo de PDV, Financeiro e Estoque para quiosques de sobremesas self-service em shopping centers.',
  keywords: 'pdv, ponto de venda, quiosque, sobremesas, self-service, açaí, sorvete, estoque, financeiro',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
