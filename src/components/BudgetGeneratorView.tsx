import React, { useState, useRef } from 'react';
import { BudgetProposal, ContractAcceptance } from '../types';
import { OfficialPdfModal } from './OfficialPdfModal';
import { notifyBudgetApproved } from '../services/notificationService';
import {
  generateLocalEngineeringBudget,
  ensureOfficialTemplateStructure,
} from '../utils/engineeringEngine';
import {
  Sparkles,
  Building2,
  MapPin,
  FileText,
  Copy,
  Check,
  Share2,
  Save,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  FolderOpen,
  PenTool,
  RotateCcw,
  ClipboardCheck,
  Award,
  Wrench,
  Layers,
  AlertTriangle,
} from 'lucide-react';

interface BudgetGeneratorViewProps {
  onSaveProposal?: (proposal: BudgetProposal) => void;
  savedProposals: BudgetProposal[];
}

export const BudgetGeneratorView: React.FC<BudgetGeneratorViewProps> = ({
  onSaveProposal,
  savedProposals,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'saved'>('create');

  // Form states (Dados Variáveis do Contratante / Condomínio)
  const [condoName, setCondoName] = useState('Condomínio Terraços da Brava');
  const [location, setLocation] = useState('Balneário Camboriú, SC');
  const [towers, setTowers] = useState<number>(2);
  const [floors, setFloors] = useState<number>(18);
  const [estimatedArea, setEstimatedArea] = useState<number>(4500);
  const [selectedPathologies, setSelectedPathologies] = useState<string[]>([
    'Desplacamento cerâmico / som cavo',
    'Fissuras e trincas de cisalhamento',
    'Armadura exposta com corrosão galvânica',
  ]);
  const [urgency, setUrgency] = useState<string>('Alta / Risco de Queda');
  const [notes, setNotes] = useState(
    'Inspeção visual preliminar apontou risco de desprendimento de pastilhas sobre área de acesso de pedestres e garagens.'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<BudgetProposal | null>(() =>
    generateLocalEngineeringBudget({
      condoName: 'Condomínio Terraços da Brava',
      location: 'Balneário Camboriú, SC',
      towers: 2,
      floors: 18,
      estimatedArea: 4500,
      pathologies: [
        'Desplacamento cerâmico / som cavo',
        'Fissuras e trincas de cisalhamento',
        'Armadura exposta com corrosão galvânica',
      ],
      urgency: 'Alta / Risco de Queda',
      notes:
        'Inspeção visual preliminar apontou risco de desprendimento de pastilhas sobre área de acesso de pedestres e garagens.',
    })
  );
  const [copySuccess, setCopySuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Digital Signature states
  const [clientSignName, setClientSignName] = useState('Roberto Albuquerque');
  const [clientSignRole, setClientSignRole] = useState('Contratante / Administrador Legal');
  const [clientSignCpf, setClientSignCpf] = useState('048.912.839-11');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const pathologyOptions = [
    'Desplacamento cerâmico / som cavo',
    'Fissuras e trincas de cisalhamento',
    'Armadura exposta com corrosão galvânica',
    'Eflorescência e lixiviação de carbonato',
    'Juntas de dilatação ressecadas / falhas',
    'Infiltração em marquises e sacadas',
    'Fuligem, mofo e fungos por maresia',
  ];

  const handleTogglePathology = (p: string) => {
    if (selectedPathologies.includes(p)) {
      setSelectedPathologies(selectedPathologies.filter((item) => item !== p));
    } else {
      setSelectedPathologies([...selectedPathologies, p]);
    }
  };

  const handleApplyPreset = (presetName: string) => {
    if (presetName === 'brava') {
      const pName = 'Condomínio Terraços da Brava';
      const pLoc = 'Balneário Camboriú, SC';
      const pTowers = 2;
      const pFloors = 18;
      const pArea = 4800;
      const pPathologies = [
        'Desplacamento cerâmico / som cavo',
        'Fissuras e trincas de cisalhamento',
        'Armadura exposta com corrosão galvânica',
      ];
      const pUrgency = 'Alta / Risco de Queda';
      const pNotes =
        'Inspeção visual preliminar apontou risco de desprendimento de pastilhas sobre área de acesso de pedestres e garagens.';
      setCondoName(pName);
      setLocation(pLoc);
      setTowers(pTowers);
      setFloors(pFloors);
      setEstimatedArea(pArea);
      setSelectedPathologies(pPathologies);
      setUrgency(pUrgency);
      setNotes(pNotes);
      setGeneratedProposal(
        generateLocalEngineeringBudget({
          condoName: pName,
          location: pLoc,
          towers: pTowers,
          floors: pFloors,
          estimatedArea: pArea,
          pathologies: pPathologies,
          urgency: pUrgency,
          notes: pNotes,
        })
      );
    } else if (presetName === 'itapema') {
      const pName = 'Residencial Golden Bay';
      const pLoc = 'Itapema, SC';
      const pTowers = 1;
      const pFloors = 14;
      const pArea = 2900;
      const pPathologies = [
        'Juntas de dilatação ressecadas / falhas',
        'Eflorescência e lixiviação de carbonato',
        'Fuligem, mofo e fungos por maresia',
      ];
      const pUrgency = 'Média';
      const pNotes =
        'Forte incidência de névoa salina costeira e ressecamento de mastique nas juntas horizontais entre o 6º e 14º pavimento.';
      setCondoName(pName);
      setLocation(pLoc);
      setTowers(pTowers);
      setFloors(pFloors);
      setEstimatedArea(pArea);
      setSelectedPathologies(pPathologies);
      setUrgency(pUrgency);
      setNotes(pNotes);
      setGeneratedProposal(
        generateLocalEngineeringBudget({
          condoName: pName,
          location: pLoc,
          towers: pTowers,
          floors: pFloors,
          estimatedArea: pArea,
          pathologies: pPathologies,
          urgency: pUrgency,
          notes: pNotes,
        })
      );
    } else if (presetName === 'florianopolis') {
      const pName = 'Edifício Solar dos Açores';
      const pLoc = 'Florianópolis, SC';
      const pTowers = 1;
      const pFloors = 8;
      const pArea = 1600;
      const pPathologies = [
        'Fissuras e trincas de cisalhamento',
        'Infiltração em marquises e sacadas',
      ];
      const pUrgency = 'Normal';
      const pNotes =
        'Necessidade de estanqueidade nos peitoris das janelas e revitalização com membrana acrílica elastomérica.';
      setCondoName(pName);
      setLocation(pLoc);
      setTowers(pTowers);
      setFloors(pFloors);
      setEstimatedArea(pArea);
      setSelectedPathologies(pPathologies);
      setUrgency(pUrgency);
      setNotes(pNotes);
      setGeneratedProposal(
        generateLocalEngineeringBudget({
          condoName: pName,
          location: pLoc,
          towers: pTowers,
          floors: pFloors,
          estimatedArea: pArea,
          pathologies: pPathologies,
          urgency: pUrgency,
          notes: pNotes,
        })
      );
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setCopySuccess(false);
    setSaveSuccess(false);

    const startTime = Date.now();

    try {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 1200);

      const res = await fetch('/api/gemini/generate-budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          condoName,
          location,
          towers,
          floors,
          estimatedArea,
          pathologies: selectedPathologies,
          urgency,
          notes,
        }),
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const fullProposal = ensureOfficialTemplateStructure({
            ...json.data,
            id: `prop-${Date.now()}`,
            condoName,
            location,
            towers,
            floors,
            estimatedArea,
            pathologies: selectedPathologies,
            urgency,
            notes,
            createdAt: new Date().toISOString(),
          });
          setGeneratedProposal(fullProposal);
          return;
        }
      }
      throw new Error('Template oficial local ativado');
    } catch {
      const elapsed = Date.now() - startTime;
      if (elapsed < 550) {
        await new Promise((r) => setTimeout(r, 550 - elapsed));
      }

      const simulatedProposal = generateLocalEngineeringBudget({
        condoName,
        location,
        towers,
        floors,
        estimatedArea,
        pathologies: selectedPathologies,
        urgency,
        notes,
      });

      setGeneratedProposal(simulatedProposal);
    } finally {
      setIsLoading(false);
    }
  };

  // Canvas drawing functions for digital signature
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0a192f';
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if ('touches' in e) {
      e.preventDefault();
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleApproveContract = () => {
    if (!generatedProposal) return;
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) {
      alert('Por favor, desenhe sua assinatura no campo indicado antes de aprovar o contrato.');
      return;
    }

    const signatureDataUrl = canvas.toDataURL('image/png');
    const hash = `RSC-VAL-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}-${new Date().getFullYear()}`;

    const acceptance: ContractAcceptance = {
      signed: true,
      clientName: clientSignName || 'Representante Legal',
      clientRole: clientSignRole || 'Contratante / Responsável',
      clientDocument: clientSignCpf || '000.000.000-00',
      signedAt: new Date().toISOString(),
      signatureDataUrl,
      protocolHash: hash,
    };

    const updatedProposal: BudgetProposal = {
      ...generatedProposal,
      contractAcceptance: acceptance,
    };

    setGeneratedProposal(updatedProposal);

    if (onSaveProposal) {
      onSaveProposal(updatedProposal);
    }

    notifyBudgetApproved(updatedProposal);
  };

  const activeProposal = generatedProposal
    ? ensureOfficialTemplateStructure(generatedProposal)
    : null;

  const handleCopyClipboard = () => {
    if (!activeProposal) return;
    const textToCopy = `
======================================================================
RENOVAR SC — SOLUÇÕES PREDIAIS LTDA (CNPJ: 34.819.520/0001-90)
${activeProposal.title}
======================================================================
Protocolo Oficial: ${activeProposal.protocol}
Contratante / Cliente: ${activeProposal.condoName}
Localização / Município: ${activeProposal.location}
Configuração / Porte: ${activeProposal.towers} Torre(s) | ${activeProposal.floors} Pavimentos | ${activeProposal.estimatedArea.toLocaleString('pt-BR')} m²
Enquadramento Ambiental: ${activeProposal.environmentalClassification || 'Classe III/IV - ABNT NBR 6118'}
Grau de Risco / Urgência: ${activeProposal.urgency}

1. OBJETO E ESCOPO TÉCNICO DO MEMORIAL DESCRITIVO:
${activeProposal.scopeDeclaration}

Síntese de Vistoria:
${activeProposal.executiveSummary}

2. DIAGNÓSTICO PERICIAL EXATO DAS PATOLOGIAS INFORMADAS:
${(activeProposal.pathologyDiagnostics || [])
  .map(
    (d) =>
      `[${d.code}] ${d.pathology} (${d.severityLabel})\n   • Mecanismo: ${d.technicalOrigin}\n   • Risco: ${d.riskImpact}\n   • Terapia Normativa: ${d.normativeTherapy}`
  )
  .join('\n\n')}

3. METODOLOGIA EXECUTIVA POR ETAPAS (PADRÃO RENOVAR SC):
${activeProposal.methodologyHighlights
  .map(
    (m) =>
      `${m.phaseCode || `ETAPA 0${m.step}`} — ${m.title} [${m.technicalStandard || 'ABNT/NR'}]\n   ${m.detail}`
  )
  .join('\n\n')}

4. NORMAS TÉCNICAS E ESPECIFICAÇÃO DE MATERIAIS HOMOLOGADOS:
- ${activeProposal.norms.join('\n- ')}

Insumos Especificados:
- ${(activeProposal.materialSpecifications || []).join('\n- ')}

5. PLANILHA ORÇAMENTÁRIA ANALÍTICA E DISCRIMINADA:
${activeProposal.services
  .map(
    (s) =>
      `• ${s.code} - ${s.description}\n  Procedimento: ${s.methodology}\n  Quant.: ${s.quantity.toLocaleString('pt-BR')} ${s.unit} x R$ ${s.unitPrice.toFixed(2)} = R$ ${s.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  )
  .join('\n\n')}

RESUMO DO INVESTIMENTO:
Subtotal Direto (Mão de Obra, Balancins e Insumos): R$ ${activeProposal.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
BDI Corporativo, Seguros, ART/CREA-SC e Encargos (${activeProposal.bdiPercent}%): R$ ${(activeProposal.totalPrice - activeProposal.subtotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
VALOR GLOBAL PROPOSTO: R$ ${activeProposal.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

6. GARANTIAS CONTRATUAIS E CONDIÇÕES COMERCIAIS:
${(activeProposal.warrantyClauses || [])
  .map((w) => `• ${w.category}: ${w.period} (${w.normReference}) — ${w.coverageDescription}`)
  .join('\n')}

Prazo de Execução: ${activeProposal.timelineWeeks} semanas
Garantia Contratual Global: ${activeProposal.warrantyYears} anos (Art. 618 Código Civil / ABNT NBR 15575)
Condições de Pagamento: ${activeProposal.paymentConditions}
Responsabilidade Técnica: ${activeProposal.technicalResponsible}
${
  activeProposal.contractAcceptance?.signed
    ? `\nCONTRATO HOMOLOGADO DIGITALMENTE PELO CONTRATANTE: ${activeProposal.contractAcceptance.clientName} (Hash: ${activeProposal.contractAcceptance.protocolHash})`
    : ''
}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const handleWhatsAppShare = () => {
    if (!activeProposal) return;
    const msg =
      `*RENOVAR SC — MEMORIAL DESCRITIVO & PROPOSTA TÉCNICA OFICIAL*\n\n` +
      `*Protocolo:* ${activeProposal.protocol}\n` +
      `*Contratante / Cliente:* ${activeProposal.condoName}\n` +
      `*Localização:* ${activeProposal.location}\n` +
      `*Porte:* ${activeProposal.towers} Torre(s) • ${activeProposal.floors} Pavimentos (${activeProposal.estimatedArea.toLocaleString('pt-BR')} m²)\n` +
      `*Patologias Diagnosticadas:* ${activeProposal.pathologies.join(', ')}\n` +
      `*Investimento Global Proposto:* R$ ${activeProposal.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` +
      `*Prazo de Execução:* ${activeProposal.timelineWeeks} semanas | *Garantia Contratual:* ${activeProposal.warrantyYears} anos\n` +
      (activeProposal.contractAcceptance?.signed
        ? `*Status:* Homologado Digitalmente pelo Contratante (${activeProposal.contractAcceptance.protocolHash})\n\n`
        : `\n`) +
      `_Memorial Descritivo de Engenharia Civil elaborado pela Renovar SC conforme ABNT NBR 13755, NBR 6118, NBR 15575 e NR-35._`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleSaveToHistory = () => {
    if (!activeProposal) return;
    if (onSaveProposal) {
      onSaveProposal(activeProposal);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className="space-y-4 lg:space-y-6 pb-nav lg:pb-6">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0f2744]/80 border border-amber-500/20 rounded-2xl p-3.5 lg:p-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base lg:text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-amber-400" />
              Memorial Descritivo & Orçamento Oficial IA
            </h2>
            <span className="hidden sm:inline-flex text-[10px] font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
              Template Estruturado Padrão Renovar SC
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Estrutura normativa fixa de engenharia civil com injeção automática de parâmetros do Contratante / Cliente
          </p>
        </div>

        {/* Sub tabs */}
        <div className="flex items-center bg-[#0a192f] p-1 rounded-xl border border-slate-700/80">
          <button
            onClick={() => setActiveSubTab('create')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeSubTab === 'create'
                ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Gerador & Memorial
          </button>
          <button
            onClick={() => setActiveSubTab('saved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeSubTab === 'saved'
                ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Salvos ({savedProposals.length})</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'saved' ? (
        /* Saved Proposals Tab — Responsive Grid on Desktop */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {savedProposals.length === 0 ? (
            <div className="col-span-full bg-[#0f2744] border border-slate-800 rounded-2xl p-8 text-center text-slate-400 space-y-2 max-w-lg mx-auto">
              <FileText className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-white">Nenhum memorial/orçamento salvo ainda</p>
              <p className="text-xs">
                Preencha os dados variáveis do Contratante / Obra e gere o Memorial Descritivo Oficial para salvar no acervo.
              </p>
              <button
                onClick={() => setActiveSubTab('create')}
                className="mt-3 px-4 py-2 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Abrir Gerador de Memorial
              </button>
            </div>
          ) : (
            savedProposals.map((rawProp) => {
              const prop = ensureOfficialTemplateStructure(rawProp);
              return (
                <div
                  key={prop.id}
                  onClick={() => {
                    setGeneratedProposal(prop);
                    setActiveSubTab('create');
                  }}
                  className="bg-[#0f2744] hover:bg-[#14294b] border border-slate-700 hover:border-amber-400/50 rounded-2xl p-4 cursor-pointer transition shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-1.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">
                            {prop.protocol}
                          </span>
                          {prop.contractAcceptance?.signed && (
                            <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                              Homologado
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1.5">{prop.condoName}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          {prop.location}
                        </p>
                      </div>
                      <span className="text-sm font-black text-emerald-400">
                        {formatCurrency(prop.totalPrice)}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 mt-2 bg-[#0a192f] p-2.5 rounded-lg line-clamp-3 border border-slate-800">
                      {prop.executiveSummary}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2.5 border-t border-slate-800">
                    <span>
                      {prop.towers} torre(s) • {prop.floors} pav. ({prop.estimatedArea.toLocaleString('pt-BR')} m²)
                    </span>
                    <span className="text-amber-300 font-semibold">Abrir Memorial Completo →</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Desktop 2-Column Split Workstation & Mobile Single-Column Flow */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* LEFT COLUMN: Variable Input Parameters & Presets */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-3.5 lg:sticky lg:top-20">
            {/* Quick Presets for Field Engineers */}
            <div className="bg-[#0f2744] border border-slate-700/80 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Modelos Rápidos de Canteiro (SC):
                </span>
                <span className="text-[10px] text-slate-400">1 clique</span>
              </div>
              <div className="flex lg:grid lg:grid-cols-1 xl:grid-cols-3 items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleApplyPreset('brava')}
                  className="flex-shrink-0 px-2.5 py-1.5 rounded-xl bg-[#0a192f] border border-slate-700 hover:border-amber-400/60 text-[11px] text-slate-200 font-medium cursor-pointer transition text-left"
                >
                  🏢 Terraços da Brava (2T • 18 and.)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('itapema')}
                  className="flex-shrink-0 px-2.5 py-1.5 rounded-xl bg-[#0a192f] border border-slate-700 hover:border-amber-400/60 text-[11px] text-slate-200 font-medium cursor-pointer transition text-left"
                >
                  🌊 Golden Bay (1T • 14 and.)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('florianopolis')}
                  className="flex-shrink-0 px-2.5 py-1.5 rounded-xl bg-[#0a192f] border border-slate-700 hover:border-amber-400/60 text-[11px] text-slate-200 font-medium cursor-pointer transition text-left"
                >
                  🏝️ Solar dos Açores (1T • 8 and.)
                </button>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleGenerate}
              className="bg-[#0f2744] border border-amber-500/25 rounded-2xl p-4 lg:p-5 shadow-xl space-y-3.5"
            >
              <div className="border-b border-slate-700/80 pb-2.5 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  Dados Variáveis do Contratante & Obra
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Template Fixo ABNT
                </span>
              </div>

              {/* Nome do Contratante */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nome do Contratante / Cliente / Edificação
                </label>
                <input
                  type="text"
                  value={condoName}
                  onChange={(e) => setCondoName(e.target.value)}
                  required
                  placeholder="Ex: Condomínio Residencial Atlântico"
                  className="w-full px-3 py-2 bg-[#0a192f] border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Localização / Cidade */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Localização / Município (SC)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    placeholder="Ex: Balneário Camboriú, SC"
                    className="w-full pl-9 pr-3 py-2 bg-[#0a192f] border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Torres, Pavimentos e Área */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Torres / Blocos
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={towers}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 1;
                      setTowers(val);
                      setEstimatedArea(val * floors * 130);
                    }}
                    className="w-full px-2.5 py-2 bg-[#0a192f] border border-slate-700 rounded-xl text-sm text-white text-center font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Pavimentos
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="80"
                    value={floors}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 1;
                      setFloors(val);
                      setEstimatedArea(towers * val * 130);
                    }}
                    className="w-full px-2.5 py-2 bg-[#0a192f] border border-slate-700 rounded-xl text-sm text-white text-center font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 truncate">
                    Área Fachada (m²)
                  </label>
                  <input
                    type="number"
                    step="50"
                    value={estimatedArea}
                    onChange={(e) => setEstimatedArea(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-2.5 py-2 bg-[#0a192f] border border-slate-700 rounded-xl text-sm text-amber-400 text-center font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Patologias Identificadas */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Patologias Informadas para o Diagnóstico</span>
                  <span className="text-[10px] text-amber-400 font-bold">
                    {selectedPathologies.length} selecionada(s)
                  </span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {pathologyOptions.map((pathology) => {
                    const isSelected = selectedPathologies.includes(pathology);
                    return (
                      <button
                        key={pathology}
                        type="button"
                        onClick={() => handleTogglePathology(pathology)}
                        className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition text-left cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-semibold'
                            : 'bg-[#0a192f] border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {pathology}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grau de Urgência */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Grau de Risco / Prioridade Técnica
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Normal', 'Média', 'Alta / Risco de Queda'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setUrgency(level)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition text-center cursor-pointer ${
                        urgency === level
                          ? level === 'Alta / Risco de Queda'
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                            : 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                          : 'bg-[#0a192f] border-slate-700 text-slate-400'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Observações de Campo */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Observações de Vistoria e Particularidades
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Necessidade de tela fachadeira reforçada sobre área de lazer e garagens..."
                  className="w-full px-3 py-2 bg-[#0a192f] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || selectedPathologies.length === 0}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/20 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Injetando Dados no Memorial Oficial...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Gerar Memorial Descritivo & Orçamento IA</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN: Official Structured Engineering Memorial & Budget Document */}
          <div className="lg:col-span-7 xl:col-span-8">
            {activeProposal && (
              <div className="bg-[#0f2744] border-2 border-amber-400/40 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Official Document Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-700/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-black bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded">
                        PROTOCOLO: {activeProposal.protocol}
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                        MODELO OFICIAL DE ENGENHARIA CIVIL
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Garantia Contratual: {activeProposal.warrantyYears} anos (Art. 618 CC)
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white mt-1.5 leading-snug">
                      {activeProposal.title}
                    </h3>
                    <p className="text-xs text-amber-300 font-semibold">
                      Contratante / Cliente: {activeProposal.condoName} • {activeProposal.location}
                    </p>
                  </div>

                  <div className="bg-[#0a192f] border border-amber-500/30 rounded-xl px-3.5 py-2 sm:text-right flex-shrink-0">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Investimento Global
                    </span>
                    <span className="text-base sm:text-lg font-black text-amber-400 font-mono">
                      {formatCurrency(activeProposal.totalPrice)}
                    </span>
                    <span className="text-[10px] text-emerald-400 block">
                      Prazo: {activeProposal.timelineWeeks} semanas
                    </span>
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowPdfModal(true)}
                    className="col-span-2 sm:col-span-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition cursor-pointer hover:brightness-105"
                  >
                    <FileText className="w-4 h-4 text-slate-950" />
                    <span>Exportar PDF Oficial</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyClipboard}
                    className="py-2.5 px-2.5 rounded-xl bg-[#0a192f] border border-slate-700 hover:border-amber-400/50 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    title="Copiar memorial completo formatado"
                  >
                    {copySuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Memorial Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Copiar Memorial</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="py-2.5 px-2.5 rounded-xl bg-[#0a192f] border border-slate-700 hover:border-emerald-500/50 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Enviar WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveToHistory}
                    className="py-2.5 px-2.5 rounded-xl bg-[#0a192f] border border-slate-700 hover:border-amber-400/50 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    {saveSuccess ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Salvo no Acervo</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5 text-amber-400" />
                        <span>Salvar Proposta</span>
                      </>
                    )}
                  </button>
                </div>

                {/* QUADRO I: Dados Técnicos Injetados do Empreendimento */}
                <div className="bg-[#0a192f] p-3.5 rounded-xl border border-amber-500/25 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      Quadro Técnico do Empreendimento (Parâmetros Injetados)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      CREA-SC • ABNT
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs pt-1">
                    <div className="bg-[#0f2744]/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Contratante / Cliente</span>
                      <span className="font-bold text-white truncate block" title={activeProposal.condoName}>
                        {activeProposal.condoName}
                      </span>
                    </div>
                    <div className="bg-[#0f2744]/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Localização</span>
                      <span className="font-bold text-white truncate block" title={activeProposal.location}>
                        {activeProposal.location}
                      </span>
                    </div>
                    <div className="bg-[#0f2744]/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Torres & Pavimentos</span>
                      <span className="font-bold text-amber-300">
                        {activeProposal.towers} Torre(s) • {activeProposal.floors} Pav.
                      </span>
                    </div>
                    <div className="bg-[#0f2744]/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Área de Intervenção</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {activeProposal.estimatedArea.toLocaleString('pt-BR')} m²
                      </span>
                    </div>
                  </div>
                </div>

                {/* SEÇÃO 1: Escopo Detalhado e Resumo Executivo */}
                <div className="bg-[#0a192f] p-4 rounded-xl border border-slate-800 space-y-2.5">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                    <ClipboardCheck className="w-4 h-4" />
                    1. Objeto, Escopo Técnico Detalhado e Síntese de Vistoria
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed text-justify">
                    {activeProposal.scopeDeclaration}
                  </p>
                  <div className="bg-[#0f2744]/90 p-3 rounded-lg border border-slate-700/80 text-xs text-slate-200 leading-relaxed text-justify">
                    <strong className="text-amber-300">Parecer Executivo de Campo: </strong>
                    {activeProposal.executiveSummary}
                  </div>
                </div>

                {/* SEÇÃO 2: Diagnóstico Exato das Patologias Informadas */}
                {activeProposal.pathologyDiagnostics && activeProposal.pathologyDiagnostics.length > 0 && (
                  <div className="bg-[#0a192f] p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        2. Diagnóstico Técnico Exato das Patologias Informadas
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {activeProposal.pathologyDiagnostics.length} patologia(s) laudada(s)
                      </span>
                    </div>

                    <div className="space-y-3">
                      {activeProposal.pathologyDiagnostics.map((diag, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-[#0f2744]/80 border border-slate-700/90 space-y-2 text-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-800 pb-1.5">
                            <span className="font-bold text-white flex items-center gap-1.5">
                              <span className="text-[10px] font-mono bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1.5 py-0.5 rounded">
                                {diag.code}
                              </span>
                              {diag.pathology}
                            </span>
                            <span className="text-[10px] font-semibold text-amber-300 bg-[#0a192f] px-2 py-0.5 rounded border border-amber-500/30">
                              {diag.severityLabel}
                            </span>
                          </div>

                          <div className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
                            <p>
                              <strong className="text-slate-100">• Mecanismo e Causa Técnica: </strong>
                              {diag.technicalOrigin}
                            </p>
                            <p>
                              <strong className="text-rose-300">• Risco Associado à Edificação: </strong>
                              {diag.riskImpact}
                            </p>
                            <p>
                              <strong className="text-emerald-300">• Terapia Normativa Prescrita: </strong>
                              {diag.normativeTherapy}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SEÇÃO 3: Metodologia Executiva por Etapas */}
                {activeProposal.methodologyHighlights && (
                  <div className="bg-[#0a192f] p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Wrench className="w-4 h-4" />
                        3. Metodologia Executiva por Etapas (Padrão de Engenharia Renovar SC)
                      </span>
                      <span className="text-[10px] text-slate-400">7 Etapas Normativas</span>
                    </div>

                    <div className="space-y-2.5">
                      {activeProposal.methodologyHighlights.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[#0f2744]/70 border border-slate-800 text-xs space-y-1"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <div className="font-bold text-white flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                                {m.step || idx + 1}
                              </span>
                              <span>{m.title}</span>
                            </div>
                            {m.technicalStandard && (
                              <span className="text-[10px] font-mono text-amber-300 bg-[#0a192f] px-2 py-0.5 rounded border border-slate-700">
                                {m.technicalStandard}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed pl-7 text-justify">
                            {m.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SEÇÃO 4: Normas Técnicas e Especificação de Materiais Homologados */}
                <div className="bg-[#0a192f] p-4 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    4. Normas Técnicas ABNT / NR e Especificação de Materiais Homologados
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    {activeProposal.norms.map((norm, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-1.5 text-[11px] text-slate-300 bg-[#0f2744]/60 p-2 rounded-lg border border-slate-800"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{norm}</span>
                      </div>
                    ))}
                  </div>

                  {activeProposal.materialSpecifications && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Especificação de Insumos e Controle Tecnológico:
                      </span>
                      {activeProposal.materialSpecifications.map((mat, idx) => (
                        <p key={idx} className="text-[11px] text-slate-300 leading-relaxed">
                          <span className="text-amber-400 font-bold">• </span>
                          {mat}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* SEÇÃO 5: Planilha Orçamentária Discriminada */}
                <div className="bg-[#0a192f] p-4 rounded-xl border border-slate-800 overflow-hidden space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">
                      5. Planilha Orçamentária Analítica e Discriminada
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Valores em R$ (BRL)
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activeProposal.services.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#0f2744]/80 border border-slate-800 text-xs space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-white leading-snug">
                            <span className="text-amber-400 font-mono mr-1.5">[{item.code}]</span>
                            {item.description}
                          </span>
                          <span className="font-black text-emerald-400 font-mono flex-shrink-0">
                            {formatCurrency(item.total)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{item.methodology}</p>
                        <div className="flex justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80 font-mono">
                          <span>
                            Quantitativo: {item.quantity.toLocaleString('pt-BR')} {item.unit}
                          </span>
                          <span>Preço Unitário: {formatCurrency(item.unitPrice)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Subtotal, BDI e Total Final */}
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Subtotal Direto (Mão de Obra Especializada, Insumos e Balancins):</span>
                      <span className="font-mono font-semibold">{formatCurrency(activeProposal.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>BDI Corporativo, Seguros, ART/CREA-SC e Encargos ({activeProposal.bdiPercent}%):</span>
                      <span className="font-mono font-semibold">
                        {formatCurrency(activeProposal.totalPrice - activeProposal.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-700">
                      <span className="text-amber-400">VALOR GLOBAL PROPOSTO:</span>
                      <span className="text-amber-400 font-mono">
                        {formatCurrency(activeProposal.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SEÇÃO 6: Garantias Contratuais e Condições Comerciais */}
                <div className="bg-[#0a192f] p-4 rounded-xl border border-amber-500/30 space-y-3">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                    <Award className="w-4 h-4" />
                    6. Garantias Contratuais, Segurança NR-35 e Condições Comerciais
                  </span>

                  {activeProposal.warrantyClauses && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {activeProposal.warrantyClauses.map((wc, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[#0f2744]/80 border border-slate-700/80 space-y-1 text-xs"
                        >
                          <span className="font-bold text-white block">{wc.category}</span>
                          <span className="inline-block text-[10px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded">
                            {wc.period} • {wc.normReference}
                          </span>
                          <p className="text-[11px] text-slate-300 leading-relaxed pt-0.5">
                            {wc.coverageDescription}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-gradient-to-r from-[#0f2744] to-[#122e54] border border-amber-500/30 text-xs space-y-1.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex justify-between sm:justify-start sm:gap-2">
                        <span className="text-slate-400">Prazo de Execução:</span>
                        <span className="text-white font-bold">
                          {activeProposal.timelineWeeks} semanas de cronograma
                        </span>
                      </div>
                      <div className="flex justify-between sm:justify-start sm:gap-2">
                        <span className="text-slate-400">Garantia Contratual:</span>
                        <span className="text-emerald-400 font-bold">
                          {activeProposal.warrantyYears} anos (Art. 618 CC / NBR 15575)
                        </span>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-200 pt-1 border-t border-slate-700/80">
                      <span className="font-bold text-amber-300">Condições de Medição e Pagamento: </span>
                      {activeProposal.paymentConditions}
                    </div>
                  </div>

                  {activeProposal.contractualTerms && (
                    <div className="space-y-1 text-[11px] text-slate-300 pt-1">
                      {activeProposal.contractualTerms.map((term, idx) => (
                        <p key={idx} className="leading-relaxed">
                          <span className="text-amber-400 font-bold">✓ </span>
                          {term}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* SEÇÃO 7: TERMO DE ACEITE & ASSINATURA DIGITAL DO CONTRATANTE */}
                <div className="bg-[#0a192f] border-2 border-amber-500/40 rounded-2xl p-4 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                        7. Termo de Aceite & Assinatura Digital do Contratante / Cliente
                      </h4>
                    </div>
                    <span className="text-[9px] bg-amber-400/15 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded font-bold">
                      Validação Jurídica em Tela
                    </span>
                  </div>

                  {activeProposal.contractAcceptance?.signed ? (
                    /* Visual Record of Acceptance Seal */
                    <div className="bg-emerald-500/10 border-2 border-emerald-500/50 rounded-xl p-3.5 space-y-2.5 text-xs animate-in zoom-in-95">
                      <div className="flex items-center justify-between pb-2 border-b border-emerald-500/30">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span>CONTRATO HOMOLOGADO DIGITALMENTE PELO CONTRATANTE</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">
                          {activeProposal.contractAcceptance.protocolHash}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Contratante / Signatário:</span>
                          <span className="font-bold text-white">
                            {activeProposal.contractAcceptance.clientName}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Qualificação / Cargo:</span>
                          <span className="font-semibold text-slate-200">
                            {activeProposal.contractAcceptance.clientRole}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">CPF / CNPJ:</span>
                          <span className="font-mono text-slate-300">
                            {activeProposal.contractAcceptance.clientDocument}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Data do Aceite:</span>
                          <span className="font-semibold text-emerald-400">
                            {new Date(activeProposal.contractAcceptance.signedAt).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>

                      {/* Signature Preview */}
                      <div className="bg-white rounded-lg p-2 flex flex-col items-center justify-center border border-slate-300">
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">
                          Assinatura Grafométrica Registrada
                        </span>
                        <img
                          src={activeProposal.contractAcceptance.signatureDataUrl}
                          alt="Assinatura"
                          className="max-h-16 max-w-full object-contain"
                        />
                      </div>

                      <div className="flex justify-between items-center pt-1">
                        <span className="text-[10px] text-emerald-400 font-medium">
                          ✓ Incluído no PDF Oficial do Memorial Descritivo
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setGeneratedProposal({
                              ...activeProposal,
                              contractAcceptance: undefined,
                            });
                          }}
                          className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                        >
                          Refazer Assinatura
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Interactive Drawing Pad & Form */
                    <div className="space-y-3">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        O Contratante, Cliente ou Representante Legal pode assinar diretamente no quadro abaixo (com o mouse no computador ou toque no celular) para homologação formal do Memorial Descritivo.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div>
                          <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                            Nome do Contratante / Representante
                          </label>
                          <input
                            type="text"
                            value={clientSignName}
                            onChange={(e) => setClientSignName(e.target.value)}
                            placeholder="Ex: Roberto Albuquerque"
                            className="w-full px-2.5 py-1.5 bg-[#0f2744] border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                            Qualificação / Representação
                          </label>
                          <input
                            type="text"
                            value={clientSignRole}
                            onChange={(e) => setClientSignRole(e.target.value)}
                            placeholder="Ex: Contratante / Administrador"
                            className="w-full px-2.5 py-1.5 bg-[#0f2744] border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                            CPF / CNPJ do Contratante
                          </label>
                          <input
                            type="text"
                            value={clientSignCpf}
                            onChange={(e) => setClientSignCpf(e.target.value)}
                            placeholder="000.000.000-00"
                            className="w-full px-2.5 py-1.5 bg-[#0f2744] border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                          />
                        </div>
                      </div>

                      {/* Canvas Drawing Box */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] text-slate-300 font-semibold flex items-center gap-1">
                            <span>Desenhe a assinatura no quadro abaixo:</span>
                          </label>
                          <button
                            type="button"
                            onClick={clearSignature}
                            className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Limpar Campo</span>
                          </button>
                        </div>

                        <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-amber-400/60 bg-white shadow-inner">
                          <canvas
                            ref={canvasRef}
                            width={520}
                            height={130}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            className="w-full h-28 touch-none cursor-crosshair bg-white"
                          />
                          {!hasDrawn && (
                            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 text-xs opacity-60">
                              <PenTool className="w-5 h-5 mb-1 text-slate-400" />
                              <span>Assine aqui com o mouse ou dedo na tela</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Approve Button */}
                      <button
                        type="button"
                        onClick={handleApproveContract}
                        disabled={!hasDrawn}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Homologar Memorial & Registrar Aceite Digital do Contratante</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Official PDF Export Modal */}
      {showPdfModal && activeProposal && (
        <OfficialPdfModal
          proposal={activeProposal}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </div>
  );
};
