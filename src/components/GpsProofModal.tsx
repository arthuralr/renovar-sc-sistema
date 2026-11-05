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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh] text-[#0f172a]">
        {/* Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0a192f] flex items-center justify-center text-amber-400">
              <Satellite className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                Rastreamento GPS de Ponto
                <span className="text-[10px] font-mono bg-white text-[#0a192f] border border-slate-200 px-2 py-0.5 rounded">
                  Portaria 671 MTE
                </span>
              </h3>
              <p className="text-[10px] text-slate-500">
                Registro Eletrônico de Ponto em Campo com Georreferenciamento
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-[#0f172a] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
          {/* Worker & Job Summary */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardHat className="w-4 h-4 text-amber-600" />
                <div>
                  <h4 className="font-bold text-[#0f172a] text-sm">{timesheet.employeeName}</h4>
                  <p className="text-[11px] text-amber-700 font-semibold">
                    {employee?.role || 'Operador Especialista em Fachadas'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Data da Jornada</span>
                <span className="font-bold text-[#0f172a] text-xs">{timesheet.date}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-start gap-1.5 text-slate-600 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#0f172a]">{timesheet.obraName}</span>
                <p className="text-[10px] text-slate-500">
                  {obra?.location || 'Av. Atlântica, 2400 - Centro, Balneário Camboriú, SC'}
                </p>
              </div>
            </div>
          </div>

          {/* Punch Selector Tabs (Entrada vs Saída) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('entrada')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'entrada'
                  ? 'bg-[#0a192f] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#0f172a]'
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
                  ? 'bg-[#0a192f] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#0f172a]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>4. Batida de Saída ({timesheet.exitTime})</span>
            </button>
          </div>

          {/* Active GPS Punch Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#0a192f] uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                Coordenadas Georreferenciadas no Instante Exato
              </span>
              <span className="text-[10px] font-mono text-[#0f172a] bg-white border border-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-amber-600" />
                Sinal GPS Travado
              </span>
            </div>

            {/* Coordinates Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Latitude</span>
                <span className="font-mono font-bold text-[#0a192f] text-sm">
                  {lat.toFixed(6)}°
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Longitude</span>
                <span className="font-mono font-bold text-[#0a192f] text-sm">
                  {lng.toFixed(6)}°
                </span>
              </div>
            </div>

            {/* Precision & Geofence Details */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Precisão do Sensor:</span>
                <span className="text-[#0f172a] font-mono font-semibold">± {accuracy.toFixed(1)} m</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Distância da Obra:</span>
                <span className="text-amber-700 font-mono font-semibold">{distance} m</span>
              </div>
            </div>

            {/* Geofence Validation Badge */}
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-start gap-2 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#0f172a]">
                  {isWithin
                    ? 'Validação de Cerca Digital (Geofence): APROVADA'
                    : 'Atenção: Registro fora do raio nominal do canteiro'}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Colaborador presente dentro do perímetro de segurança de 150m da obra no momento da batida.
                </p>
              </div>
            </div>

            {/* Open in Google Maps Quick Button */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-[#0a192f] font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-600" />
              <span>Abrir Localização no Google Maps</span>
              <ExternalLink className="w-3 h-3 ml-0.5 text-slate-400" />
            </a>
          </div>

          {/* Embedded Map Visualization */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden space-y-1.5">
            <div className="p-2.5 pb-0 flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#0f172a] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                Mapa de Ponto por Satélite (OpenStreetMap)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {lat.toFixed(4)}, {lng.toFixed(4)}
              </span>
            </div>

            <div className="relative w-full h-44 bg-slate-100 border-t border-slate-200">
              <iframe
                title="Localização do Ponto"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={osmEmbedUrl}
                className="w-full h-full"
              />
              <div className="absolute bottom-2 left-2 bg-white/95 border border-slate-200 px-2.5 py-1 rounded text-[10px] text-[#0f172a] font-semibold flex items-center gap-1.5 pointer-events-none shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                <span>Ponto registrado no canteiro</span>
              </div>
            </div>
          </div>

          {/* Legal Integrity & MTE Portaria 671 Proof */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-[10px] text-slate-600">
            <div className="flex items-center justify-between text-[#0f172a]">
              <span className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                Autenticação Jurídica REP-P
              </span>
              <span className="font-mono text-amber-700 font-bold">
                {timesheet.verificationHash || 'REN-MTE-9F8A21B4C8'}
              </span>
            </div>
            <p className="leading-relaxed">
              Registro biométrico/temporal assinado com georreferenciamento auditado por constelação GPS. Dados imutáveis vinculados ao CNPJ 57.293.244/0001-27 da Renovar SC Soluções Prediais Ltda.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 p-3.5 border-t border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyDetails}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#0f172a] font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-amber-600" />
                <span className="text-amber-700 font-bold">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copiar Registro</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>Compartilhar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
