'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  TrendIcon,
  ChevronRightIcon,
  CalendarIcon,
  DownloadIcon,
  SalesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
} from '@/components/Icons';
import { getSalesTrend, getTopProducts, getPeakHours, formatCurrency } from '@/lib/data';

export default function RelatorioTendenciasPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [period, setPeriod] = useState('7days');

  const salesTrend = getSalesTrend();
  const topProducts = getTopProducts();
  const peakHours = getPeakHours();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleExportPDF = () => {
    alert('Exportando relatorio em PDF... (simulacao)');
  };

  const handleExportExcel = () => {
    alert('Exportando relatorio em Excel... (simulacao)');
  };

  // Seasonality mock data (monthly)
  const seasonalityData = [
    { month: 'Jan', revenue: 45000, growth: 12 },
    { month: 'Fev', revenue: 52000, growth: 15 },
    { month: 'Mar', revenue: 48000, growth: -8 },
    { month: 'Abr', revenue: 41000, growth: -15 },
    { month: 'Mai', revenue: 38000, growth: -7 },
    { month: 'Jun', revenue: 35000, growth: -8 },
    { month: 'Jul', revenue: 42000, growth: 20 },
    { month: 'Ago', revenue: 46000, growth: 10 },
    { month: 'Set', revenue: 51000, growth: 11 },
    { month: 'Out', revenue: 55000, growth: 8 },
    { month: 'Nov', revenue: 62000, growth: 13 },
    { month: 'Dez', revenue: 75000, growth: 21 },
  ];

  const maxSeasonalRevenue = Math.max(...seasonalityData.map(d => d.revenue));

  // Forecast mock data
  const forecastData = [
    { period: 'Proxima Semana', sales: 285, revenue: 12500, confidence: 85 },
    { period: 'Proximo Mes', sales: 1250, revenue: 54000, confidence: 72 },
    { period: 'Proximo Trimestre', sales: 3800, revenue: 165000, confidence: 60 },
  ];

  // Day of week performance
  const dayOfWeekData = [
    { day: 'Segunda', sales: 42, percentage: 65 },
    { day: 'Terca', sales: 48, percentage: 75 },
    { day: 'Quarta', sales: 52, percentage: 81 },
    { day: 'Quinta', sales: 55, percentage: 86 },
    { day: 'Sexta', sales: 68, percentage: 100 },
    { day: 'Sabado', sales: 85, percentage: 100 },
    { day: 'Domingo', sales: 72, percentage: 100 },
  ];

  const maxPeakSales = Math.max(...peakHours.map(h => h.sales));

  return (
    <div className="min-h-screen bg-pink-50">
      <Sidebar />

      <main className="lg:ml-[280px] p-4 lg:p-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-slate-500 mb-6"
        >
          <Link href="/relatorios/vendas" className="hover:text-rose-500 transition-colors">
            Relatorios
          </Link>
          <ChevronRightIcon className="w-4 h-4" />
          <span className="text-slate-800">Tendencias</span>
        </motion.div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Analise de Tendencias</h1>
            <p className="text-slate-500 mt-1">Sazonalidade, previsoes e padroes de consumo</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2"
          >
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <DownloadIcon className="w-5 h-5" />
              PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all"
            >
              <DownloadIcon className="w-5 h-5" />
              Excel
            </button>
          </motion.div>
        </div>

        {/* Period Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-rose-100 mb-6"
        >
          <div className="flex flex-wrap gap-2">
            {[
              { value: '7days', label: 'Ultimos 7 dias' },
              { value: '30days', label: 'Ultimos 30 dias' },
              { value: '90days', label: 'Ultimos 90 dias' },
              { value: '12months', label: 'Ultimos 12 meses' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setPeriod(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  period === option.value
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Seasonality Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 mb-6"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Sazonalidade Anual</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {seasonalityData.map((month, idx) => {
              const height = (month.revenue / maxSeasonalRevenue) * 100;
              const isHighSeason = month.revenue >= maxSeasonalRevenue * 0.8;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex justify-center relative group">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.4 + idx * 0.05 }}
                      className={`w-full max-w-10 rounded-t-lg cursor-pointer ${
                        isHighSeason
                          ? 'bg-gradient-to-t from-rose-500 to-pink-400'
                          : 'bg-gradient-to-t from-slate-300 to-slate-200'
                      }`}
                      style={{ height: `${height}%`, minHeight: '20px' }}
                    />
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      {formatCurrency(month.revenue)}
                      <span className={`ml-1 ${month.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ({month.growth >= 0 ? '+' : ''}{month.growth}%)
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{month.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-rose-500 to-pink-400 rounded"></div>
              <span className="text-sm text-slate-600">Alta temporada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-slate-300 to-slate-200 rounded"></div>
              <span className="text-sm text-slate-600">Temporada normal</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Peak Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center gap-2 mb-4">
              <ClockIcon className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg font-semibold text-slate-800">Horarios de Pico</h2>
            </div>
            <div className="h-48 flex items-end justify-between gap-1">
              {peakHours.map((hour, idx) => {
                const height = (hour.sales / maxPeakSales) * 100;
                const isPeak = hour.sales >= maxPeakSales * 0.8;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.5 + idx * 0.03 }}
                      className={`w-full rounded-t cursor-pointer ${
                        isPeak ? 'bg-rose-500' : 'bg-rose-200'
                      }`}
                      style={{ height: `${height}%`, minHeight: '8px' }}
                    />
                    <span className="text-[10px] text-slate-400">{hour.hour.split(':')[0]}h</span>
                    <div className="absolute bottom-full mb-1 hidden group-hover:block bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      {hour.sales} vendas
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-slate-500 mt-4 text-center">
              Pico de vendas entre 18h e 20h
            </p>
          </motion.div>

          {/* Day of Week Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg font-semibold text-slate-800">Desempenho por Dia da Semana</h2>
            </div>
            <div className="space-y-3">
              {dayOfWeekData.map((day, idx) => (
                <div key={day.day}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{day.day}</span>
                    <span className="font-medium text-slate-800">{day.sales} vendas</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${day.percentage}%` }}
                      transition={{ delay: 0.6 + idx * 0.05 }}
                      className={`h-full rounded-full ${
                        day.percentage >= 90
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500'
                          : day.percentage >= 70
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                          : 'bg-gradient-to-r from-slate-400 to-slate-300'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendIcon className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-semibold text-slate-800">Previsoes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {forecastData.map((forecast, idx) => (
              <motion.div
                key={forecast.period}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-100"
              >
                <p className="text-sm text-slate-500 mb-2">{forecast.period}</p>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(forecast.revenue)}</p>
                <p className="text-sm text-slate-600 mt-1">{forecast.sales} vendas estimadas</p>
                <div className="mt-3 pt-3 border-t border-rose-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Confianca</span>
                    <span className={`font-medium ${
                      forecast.confidence >= 80 ? 'text-green-600' :
                      forecast.confidence >= 60 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {forecast.confidence}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${forecast.confidence}%` }}
                      transition={{ delay: 0.8 + idx * 0.1 }}
                      className={`h-full rounded-full ${
                        forecast.confidence >= 80 ? 'bg-green-500' :
                        forecast.confidence >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Products Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <SalesIcon className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg font-semibold text-slate-800">Tendencia de Produtos</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">#</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Produto</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Vendas</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Receita</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Tendencia</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Grafico</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, idx) => {
                  const trends = ['+15%', '+8%', '-3%', '+12%', '+5%'];
                  const trend = trends[idx];
                  const isPositive = trend.startsWith('+');
                  // Simulated mini trend data
                  const miniTrend = [30, 45, 40, 55, 50, 65, 60];
                  const maxMini = Math.max(...miniTrend);

                  return (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + idx * 0.05 }}
                      className="border-b border-slate-50 hover:bg-pink-50/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center text-xs font-bold text-rose-600">
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">{product.name}</td>
                      <td className="py-3 px-4 text-center text-slate-600">{product.sales}</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-800">
                        {formatCurrency(product.revenue)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          {isPositive ? (
                            <ArrowUpIcon className="w-4 h-4 text-green-500" />
                          ) : (
                            <ArrowDownIcon className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`text-sm font-medium ${
                            isPositive ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {trend}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-end gap-0.5 h-6">
                          {miniTrend.map((value, i) => (
                            <motion.div
                              key={i}
                              initial={{ height: 0 }}
                              animate={{ height: `${(value / maxMini) * 100}%` }}
                              transition={{ delay: 0.9 + idx * 0.05 + i * 0.02 }}
                              className={`w-2 rounded-sm ${
                                isPositive ? 'bg-green-400' : 'bg-red-400'
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>&copy; 2026 DoceKiosk. Sistema de Gestao de Quiosques de Sobremesas.</p>
        </footer>
      </main>
    </div>
  );
}
