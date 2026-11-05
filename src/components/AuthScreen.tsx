import React, { useState } from 'react';
import { User } from '../types';
import { DEMO_USERS } from '../data/initialData';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Fingerprint,
  Building2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Award,
} from 'lucide-react';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('gabriel@renovarsc.com.br');
  const [password, setPassword] = useState('renovar2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsAuthenticating(true);

    setTimeout(() => {
      const matched = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (password.length < 4) {
        setError('A senha corporativa deve conter no mínimo 4 caracteres.');
        setIsAuthenticating(false);
        return;
      }

      const authenticatedUser = matched || {
        id: 'usr-custom',
        name: 'Gabriel',
        email: email.trim(),
        role: 'gestor' as const,
        roleLabel: 'Gestão Operacional',
      };

      if (rememberMe) {
        localStorage.setItem('renovar_auth_user', JSON.stringify(authenticatedUser));
      }

      setIsAuthenticating(false);
      onLogin(authenticatedUser);
    }, 600);
  };

  const handleBiometricAuth = () => {
    setIsBiometricScanning(true);
    setError(null);

    setTimeout(() => {
      setIsBiometricScanning(false);
      const defaultUser = DEMO_USERS[0];
      if (rememberMe) {
        localStorage.setItem('renovar_auth_user', JSON.stringify(defaultUser));
      }
      onLogin(defaultUser);
    }, 1100);
  };

  const handleSelectDemoUser = (user: User) => {
    setEmail(user.email);
    setPassword('renovar2026');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0a192f] text-slate-100 flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-md md:max-w-5xl mx-auto relative overflow-hidden">
      <div className="my-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center z-10">
        {/* Left Branding & Corporate Showcase (Centered on Mobile, Left Panel on Notebooks & Desktop) */}
        <div className="md:col-span-6 text-center md:text-left space-y-5">
          <div className="inline-flex items-center justify-center p-1.5 rounded-xl bg-white border border-slate-800 overflow-hidden">
            <img
              src="/assets/aistudio/Logotipo_Renovar_51718f31.jpg"
              alt="Renovar SC"
              className="w-20 h-20 lg:w-24 lg:h-24 object-contain rounded-lg"
            />
          </div>

          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center justify-center md:justify-start gap-2">
              RENOVAR <span className="text-amber-400">SC</span>
            </h1>
            <p className="text-xs uppercase font-semibold tracking-widest text-amber-400 mt-1">
              Soluções Prediais • Engenharia & Gestão de Fachadas
            </p>
            <p className="text-xs lg:text-sm text-slate-300 mt-2.5 max-w-md mx-auto md:mx-0 leading-relaxed">
              Plataforma corporativa integrada para emissão de Memoriais Descritivos padrão ABNT, controle físico-financeiro, laudos periciais e gestão de canteiros em Santa Catarina.
            </p>
          </div>

          {/* Desktop & Notebook Engineering Highlights */}
          <div className="hidden md:grid grid-cols-1 gap-3.5 pt-2">
            <div className="bg-[#0f2744] border border-slate-800 rounded-xl p-4 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#0a192f] text-amber-400 flex items-center justify-center flex-shrink-0 border border-slate-800">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">
                  Memorial Descritivo Estruturado de Engenharia Civil
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Diagnóstico exato das patologias, metodologia executiva por fases, planilha de insumos, tabela de equipe e garantia de 05 anos para Contratantes.
                </p>
              </div>
            </div>

            <div className="bg-[#0f2744] border border-slate-800 rounded-xl p-4 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#0a192f] text-amber-400 flex items-center justify-center flex-shrink-0 border border-slate-800">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">
                  Conformidade Normativa ABNT NBR 13755, NBR 6118 & NR-35
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Controle de ponto GPS Portaria 671 MTE, cronograma físico-financeiro e faturamento NFS-e integrado.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Login Card */}
        <div className="md:col-span-6 w-full max-w-md mx-auto bg-[#0f2744] border border-slate-800 rounded-xl p-6 lg:p-7">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Acesso Corporativo
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Autenticação restrita a colaboradores autorizados
              </p>
            </div>
            <span className="text-[10px] font-semibold bg-[#0a192f] text-amber-400 border border-slate-800 px-2.5 py-0.5 rounded-full">
              SC-2026
            </span>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-[#0a192f] border border-amber-400/40 text-amber-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* E-mail / Usuário */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                E-mail ou Usuário Corporativo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="gabriel@renovarsc.com.br"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0a192f] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Senha de Acesso</label>
                <span className="text-[11px] text-amber-400 hover:underline cursor-pointer">
                  Esqueceu a senha?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-[#0a192f] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-[#0a192f]"
                />
                <span>Manter conectado neste dispositivo</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm tracking-wide transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isAuthenticating ? (
                <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Building2 className="w-4 h-4" />
                  <span>Entrar no Sistema</span>
                </>
              )}
            </button>

            {/* Biometric Unlock */}
            <button
              type="button"
              onClick={handleBiometricAuth}
              disabled={isBiometricScanning}
              className="w-full py-2.5 rounded-xl bg-[#0a192f] hover:bg-slate-800/80 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Fingerprint
                className={`w-4 h-4 text-amber-400 ${
                  isBiometricScanning ? 'animate-pulse' : ''
                }`}
              />
              <span>
                {isBiometricScanning
                  ? 'Validando Face ID / Biometria...'
                  : 'Acesso Rápido por Biometria / Touch ID'}
              </span>
            </button>
          </form>

          {/* Demo Fast Logins for Field Testing */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1">
              <span>Acessos Rápidos de Demonstração:</span>
            </p>
            <div className="grid grid-cols-1 gap-2">
              {DEMO_USERS.map((usr) => (
                <button
                  key={usr.id}
                  type="button"
                  onClick={() => handleSelectDemoUser(usr)}
                  className={`text-left px-3 py-2 rounded-lg border text-xs transition flex items-center justify-between cursor-pointer ${
                    email === usr.email
                      ? 'bg-amber-400/10 border-amber-400/40 text-amber-400 font-medium'
                      : 'bg-[#0a192f] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="font-semibold text-white">{usr.name}</span>
                    <span className="text-[11px] text-slate-400 block truncate">
                      {usr.roleLabel}
                    </span>
                  </div>
                  {email === usr.email && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Security Footer */}
      <div className="text-center pt-6 text-[11px] text-slate-500 z-10 space-y-1">
        <p className="flex items-center justify-center gap-1.5 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Ambiente Seguro • NR-35 / NR-18</span>
        </p>
        <p>© 2026 Renovar SC Soluções Prediais Ltda • CNPJ: 57.293.244/0001-27</p>
      </div>
    </div>
  );
};
