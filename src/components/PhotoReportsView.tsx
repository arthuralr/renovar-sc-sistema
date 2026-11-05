import React, { useState, useRef } from 'react';
import { PhotoReport, PathologyType, PathologySeverity } from '../types';
import {
  Camera,
  Image as ImageIcon,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  User,
  Filter,
  X,
  Share2,
  ZoomIn,
  ShieldAlert,
  Sparkles,
  Download
} from 'lucide-react';

interface PhotoReportsViewProps {
  reports: PhotoReport[];
  onAddReport: (report: PhotoReport) => void;
  onUpdateReportStatus: (id: string, newStatus: 'identificado' | 'em_tratamento' | 'recuperado') => void;
}

export const PhotoReportsView: React.FC<PhotoReportsViewProps> = ({
  reports,
  onAddReport,
  onUpdateReportStatus,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedReportDetail, setSelectedReportDetail] = useState<PhotoReport | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for new report
  const [newCondoName, setNewCondoName] = useState('Condomínio Royal Palace');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<PathologyType>('desplacamento');
  const [newLocationTag, setNewLocationTag] = useState('Torre A - Fachada Norte - 12º Andar');
  const [newSeverity, setNewSeverity] = useState<PathologySeverity>('critica');
  const [newDescription, setNewDescription] = useState('');
  const [newTechnicalDiagnosis, setNewTechnicalDiagnosis] = useState('');
  const [newIntervention, setNewIntervention] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories = [
    { key: 'todos', label: 'Todas' },
    { key: 'fissura', label: 'Fissuras' },
    { key: 'desplacamento', label: 'Desplacamentos' },
    { key: 'eflorescencia', label: 'Eflorescências' },
    { key: 'armadura', label: 'Armaduras' },
    { key: 'junta', label: 'Juntas' },
  ];

  const filteredReports = reports.filter((r) => {
    if (selectedCategory === 'todos') return true;
    return r.category === selectedCategory;
  });

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const categoryLabels: Record<PathologyType, string> = {
      fissura: 'Fissuras & Trincas',
      desplacamento: 'Desplacamento Cerâmico',
      eflorescencia: 'Eflorescência & Lixiviação',
      armadura: 'Armadura Exposta & Corrosão',
      junta: 'Juntas de Dilatação',
      infiltracao: 'Infiltração',
    };

    const newReport: PhotoReport = {
      id: `rep-${Date.now()}`,
      condoName: newCondoName,
      category: newCategory,
      categoryLabel: categoryLabels[newCategory] || 'Patologia Predial',
      title: newTitle || `Laudo de ${categoryLabels[newCategory]} - ${newLocationTag}`,
      description: newDescription || 'Registro fotográfico em campo durante inspeção rotineira de fachada.',
      technicalDiagnosis: newTechnicalDiagnosis || 'Degradação em estágio ativo detectada em ensaio visual e percussivo.',
      severity: newSeverity,
      locationTag: newLocationTag,
      imageUrl:
        photoPreview ||
        'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
      technician: 'Liomar Élísio da Silva',
      date: new Date().toISOString().split('T')[0],
      status: 'identificado',
      recommendedIntervention:
        newIntervention ||
        'Isolamento da área de circulação inferior e intervenção técnica com balancim elétrico.',
    };

    onAddReport(newReport);
    setShowAddModal(false);
    // Reset form
    setNewTitle('');
    setNewDescription('');
    setNewTechnicalDiagnosis('');
    setNewIntervention('');
    setPhotoPreview(null);
  };

  const getSeverityBadge = (sev: PathologySeverity) => {
    switch (sev) {
      case 'critica':
        return (
          <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 flex-shrink-0" />
            <span>CRÍTICA • Risco Iminente</span>
          </span>
        );
      case 'media':
        return (
          <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full">
            MÉDIA • Monitorar
          </span>
        );
      case 'leve':
        return (
          <span className="text-[10px] font-medium bg-slate-50 text-slate-500 border border-slate-200 px-2.5 py-0.5 rounded-full">
            LEVE • Preventiva
          </span>
        );
    }
  };

  const getStatusBadge = (status: PhotoReport['status']) => {
    switch (status) {
      case 'identificado':
        return (
          <span className="text-[10px] font-semibold bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600 flex-shrink-0" />
            <span>Identificado</span>
          </span>
        );
      case 'em_tratamento':
        return (
          <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600 flex-shrink-0" />
            <span>Em Tratamento</span>
          </span>
        );
      case 'recuperado':
        return (
          <span className="text-[10px] font-semibold bg-slate-100 text-[#0f172a] border border-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-amber-600 flex-shrink-0" />
            <span>Recuperado</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-nav">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#0f172a] flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-600" />
            Laudos Fotográficos de Fachada
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mapeamento de patologias, trincas e som cavo
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Novo Laudo</span>
        </button>
      </div>

      {/* Pathology Category Chips Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          const count =
            cat.key === 'todos'
              ? reports.length
              : reports.filter((r) => r.category === cat.key).length;

          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                isSelected
                  ? 'bg-[#0a192f] text-white border-[#0a192f] shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-[#0f172a] hover:bg-slate-50'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white font-bold' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Gallery Grid — 1 col on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            onClick={() => setSelectedReportDetail(report)}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden cursor-pointer transition group flex flex-col shadow-sm"
          >
            {/* Dedicated Card Header Bar — Badges outside photo to prevent any overlap */}
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex-shrink-0">
                {getSeverityBadge(report.severity)}
              </div>
              <div className="flex-shrink-0">
                {getStatusBadge(report.status)}
              </div>
            </div>

            {/* Unobstructed Pathology Photo — 100% Clean & Visible */}
            <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
              <img
                src={report.imageUrl}
                alt={report.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = '/assets/fissura-viga-rep02.jpg';
                }}
              />
            </div>

            {/* Dedicated Location & Date Bar below photo */}
            <div className="px-4 py-2 bg-slate-50 border-y border-slate-200 flex items-center justify-between gap-2 text-[11px] font-mono">
              <span className="text-slate-700 truncate flex items-center gap-1.5" title={report.locationTag}>
                <MapPin className="w-3 h-3 text-amber-600 flex-shrink-0" />
                <span className="truncate">{report.locationTag}</span>
              </span>
              <span className="flex-shrink-0 text-amber-700 font-bold">{report.date}</span>
            </div>

            {/* Content Details */}
            <div className="p-4 flex-1 flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                  {report.categoryLabel}
                </span>
                <h3
                  className="text-sm font-bold text-[#0f172a] leading-snug break-words"
                  title={report.title}
                >
                  {report.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed break-words">
                  {report.description}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 pt-3 border-t border-slate-100">
                <span className="text-[#0f172a] font-semibold truncate" title={report.condoName}>
                  {report.condoName}
                </span>
                <span className="text-amber-700 font-bold flex items-center gap-1 flex-shrink-0">
                  <ZoomIn className="w-3.5 h-3.5" />
                  Ver Laudo
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Report Lightbox Modal */}
      {selectedReportDetail && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl text-[#0f172a] max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-start justify-between gap-3 bg-slate-50">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  {getSeverityBadge(selectedReportDetail.severity)}
                  {getStatusBadge(selectedReportDetail.status)}
                </div>
                <h3 className="text-sm font-bold text-[#0f172a] leading-snug break-words">
                  {selectedReportDetail.title}
                </h3>
                <p className="text-xs text-amber-700 font-semibold mt-0.5 truncate">
                  {selectedReportDetail.condoName}
                </p>
              </div>
              <button
                onClick={() => setSelectedReportDetail(null)}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-[#0f172a] cursor-pointer flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3.5 overflow-y-auto">
              {/* High Res Picture with separated field coordinates bar */}
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={selectedReportDetail.imageUrl}
                    alt={selectedReportDetail.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = '/assets/fissura-viga-rep02.jpg';
                    }}
                  />
                </div>
                <div className="bg-slate-50 px-3 py-2 border-t border-slate-200 text-[11px] text-[#0f172a] font-mono flex flex-wrap items-center justify-between gap-2">
                  <span className="text-slate-600">GPS: -26.9924, -48.6347 (SC)</span>
                  <span className="text-amber-700 font-bold">{selectedReportDetail.locationTag}</span>
                </div>
              </div>

              {/* Diagnóstico Técnico */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] font-bold text-[#0a192f] uppercase tracking-wider block mb-1">
                  Diagnóstico Técnico Pericial
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {selectedReportDetail.technicalDiagnosis}
                </p>
              </div>

              {/* Recomendação de Intervenção */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] font-bold text-[#0a192f] uppercase tracking-wider block mb-1">
                  Intervenção & Metodologia de Reparo
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {selectedReportDetail.recommendedIntervention}
                </p>
              </div>

              {/* Metadata */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[10px]">Técnico / Fachadeiro:</span>
                  <span className="text-[#0f172a] font-bold flex items-center gap-1 mt-0.5">
                    <User className="w-3 h-3 text-amber-600" />
                    {selectedReportDetail.technician}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Data do Registro:</span>
                  <span className="text-[#0f172a] font-bold flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-amber-600" />
                    {selectedReportDetail.date}
                  </span>
                </div>
              </div>

              {/* Quick Status Update Buttons for Field Workers */}
              <div className="pt-1">
                <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                  Atualizar Status da Ocorrência:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      onUpdateReportStatus(selectedReportDetail.id, 'identificado');
                      setSelectedReportDetail({
                        ...selectedReportDetail,
                        status: 'identificado',
                      });
                    }}
                    className={`py-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      selectedReportDetail.status === 'identificado'
                        ? 'bg-[#0a192f] text-white border-[#0a192f] font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-[#0f172a]'
                    }`}
                  >
                    Identificado
                  </button>
                  <button
                    onClick={() => {
                      onUpdateReportStatus(selectedReportDetail.id, 'em_tratamento');
                      setSelectedReportDetail({
                        ...selectedReportDetail,
                        status: 'em_tratamento',
                      });
                    }}
                    className={`py-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      selectedReportDetail.status === 'em_tratamento'
                        ? 'bg-[#0a192f] text-white border-[#0a192f] font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-[#0f172a]'
                    }`}
                  >
                    Em Tratamento
                  </button>
                  <button
                    onClick={() => {
                      onUpdateReportStatus(selectedReportDetail.id, 'recuperado');
                      setSelectedReportDetail({
                        ...selectedReportDetail,
                        status: 'recuperado',
                      });
                    }}
                    className={`py-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      selectedReportDetail.status === 'recuperado'
                        ? 'bg-[#0a192f] text-white border-[#0a192f] font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-[#0f172a]'
                    }`}
                  >
                    Recuperado
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => {
                  const msg = `*LAUDO TÉCNICO FOTOGRÁFICO - RENOVAR SC*\n\n` +
                    `*Obra:* ${selectedReportDetail.condoName}\n` +
                    `*Patologia:* ${selectedReportDetail.categoryLabel}\n` +
                    `*Local:* ${selectedReportDetail.locationTag}\n` +
                    `*Diagnóstico:* ${selectedReportDetail.technicalDiagnosis}\n` +
                    `*Foto:* ${selectedReportDetail.imageUrl}`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Enviar Laudo (WhatsApp)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Report Modal (With Mobile Camera & Upload) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl text-[#0f172a] max-h-[92vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-600" />
                Novo Laudo Fotográfico de Campo
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-[#0f172a] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-4 space-y-3.5 overflow-y-auto">
              {/* Photo Input / Camera Trigger */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Foto da Patologia (Câmera ou Galeria)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />

                {photoPreview ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-[#0a192f]">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/70 text-white hover:bg-slate-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video rounded-xl border border-dashed border-slate-300 hover:border-[#0a192f] bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-[#0f172a] transition cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-full bg-white text-amber-600 flex items-center justify-center border border-slate-200 shadow-sm">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-[#0f172a]">
                      Tirar Foto com a Câmera ou Carregar Imagem
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Dispositivo móvel com geolocalização e carimbo de data
                    </span>
                  </button>
                )}
              </div>

              {/* Contratante / Obra */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contratante / Obra
                </label>
                <input
                  type="text"
                  value={newCondoName}
                  onChange={(e) => setNewCondoName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0f172a] focus:bg-white focus:outline-none focus:border-[#0a192f]"
                />
              </div>

              {/* Localização na Fachada */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Localização Específica na Fachada
                </label>
                <input
                  type="text"
                  value={newLocationTag}
                  onChange={(e) => setNewLocationTag(e.target.value)}
                  placeholder="Ex: Torre A - Fachada Norte - 14º Andar"
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0f172a] focus:bg-white focus:outline-none focus:border-[#0a192f]"
                />
              </div>

              {/* Tipo de Patologia */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Categoria da Patologia
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as PathologyType)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0f172a] focus:bg-white focus:outline-none focus:border-[#0a192f]"
                >
                  <option value="desplacamento">Desplacamento Cerâmico / Som Cavo</option>
                  <option value="fissura">Fissuras & Trincas Estruturais</option>
                  <option value="eflorescencia">Eflorescência & Lixiviação</option>
                  <option value="armadura">Armadura Exposta & Corrosão</option>
                  <option value="junta">Juntas de Dilatação Ressecadas</option>
                  <option value="infiltracao">Infiltração de Água Pluvial</option>
                </select>
              </div>

              {/* Gravidade */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nível de Severidade
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['leve', 'media', 'critica'] as PathologySeverity[]).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setNewSeverity(sev)}
                      className={`py-2 rounded-lg text-xs font-semibold border uppercase transition cursor-pointer ${
                        newSeverity === sev
                          ? 'bg-[#0a192f] text-white border-[#0a192f] font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-[#0f172a]'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diagnóstico Preliminar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Diagnóstico Técnico & Sintomas
                </label>
                <textarea
                  rows={2}
                  value={newTechnicalDiagnosis}
                  onChange={(e) => setNewTechnicalDiagnosis(e.target.value)}
                  placeholder="Ex: Ausência de juntas de dessolidarização causando empoleamento de cerâmicas..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0f172a] placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#0a192f] resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer shadow-sm"
              >
                Salvar Laudo Fotográfico
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
