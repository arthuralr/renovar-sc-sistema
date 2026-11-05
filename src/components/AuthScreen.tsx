import React, { useState } from 'react';
import { User } from '../types';
import { DEMO_USERS } from '../data/initialData';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Fingerprint, Building2, CheckCircle2, AlertCircle } from 'lucide-react';

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
      // Find matching user or fallback to standard authenticated account
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
    <div className="min-h-screen bg-[#0a192f] text-slate-100 flex flex-col justify-between px-4 py-6 sm:py-10 max-w-md mx-auto relative overflow-hidden">
      {/* Decorative architectural ambient glow */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Branding Section with Official Renovar SC Logo */}
      <div className="text-center pt-3 z-10">
        <div className="inline-flex items-center justify-center p-1 rounded-2xl bg-white border-2 border-amber-500/60 shadow-xl shadow-amber-500/20 mb-3 overflow-hidden">
          <img
            src="/assets/aistudio/Logotipo_Renovar_51718f31.jpg"
            alt="Renovar SC"
            className="w-20 h-20 object-contain rounded-xl"
          />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
          RENOVAR <span className="text-amber-400">SC</span>
        </h1>
        <p className="text-xs uppercase font-bold tracking-widest text-amber-400/90 mt-0.5">
          Soluções Prediais
        </p>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
          Recuperação de Fachadas • Laudos Técnicos • Obras Corporativas
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full bg-[#0f2744]/90 border border-amber-500/25 rounded-2xl p-5 shadow-2xl backdrop-blur-md z-10 my-auto">
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-700/60">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Acesso Corporativo
            </h2>
            <p className="text-xs text-slate-400">Autenticação restrita a colaboradores autorizados</p>
          </div>
          <span className="text-[10px] font-semibold bg-amber-400/15 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
            SC-2026
          </span>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* E-mail / Usuário */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
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
                className="w-full pl-9 pr-3 py-2.5 bg-[#0a192f] border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Senha de Acesso</label>
              <span className="text-[11px] text-amber-400/80 hover:text-amber-300 cursor-pointer">
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
                className="w-full pl-9 pr-10 py-2.5 bg-[#0a192f] border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
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
          <div className="flex items-center justify-between pt-1">
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
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
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
            className="w-full py-2.5 rounded-xl bg-[#0a192f] hover:bg-[#14294b] border border-slate-700 hover:border-amber-400/50 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
          >
            <Fingerprint className={`w-4 h-4 ${isBiometricScanning ? 'text-amber-400 animate-pulse' : 'text-amber-400'}`} />
            <span>
              {isBiometricScanning ? 'Validando Face ID / Biometria...' : 'Acesso Rápido por Biometria / Touch ID'}
            </span>
          </button>
        </form>

        {/* Demo Fast Logins for Field Testing */}
        <div className="mt-5 pt-3.5 border-t border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <span>Acessos Rápidos de Demonstração:</span>
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            {DEMO_USERS.map((usr) => (
              <button
                key={usr.id}
                type="button"
                onClick={() => handleSelectDemoUser(usr)}
                className={`text-left px-2.5 py-1.5 rounded-lg border text-xs transition flex items-center justify-between cursor-pointer ${
                  email === usr.email
                    ? 'bg-amber-400/15 border-amber-400/50 text-amber-300 font-medium'
                    : 'bg-[#0a192f]/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="truncate mr-2">
                  <span className="font-semibold text-white">{usr.name}</span>
                  <span className="text-[11px] text-slate-400 block truncate">{usr.roleLabel}</span>
                </div>
                {email === usr.email && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Security Footer */}
      <div className="text-center pt-4 text-[11px] text-slate-500 z-10 space-y-1">
        <p className="flex items-center justify-center gap-1.5 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Ambiente Seguro • NR-35 / NR-18</span>
        </p>
        <p>© 2026 Renovar SC Soluções Prediais Ltda. Balneário Camboriú / Florianópolis</p>
      </div>
    </div>
  );
};
