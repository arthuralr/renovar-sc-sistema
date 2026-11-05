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
          <span className="text-[10px] font-bold bg-[#0f2744] text-amber-400 border border-amber-400/50 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
            <span>CRÍTICA • Risco Iminente</span>
          </span>
        );
      case 'media':
        return (
          <span className="text-[10px] font-semibold bg-[#0f2744] text-slate-200 border border-slate-700 px-2.5 py-0.5 rounded-full">
            MÉDIA • Monitorar
          </span>
        );
      case 'leve':
        return (
          <span className="text-[10px] font-medium bg-[#0f2744] text-slate-400 border border-slate-800 px-2.5 py-0.5 rounded-full">
            LEVE • Preventiva
          </span>
        );
    }
  };

  const getStatusBadge = (status: PhotoReport['status']) => {
    switch (status) {
      case 'identificado':
        return (
          <span className="text-[10px] font-semibold bg-[#0f2744] text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span>Identificado</span>
          </span>
        );
      case 'em_tratamento':
        return (
          <span className="text-[10px] font-semibold bg-[#0f2744] text-amber-400 border border-amber-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span>Em Tratamento</span>
          </span>
        );
      case 'recuperado':
        return (
          <span className="text-[10px] font-semibold bg-[#0f2744] text-white border border-slate-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span>Recuperado</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-nav">
      {/* View Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-400" />
            Laudos Fotográficos de Fachada
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Mapeamento de patologias, trincas e som cavo
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
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
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 border-amber-400'
                  : 'bg-[#0f2744] text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-[#0a192f] text-slate-400'
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
            className="bg-[#0f2744] border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden cursor-pointer transition group flex flex-col"
          >
            {/* Dedicated Card Header Bar — Badges outside photo to prevent any overlap */}
            <div className="px-4 py-2.5 bg-[#0a192f] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex-shrink-0">
                {getSeverityBadge(report.severity)}
              </div>
              <div className="flex-shrink-0">
                {getStatusBadge(report.status)}
              </div>
            </div>

            {/* Unobstructed Pathology Photo — 100% Clean & Visible */}
            <div className="relative aspect-[16/10] bg-[#081528] overflow-hidden">
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
            <div className="px-4 py-2 bg-[#0a192f] border-y border-slate-800 flex items-center justify-between gap-2 text-[11px] font-mono">
              <span className="text-slate-200 truncate flex items-center gap-1.5" title={report.locationTag}>
                <MapPin className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <span className="truncate">{report.locationTag}</span>
              </span>
              <span className="flex-shrink-0 text-amber-400 font-semibold">{report.date}</span>
            </div>

            {/* Content Details */}
            <div className="p-4 flex-1 flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">
                  {report.categoryLabel}
                </span>
                <h3
                  className="text-sm font-bold text-white leading-snug break-words"
                  title={report.title}
                >
                  {report.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed break-words">
                  {report.description}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 pt-3 border-t border-slate-800">
                <span className="text-white font-medium truncate" title={report.condoName}>
                  {report.condoName}
                </span>
                <span className="text-amber-400 font-semibold flex items-center gap-1 flex-shrink-0">
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-lg rounded-xl bg-[#0f2744] border border-slate-800 shadow-xl text-slate-100 max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-start justify-between gap-3 bg-[#0a192f]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  {getSeverityBadge(selectedReportDetail.severity)}
                  {getStatusBadge(selectedReportDetail.status)}
                </div>
                <h3 className="text-sm font-bold text-white leading-snug break-words">
                  {selectedReportDetail.title}
                </h3>
                <p className="text-xs text-amber-400 font-medium mt-0.5 truncate">
                  {selectedReportDetail.condoName}
                </p>
              </div>
              <button
                onClick={() => setSelectedReportDetail(null)}
                className="p-1.5 rounded-lg bg-[#0f2744] border border-slate-800 text-slate-400 hover:text-white cursor-pointer flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3.5 overflow-y-auto">
              {/* High Res Picture with separated field coordinates bar */}
              <div className="rounded-lg overflow-hidden border border-slate-800 bg-[#081528]">
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
                <div className="bg-[#0a192f] px-3 py-2 border-t border-slate-800 text-[11px] text-white font-mono flex flex-wrap items-center justify-between gap-2">
                  <span className="text-slate-300">GPS: -26.9924, -48.6347 (SC)</span>
                  <span className="text-amber-400 font-semibold">{selectedReportDetail.locationTag}</span>
                </div>
              </div>

              {/* Diagnóstico Técnico */}
              <div className="bg-[#0a192f] p-3.5 rounded-lg border border-slate-800 text-xs">
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                  Diagnóstico Técnico Pericial
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {selectedReportDetail.technicalDiagnosis}
                </p>
              </div>

              {/* Recomendação de Intervenção */}
              <div className="bg-[#0a192f] p-3.5 rounded-lg border border-slate-800 text-xs">
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                  Intervenção & Metodologia de Reparo
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {selectedReportDetail.recommendedIntervention}
                </p>
              </div>

              {/* Metadata */}
              <div className="bg-[#0a192f] p-3.5 rounded-lg border border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Técnico / Fachadeiro:</span>
                  <span className="text-white font-semibold flex items-center gap-1 mt-0.5">
                    <User className="w-3 h-3 text-amber-400" />
                    {selectedReportDetail.technician}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Data do Registro:</span>
                  <span className="text-white font-semibold flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    {selectedReportDetail.date}
                  </span>
                </div>
              </div>

              {/* Quick Status Update Buttons for Field Workers */}
              <div className="pt-1">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
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
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                        : 'bg-[#0a192f] border-slate-800 text-slate-400 hover:text-white'
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
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                        : 'bg-[#0a192f] border-slate-800 text-slate-400 hover:text-white'
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
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                        : 'bg-[#0a192f] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Recuperado
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-[#0a192f] border-t border-slate-800 flex gap-2">
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
                className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Enviar Laudo (WhatsApp)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Report Modal (With Mobile Camera & Upload) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-md rounded-xl bg-[#0f2744] border border-slate-800 shadow-xl text-slate-100 max-h-[92vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0a192f]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                Novo Laudo Fotográfico de Campo
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg bg-[#0f2744] border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-4 space-y-3.5 overflow-y-auto">
              {/* Photo Input / Camera Trigger */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-amber-400">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-slate-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video rounded-xl border border-dashed border-slate-700 hover:border-amber-400/50 bg-[#0a192f] flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#0f2744] text-amber-400 flex items-center justify-center border border-slate-800">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contratante / Obra
                </label>
                <input
                  type="text"
                  value={newCondoName}
                  onChange={(e) => setNewCondoName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#0a192f] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Localização na Fachada */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Localização Específica na Fachada
                </label>
                <input
                  type="text"
                  value={newLocationTag}
                  onChange={(e) => setNewLocationTag(e.target.value)}
                  placeholder="Ex: Torre A - Fachada Norte - 14º Andar"
                  required
                  className="w-full px-3 py-2 bg-[#0a192f] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Tipo de Patologia */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Categoria da Patologia
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as PathologyType)}
                  className="w-full px-3 py-2 bg-[#0a192f] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">
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
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                          : 'bg-[#0a192f] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diagnóstico Preliminar */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Diagnóstico Técnico & Sintomas
                </label>
                <textarea
                  rows={2}
                  value={newTechnicalDiagnosis}
                  onChange={(e) => setNewTechnicalDiagnosis(e.target.value)}
                  placeholder="Ex: Ausência de juntas de dessolidarização causando empoleamento de cerâmicas..."
                  className="w-full px-3 py-2 bg-[#0a192f] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition cursor-pointer"
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
