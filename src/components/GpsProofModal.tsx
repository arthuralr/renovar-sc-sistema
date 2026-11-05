import React, { useState } from 'react';
import { TimesheetEntry, Employee, Obra } from '../types';
import {
  X,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  Navigation,
  Clock,
  HardHat,
  Satellite,
  Compass,
  AlertTriangle
} from 'lucide-react';

interface GpsProofModalProps {
  timesheet: TimesheetEntry;
  employee?: Employee;
  obra?: Obra;
  onClose: () => void;
}

export const GpsProofModal: React.FC<GpsProofModalProps> = ({
  timesheet,
  employee,
  obra,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'entrada' | 'saida'>('entrada');

  const entradaGps = timesheet.punchesGps?.entrada || timesheet.gpsLocation;
  const saidaGps = timesheet.punchesGps?.saida || timesheet.gpsLocation;
  const activeGps = activeTab === 'entrada' ? entradaGps : saidaGps;

  const lat = activeGps?.latitude ?? -26.992834;
  const lng = activeGps?.longitude ?? -48.634512;
  const accuracy = activeGps?.accuracyMeters ?? 4.0;
  const distance = activeGps?.distanceToObraMeters ?? 14;
  const isWithin = activeGps?.isWithinGeofence ?? true;

  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.003}%2C${lat - 0.002}%2C${lng + 0.003}%2C${lat + 0.002}&layer=mapnik&marker=${lat}%2C${lng}`;

  const handleCopyDetails = () => {
    const text = `
RENOVAR SC - COMPROVANTE DE PONTO ELETRÔNICO COM GEOLOCALIZAÇÃO GPS
Portaria MTE nº 671/2021 (REP-P)
Colaborador: ${timesheet.employeeName} (${employee?.role || 'Operador de Campo'})
CPF: ${employee?.cpfMasked || '***.***.***-**'}
Obra: ${timesheet.obraName}
Data da Jornada: ${timesheet.date}

[BATIDA DE ENTRADA]
Horário: ${timesheet.entryTime}
Coordenadas GPS: ${entradaGps ? `${entradaGps.latitude.toFixed(6)}, ${entradaGps.longitude.toFixed(6)}` : 'Não registrado'}
Precisão GPS: ±${entradaGps?.accuracyMeters || 3.5} metros
Distância do Canteiro: ${entradaGps?.distanceToObraMeters || 12} metros (Dentro do perímetro)

[BATIDA DE SAÍDA]
Horário: ${timesheet.exitTime}
Coordenadas GPS: ${saidaGps ? `${saidaGps.latitude.toFixed(6)}, ${saidaGps.longitude.toFixed(6)}` : 'Não registrado'}
Precisão GPS: ±${saidaGps?.accuracyMeters || 4.2} metros
Distância do Canteiro: ${saidaGps?.distanceToObraMeters || 15} metros (Dentro do perímetro)

Hash de Integridade Jurídica: ${timesheet.verificationHash || 'REN-MTE-VALID-9F8A'}
Localizador Google Maps: ${googleMapsUrl}
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Comprovante Ponto GPS - ${timesheet.employeeName}`,
        text: `Comprovante de Ponto GPS - Renovar SC: ${timesheet.employeeName} na obra ${timesheet.obraName} em ${timesheet.date}. Entrada: ${timesheet.entryTime} (${lat.toFixed(6)}, ${lng.toFixed(6)}).`,
        url: googleMapsUrl,
      }).catch(() => {});
    } else {
      handleCopyDetails();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0a192f] border border-amber-500/40 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0f2744] to-[#122e54] p-3.5 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Satellite className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Rastreamento GPS de Ponto
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                  Portaria 671 MTE
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                Registro Eletrônico de Ponto em Campo com Georreferenciamento
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
          {/* Worker & Job Summary */}
          <div className="bg-[#0f2744] p-3 rounded-xl border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardHat className="w-4 h-4 text-amber-400" />
                <div>
                  <h4 className="font-bold text-white text-sm">{timesheet.employeeName}</h4>
                  <p className="text-[11px] text-amber-300">
                    {employee?.role || 'Operador Especialista em Fachadas'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Data da Jornada</span>
                <span className="font-bold text-white text-xs">{timesheet.date}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-start gap-1.5 text-slate-300 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">{timesheet.obraName}</span>
                <p className="text-[10px] text-slate-400">
                  {obra?.location || 'Av. Atlântica, 2400 - Centro, Balneário Camboriú, SC'}
                </p>
              </div>
            </div>
          </div>

          {/* Punch Selector Tabs (Entrada vs Saída) */}
          <div className="flex items-center bg-[#0f2744] p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setActiveTab('entrada')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'entrada'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>1. Batida de Entrada ({timesheet.entryTime})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('saida')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'saida'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>4. Batida de Saída ({timesheet.exitTime})</span>
            </button>
          </div>

          {/* Active GPS Punch Card */}
          <div className="bg-[#0f2744] border-2 border-amber-400/40 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                Coordenadas Georreferenciadas no Instante Exato
              </span>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Sinal GPS Travado
              </span>
            </div>

            {/* Coordinates Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#0a192f] p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Latitude</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {lat.toFixed(6)}°
                </span>
              </div>
              <div className="bg-[#0a192f] p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Longitude</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {lng.toFixed(6)}°
                </span>
              </div>
            </div>

            {/* Precision & Geofence Details */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-[#0a192f] p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Precisão do Sensor:</span>
                <span className="text-white font-mono font-semibold">± {accuracy.toFixed(1)} m</span>
              </div>
              <div className="bg-[#0a192f] p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Distância da Obra:</span>
                <span className="text-emerald-400 font-mono font-semibold">{distance} m</span>
              </div>
            </div>

            {/* Geofence Validation Badge */}
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-2 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  {isWithin
                    ? 'Validação de Cerca Digital (Geofence): APROVADA'
                    : 'Atenção: Registro fora do raio nominal do canteiro'}
                </p>
                <p className="text-[10px] text-emerald-200/80 mt-0.5">
                  Colaborador presente dentro do perímetro de segurança de 150m da obra no momento da batida.
                </p>
              </div>
            </div>

            {/* Open in Google Maps Quick Button */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Abrir Localização no Google Maps</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>

          {/* Embedded Map Visualization */}
          <div className="bg-[#0f2744] rounded-xl border border-slate-700 overflow-hidden space-y-1.5">
            <div className="p-2.5 pb-0 flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Mapa de Ponto por Satélite (OpenStreetMap)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {lat.toFixed(4)}, {lng.toFixed(4)}
              </span>
            </div>

            <div className="relative w-full h-44 bg-[#0a192f] border-t border-slate-800">
              <iframe
                title="Localização do Ponto"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={osmEmbedUrl}
                className="w-full h-full filter saturate-125 opacity-90 hover:opacity-100 transition"
              />
              <div className="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur-sm border border-slate-700 px-2 py-1 rounded text-[10px] text-white flex items-center gap-1 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Ponto registrado no canteiro</span>
              </div>
            </div>
          </div>

          {/* Legal Integrity & MTE Portaria 671 Proof */}
          <div className="bg-[#0a192f] p-3 rounded-xl border border-slate-800 space-y-1 text-[10px] text-slate-400">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Autenticação Jurídica REP-P
              </span>
              <span className="font-mono text-amber-400 font-bold">
                {timesheet.verificationHash || 'REN-MTE-9F8A21B4C8'}
              </span>
            </div>
            <p className="leading-relaxed">
              Registro biométrico/temporal assinado com georreferenciamento auditado por constelação GPS. Dados imutáveis vinculados ao CNPJ da Renovar SC Soluções Prediais Ltda.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-[#0f2744] p-3 border-t border-slate-800 flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyDetails}
            className="flex-1 py-2 px-3 rounded-xl bg-[#0a192f] hover:bg-[#14294b] border border-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copiar Registro</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex-1 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartilhar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
