import React, { useState, useRef } from 'react';
import { BudgetProposal, ContractAcceptance } from '../types';
import { OfficialPdfModal } from './OfficialPdfModal';
import { notifyBudgetApproved } from '../services/notificationService';
import {
  generateLocalEngineeringBudget,
  ensureOfficialTemplateStructure,
  RENOVAR_COMPANY_CNPJ,
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
  Users,
  CalendarRange,
  DollarSign,
  Plus,
  SlidersHorizontal,
} from 'lucide-react';

interface BudgetGeneratorViewProps {
  onSaveProposal?: (proposal: BudgetProposal) => void;
  savedProposals: BudgetProposal[];
}

interface QuickPreset {
  key: string;
  label: string;
  condoName: string;
  location: string;
  towers: number;
  floors: number;
  area: number;
  pathologies: string[];
  urgency: string;
  notes: string;
}

const QUICK_PRESETS: QuickPreset[] = [
  {
    key: 'giovana',
    label: 'Residencial Giovana',
    condoName: 'Residencial Giovana',
    location: 'Balneário Camboriú, SC',
    towers: 1,
    floors: 12,
    area: 2800,
    pathologies: [
      'Desplacamento cerâmico / som cavo',
      'Fissuras e trincas de cisalhamento',
      'Armadura exposta com corrosão galvânica',
      'Juntas de dilatação ressecadas / falhas',
    ],
    urgency: 'Alta / Risco de Queda',
    notes:
      'Vistoria técnica pericial constatou desplacamento cerâmico ativo, fissuras de cisalhamento e pontos de armadura oxidada, exigindo intervenção normativa integral.',
  },
  {
    key: 'brava',
    label: 'Condomínio Terraços da Brava',
    condoName: 'Condomínio Terraços da Brava',
    location: 'Balneário Camboriú, SC',
    towers: 2,
    floors: 18,
    area: 4800,
    pathologies: [
      'Desplacamento cerâmico / som cavo',
      'Fissuras e trincas de cisalhamento',
      'Armadura exposta com corrosão galvânica',
    ],
    urgency: 'Alta / Risco de Queda',
    notes:
      'Inspeção visual preliminar apontou risco de desprendimento de pastilhas sobre área de acesso de pedestres e garagens.',
  },
  {
    key: 'itapema',
    label: 'Residencial Golden Bay',
    condoName: 'Residencial Golden Bay',
    location: 'Itapema, SC',
    towers: 1,
    floors: 14,
    area: 2900,
    pathologies: [
      'Juntas de dilatação ressecadas / falhas',
      'Eflorescência e lixiviação de carbonato',
      'Fuligem, mofo e fungos por maresia',
    ],
    urgency: 'Média',
    notes:
      'Forte incidência de névoa salina costeira e ressecamento de mastique nas juntas horizontais entre o 6º e 14º pavimento.',
  },
  {
    key: 'florianopolis',
    label: 'Edifício Solar dos Açores',
    condoName: 'Edifício Solar dos Açores',
    location: 'Florianópolis, SC',
    towers: 1,
    floors: 8,
    area: 1600,
    pathologies: [
      'Fissuras e trincas de cisalhamento',
      'Infiltração em marquises e sacadas',
    ],
    urgency: 'Normal',
    notes:
      'Necessidade de estanqueidade nos peitoris das janelas e revitalização com membrana acrílica elastomérica.',
  },
];

export const BudgetGeneratorView: React.FC<BudgetGeneratorViewProps> = ({
  onSaveProposal,
  savedProposals,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'saved'>('create');
  const [inputMode, setInputMode] = useState<'presets' | 'custom'>('presets');
  const [activePresetKey, setActivePresetKey] = useState<string>('giovana');

  // Form states (Dados Variáveis Diretos e 100% Editáveis do Contratante / Edificação)
  const [condoName, setCondoName] = useState(QUICK_PRESETS[0].condoName);
  const [location, setLocation] = useState(QUICK_PRESETS[0].location);
  const [towersInput, setTowersInput] = useState<string>(String(QUICK_PRESETS[0].towers));
  const [floorsInput, setFloorsInput] = useState<string>(String(QUICK_PRESETS[0].floors));
  const [areaInput, setAreaInput] = useState<string>(String(QUICK_PRESETS[0].area));
  const [selectedPathologies, setSelectedPathologies] = useState<string[]>(
    QUICK_PRESETS[0].pathologies
  );
  const [urgency, setUrgency] = useState<string>(QUICK_PRESETS[0].urgency);
  const [notes, setNotes] = useState<string>(QUICK_PRESETS[0].notes);

  const condoNameInputRef = useRef<HTMLInputElement | null>(null);
  const memorialOutputRef = useRef<HTMLDivElement | null>(null);

  const towers = Math.max(1, parseInt(towersInput, 10) || 1);
  const floors = Math.max(1, parseInt(floorsInput, 10) || 1);
  const estimatedArea = Math.max(100, parseInt(areaInput, 10) || towers * floors * 130);

  const [isLoading, setIsLoading] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<BudgetProposal | null>(() =>
    generateLocalEngineeringBudget({
      condoName: QUICK_PRESETS[0].condoName,
      location: QUICK_PRESETS[0].location,
      towers: QUICK_PRESETS[0].towers,
      floors: QUICK_PRESETS[0].floors,
      estimatedArea: QUICK_PRESETS[0].area,
      pathologies: QUICK_PRESETS[0].pathologies,
      urgency: QUICK_PRESETS[0].urgency,
      notes: QUICK_PRESETS[0].notes,
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

  const handleSwitchToPresetsMode = () => {
    setInputMode('presets');
    const currentPreset =
      QUICK_PRESETS.find((p) => p.key === activePresetKey) || QUICK_PRESETS[0];
    handleApplyPreset(currentPreset);
  };

  const handleSwitchToCustomBuildingMode = () => {
    setInputMode('custom');
    setActivePresetKey('custom');
    setCondoName('');
    setLocation('');
    setTowersInput('');
    setFloorsInput('');
    setAreaInput('');
    setSelectedPathologies(['Desplacamento cerâmico / som cavo', 'Fissuras e trincas de cisalhamento']);
    setUrgency('Alta / Risco de Queda');
    setNotes('');
    setTimeout(() => {
      condoNameInputRef.current?.focus();
    }, 50);
  };

  const handleApplyPreset = (preset: QuickPreset) => {
    setInputMode('presets');
    setActivePresetKey(preset.key);
    setCondoName(preset.condoName);
    setLocation(preset.location);
    setTowersInput(String(preset.towers));
    setFloorsInput(String(preset.floors));
    setAreaInput(String(preset.area));
    setSelectedPathologies(preset.pathologies);
    setUrgency(preset.urgency);
    setNotes(preset.notes);
    setGeneratedProposal(
      generateLocalEngineeringBudget({
        condoName: preset.condoName,
        location: preset.location,
        towers: preset.towers,
        floors: preset.floors,
        estimatedArea: preset.area,
        pathologies: preset.pathologies,
        urgency: preset.urgency,
        notes: preset.notes,
      })
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setCopySuccess(false);
    setSaveSuccess(false);

    const finalCondoName = condoName.trim() || 'Edifício Residencial / Corporativo';
    const finalLocation = location.trim() || 'Balneário Camboriú, SC';
    const finalTowers = Math.max(1, parseInt(towersInput, 10) || 1);
    const finalFloors = Math.max(1, parseInt(floorsInput, 10) || 12);
    const finalArea = Math.max(100, parseInt(areaInput, 10) || finalTowers * finalFloors * 130);
    const finalPathologies =
      selectedPathologies.length > 0
        ? selectedPathologies
        : ['Desplacamento cerâmico / som cavo'];

    // Normalize form inputs so the user sees the resolved values if they left numeric fields blank
    setTowersInput(String(finalTowers));
    setFloorsInput(String(finalFloors));
    setAreaInput(String(finalArea));

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
          condoName: finalCondoName,
          location: finalLocation,
          towers: finalTowers,
          floors: finalFloors,
          estimatedArea: finalArea,
          pathologies: finalPathologies,
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
            condoName: finalCondoName,
            location: finalLocation,
            towers: finalTowers,
            floors: finalFloors,
            estimatedArea: finalArea,
            pathologies: finalPathologies,
            urgency,
            notes,
            createdAt: new Date().toISOString(),
          });
          setGeneratedProposal(fullProposal);
          setTimeout(() => {
            memorialOutputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
          return;
        }
      }
      throw new Error('Template oficial local ativado');
    } catch {
      const elapsed = Date.now() - startTime;
      if (elapsed < 450) {
        await new Promise((r) => setTimeout(r, 450 - elapsed));
      }

      const simulatedProposal = generateLocalEngineeringBudget({
        condoName: finalCondoName,
        location: finalLocation,
        towers: finalTowers,
        floors: finalFloors,
        estimatedArea: finalArea,
        pathologies: finalPathologies,
        urgency,
        notes,
      });

      setGeneratedProposal(simulatedProposal);
      setTimeout(() => {
        memorialOutputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
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
RENOVAR SC — SOLUÇÕES PREDIAIS LTDA (CNPJ: ${RENOVAR_COMPANY_CNPJ})
${activeProposal.title}
======================================================================
Protocolo Oficial: ${activeProposal.protocol}
Contratante / Cliente: ${activeProposal.condoName}
Localização / Município: ${activeProposal.location}
Configuração / Porte: ${activeProposal.towers} Torre(s) | ${activeProposal.floors} Pavimentos | ${activeProposal.estimatedArea.toLocaleString('pt-BR')} m²
Enquadramento Ambiental: ${activeProposal.environmentalClassification || 'Classe III/IV - ABNT NBR 6118'}
Grau de Risco / Urgência: ${activeProposal.urgency}

1. OBJETO DO ORÇAMENTO, FINALIDADE E DIRETRIZES TÉCNICAS:
1.1 Objeto do Orçamento:
${activeProposal.scopeDeclaration}

1.2 Finalidade Técnica e Parecer de Vistoria:
${activeProposal.executiveSummary}

1.3 Diretrizes Técnicas e Normas Aplicáveis:
${activeProposal.norms.map((n) => `• ${n}`).join('\n')}

2. DIAGNÓSTICO PERICIAL EXATO DAS PATOLOGIAS IDENTIFICADAS:
${(activeProposal.pathologyDiagnostics || [])
  .map(
    (d) =>
      `[${d.code}] ${d.pathology} (${d.severityLabel})\n   • Origem Físico-Química: ${d.technicalOrigin}\n   • Risco Associado: ${d.riskImpact}\n   • Terapia Normativa: ${d.normativeTherapy}`
  )
  .join('\n\n')}

3. METODOLOGIA EXECUTIVA DETALHADA POR FASES (PADRÃO RENOVAR SC):
${activeProposal.methodologyHighlights
  .map(
    (m) =>
      `${m.phaseCode || `FASE 0${m.step}`} — ${m.title} [${m.technicalStandard || 'ABNT/NR'}]\n   ${m.detail}`
  )
  .join('\n\n')}

4. PLANILHA DE SERVIÇOS COM DISCRIMINAÇÃO, INSUMOS, QUANTITATIVOS E PREÇOS:
${activeProposal.services
  .map(
    (s) =>
      `• ${s.code} - ${s.description}\n  Procedimento: ${s.methodology}\n  Insumos Aplicados: ${s.inputsAndMaterials || 'Insumos industriais homologados ABNT'}\n  Quant.: ${s.quantity.toLocaleString('pt-BR')} ${s.unit} x R$ ${s.unitPrice.toFixed(2)} = R$ ${s.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  )
  .join('\n\n')}

RESUMO FINANCEIRO DA PROPOSTA:
Subtotal Direto (Mão de Obra, Balancins e Insumos): R$ ${activeProposal.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
BDI Corporativo, Seguros, ART/CREA-SC e Encargos (${activeProposal.bdiPercent}%): R$ ${(activeProposal.totalPrice - activeProposal.subtotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
VALOR GLOBAL PROPOSTO: R$ ${activeProposal.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

5. TABELA DE EQUIPE TÉCNICA ALOCADA:
${(activeProposal.teamAllocation || [])
  .map(
    (t) =>
      `• ${t.role} (${t.quantity} prof.) — ${t.qualification}\n  Atribuição: ${t.assignment}`
  )
  .join('\n')}

6. CRONOGRAMA FÍSICO-FINANCEIRO POR SEMANAS (${activeProposal.timelineWeeks} SEMANAS):
${(activeProposal.weeklySchedule || [])
  .map(
    (w) =>
      `• ${w.phase} (${w.weeksLabel}): ${w.stageTitle} | Peso: ${w.physicalWeightPercent}% | Medição: R$ ${w.financialAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  )
  .join('\n')}

7. TERMO DE GARANTIA CONTRATUAL DE 05 ANOS (ART. 618 CC / ABNT NBR 15575):
${(activeProposal.warrantyClauses || [])
  .map((w) => `• ${w.category}: ${w.period} (${w.normReference}) — ${w.coverageDescription}`)
  .join('\n')}

8. CONDIÇÕES COMERCIAIS, FORMAS DE PAGAMENTO, ENTRADA E PARCELAMENTO:
Razão Social: RENOVAR SC SOLUÇÕES PREDIAIS LTDA | CNPJ: ${RENOVAR_COMPANY_CNPJ}
Prazo de Execução: ${activeProposal.timelineWeeks} semanas | Garantia: 0${activeProposal.warrantyYears} anos
Condição Padrão: ${activeProposal.paymentConditions}
${(activeProposal.commercialTermsList || []).map((c) => `• ${c}`).join('\n')}

9. HOMOLOGAÇÃO TÉCNICA E ASSINATURA DO CONTRATANTE:
Responsabilidade Técnica: ${activeProposal.technicalResponsible}
${
  activeProposal.contractAcceptance?.signed
    ? `Status: CONTRATO HOMOLOGADO DIGITALMENTE PELO CONTRATANTE: ${activeProposal.contractAcceptance.clientName} (Hash: ${activeProposal.contractAcceptance.protocolHash})`
    : 'Status: Aguardando assinatura digital do Contratante / Cliente.'
}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const handleWhatsAppShare = () => {
    if (!activeProposal) return;
    const msg =
      `*RENOVAR SC (CNPJ ${RENOVAR_COMPANY_CNPJ}) — MEMORIAL DESCRITIVO & ORÇAMENTO OFICIAL*\n\n` +
      `*Protocolo:* ${activeProposal.protocol}\n` +
      `*Contratante / Cliente:* ${activeProposal.condoName}\n` +
      `*Município:* ${activeProposal.location}\n` +
      `*Porte:* ${activeProposal.towers} Torre(s) • ${activeProposal.floors} Pavimentos (${activeProposal.estimatedArea.toLocaleString('pt-BR')} m²)\n` +
      `*Patologias Diagnosticadas:* ${activeProposal.pathologies.join(', ')}\n` +
      `*Valor Global Proposto:* R$ ${activeProposal.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` +
      `*Prazo de Execução:* ${activeProposal.timelineWeeks} semanas | *Garantia Contratual:* 0${activeProposal.warrantyYears} anos\n` +
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
    <div className="space-y-6 pb-nav md:pb-8">
      {/* TOP BAR: Module Header & Sub-Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0f2744] border border-slate-800 rounded-xl p-4 sm:p-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Orçamentos & Memorial Descritivo Oficial
            </h2>
            <span className="text-[10px] font-mono font-semibold bg-[#0a192f] text-amber-400 border border-slate-800 px-2.5 py-0.5 rounded">
              CNPJ {RENOVAR_COMPANY_CNPJ}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Padrão formal de engenharia civil da Renovar SC com preenchimento inteligente e exportação em PDF
          </p>
        </div>

        <div className="flex items-center bg-[#0a192f] p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveSubTab('create')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeSubTab === 'create'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Nova Proposta & Memorial
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('saved')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeSubTab === 'saved'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Propostas Salvas ({savedProposals.length})</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'saved' ? (
        /* SAVED PROPOSALS TAB */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {savedProposals.length === 0 ? (
            <div className="col-span-full bg-[#0f2744] border border-slate-800 rounded-xl p-8 text-center text-slate-400 space-y-2.5 max-w-lg mx-auto">
              <FileText className="w-9 h-9 text-slate-500 mx-auto" />
              <p className="text-sm font-bold text-white">Nenhuma proposta salva no acervo</p>
              <p className="text-xs text-slate-400">
                Utilize o formulário de Nova Proposta para gerar e salvar memoriais descritivos oficiais da Renovar SC.
              </p>
              <button
                type="button"
                onClick={() => setActiveSubTab('create')}
                className="mt-2 px-4 py-2 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Criar Nova Proposta
              </button>
            </div>
          ) : (
            savedProposals.map((rawProp) => {
              const prop = ensureOfficialTemplateStructure(rawProp);
              return (
                <div
                  key={prop.id}
                  onClick={() => {
                    setCondoName(prop.condoName);
                    setLocation(prop.location);
                    setTowersInput(String(prop.towers));
                    setFloorsInput(String(prop.floors));
                    setAreaInput(String(prop.estimatedArea));
                    setSelectedPathologies(prop.pathologies);
                    setUrgency(prop.urgency);
                    setNotes(prop.notes || '');
                    setGeneratedProposal(prop);
                    setActiveSubTab('create');
                  }}
                  className="bg-[#0f2744] hover:bg-[#132c4e] border border-slate-800 hover:border-slate-700 rounded-xl p-4 cursor-pointer transition flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-amber-400 bg-[#0a192f] px-2 py-0.5 rounded border border-slate-800">
                            {prop.protocol}
                          </span>
                          {prop.contractAcceptance?.signed && (
                            <span className="text-[9px] font-semibold bg-[#0a192f] text-slate-200 border border-slate-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5 text-amber-400" />
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
                      <span className="text-sm font-bold text-amber-400 font-mono">
                        {formatCurrency(prop.totalPrice)}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 bg-[#0a192f] p-2.5 rounded-lg line-clamp-3 border border-slate-800">
                      {prop.executiveSummary}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2.5 border-t border-slate-800">
                    <span>
                      {prop.towers} torre(s) • {prop.floors} pav. ({prop.estimatedArea.toLocaleString('pt-BR')} m²)
                    </span>
                    <span className="text-amber-400 font-semibold">Abrir Memorial →</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* BLOCO 1: SELETOR DE MODO (MODELOS PRÉ-DEFINIDOS vs. + NOVO EDIFÍCIO / PERSONALIZADO) */}
          <div className="bg-[#0f2744] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                  Modo de Preenchimento da Proposta
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Escolha um modelo pré-definido de referência ou cadastre um edifício totalmente novo do zero
                </p>
              </div>

              {/* Seletor de Modo: [Modelos Pré-definidos] vs [+ Novo Edifício / Personalizado] */}
              <div className="flex items-center bg-[#0a192f] p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleSwitchToPresetsMode}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    inputMode === 'presets'
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Modelos Pré-definidos</span>
                </button>
                <button
                  type="button"
                  onClick={handleSwitchToCustomBuildingMode}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    inputMode === 'custom'
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Novo Edifício / Personalizado</span>
                </button>
              </div>
            </div>

            {inputMode === 'presets' ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Clique em um modelo abaixo para carregar os dados instantaneamente (todos os campos permanecem editáveis):</span>
                  <span className="font-mono text-amber-400 hidden sm:inline">Seleção em 1 clique</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {QUICK_PRESETS.map((preset) => {
                    const isSelected = activePresetKey === preset.key;
                    return (
                      <button
                        key={preset.key}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                          isSelected
                            ? 'bg-[#0a192f] border-amber-400 text-white'
                            : 'bg-[#0a192f]/70 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-white truncate">
                            {preset.label}
                          </span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span className="truncate">{preset.location}</span>
                          <span className="text-amber-400 font-semibold flex-shrink-0">
                            {preset.towers}T • {preset.floors}P • {preset.area}m²
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-[#0a192f] border border-amber-400/40 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0f2744] border border-slate-800 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">
                      Modo Novo Edifício / Personalizado Ativo
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Todos os campos abaixo estão abertos para você digitar os dados reais do novo Contratante / Edificação.
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-[#0f2744] border border-slate-800 px-2.5 py-1 rounded self-start sm:self-center">
                  Preenchimento Livre
                </span>
              </div>
            )}
          </div>

          {/* BLOCO 2: FORMULÁRIO DINÂMICO E 100% EDITÁVEL DE ENTRADA DE DADOS */}
          <form
            onSubmit={handleGenerate}
            className="bg-[#0f2744] border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5"
          >
            <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Dados do Contratante / Edificação, Quantitativos e Patologias
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Todos os campos são editáveis e recalculam automaticamente a planilha de serviços, equipe, cronograma e BDI
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-300 bg-[#0a192f] border border-slate-800 px-2.5 py-1 rounded">
                9 Seções Oficiais ABNT
              </span>
            </div>

            {/* Linha 1: Campos Diretos (Contratante/Edificação, Município, Torres/Blocos, Pavimentos, Área Total m²) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
              {/* Nome do Contratante / Edificação */}
              <div className="lg:col-span-4">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nome do Contratante / Edificação
                </label>
                <input
                  ref={condoNameInputRef}
                  type="text"
                  value={condoName}
                  onChange={(e) => setCondoName(e.target.value)}
                  required
                  placeholder="Digite o nome do Condomínio / Edifício..."
                  className="w-full px-3.5 py-2.5 bg-[#0a192f] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Município */}
              <div className="lg:col-span-3">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Município (SC)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  placeholder="Ex: Balneário Camboriú, SC"
                  className="w-full px-3.5 py-2.5 bg-[#0a192f] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Torres / Blocos e Pavimentos */}
              <div className="lg:col-span-3 grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Torres / Blocos
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={towersInput}
                    placeholder="Ex: 1"
                    onChange={(e) => {
                      const raw = e.target.value;
                      setTowersInput(raw);
                      const parsedT = parseInt(raw, 10);
                      const parsedF = parseInt(floorsInput, 10);
                      if (parsedT > 0 && parsedF > 0) {
                        setAreaInput(String(parsedT * parsedF * 130));
                      }
                    }}
                    required
                    className="w-full px-3 py-2.5 bg-[#0a192f] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 text-center font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Pavimentos
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={floorsInput}
                    placeholder="Ex: 12"
                    onChange={(e) => {
                      const raw = e.target.value;
                      setFloorsInput(raw);
                      const parsedF = parseInt(raw, 10);
                      const parsedT = parseInt(towersInput, 10);
                      if (parsedT > 0 && parsedF > 0) {
                        setAreaInput(String(parsedT * parsedF * 130));
                      }
                    }}
                    required
                    className="w-full px-3 py-2.5 bg-[#0a192f] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 text-center font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Área Total em m² */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Área Total (m²)
                </label>
                <input
                  type="number"
                  step="10"
                  min="50"
                  value={areaInput}
                  placeholder="Ex: 2800"
                  onChange={(e) => setAreaInput(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 bg-[#0a192f] border border-slate-800 rounded-xl text-sm text-amber-400 placeholder-slate-500 text-center font-bold font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Linha 2: Seleção de Patologias */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-semibold text-slate-300">
                  Seleção de Patologias Identificadas na Edificação
                </label>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-amber-400 font-semibold">
                    {selectedPathologies.length} selecionada(s)
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedPathologies([...pathologyOptions])}
                    className="text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Marcar todas
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPathologies([])}
                    className="text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Limpar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                {pathologyOptions.map((pathology) => {
                  const isSelected = selectedPathologies.includes(pathology);
                  return (
                    <button
                      key={pathology}
                      type="button"
                      onClick={() => handleTogglePathology(pathology)}
                      className={`px-3 py-2.5 rounded-xl border text-xs transition text-left cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-[#0a192f] border-amber-400 text-white font-semibold'
                          : 'bg-[#0a192f]/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-[#0f2744] border border-slate-700 text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                      <span className="truncate">{pathology}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Linha 3: Observações de Vistoria e Grau de Prioridade */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1">
              <div className="lg:col-span-8">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Observações de Vistoria e Particularidades da Obra
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Digite observações específicas da vistoria (Ex: Risco sobre área de pedestres, fachada norte...)"
                  className="w-full px-3.5 py-2.5 bg-[#0a192f] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="lg:col-span-4">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Grau de Risco / Urgência Técnica
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Normal', 'Média', 'Alta / Risco de Queda'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setUrgency(level)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-semibold border transition text-center truncate cursor-pointer ${
                        urgency === level
                          ? 'bg-[#0a192f] border-amber-400 text-amber-400 font-bold'
                          : 'bg-[#0a192f]/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {level === 'Alta / Risco de Queda' ? 'Alta / Crítica' : level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Linha 4: Botão de Geração do Memorial Oficial */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400">
                Injeta os dados informados nas 9 seções do Memorial Descritivo Oficial da Renovar SC e calcula automaticamente quantitativos, insumos, equipe, cronograma e BDI.
              </p>

              <button
                type="submit"
                disabled={isLoading || selectedPathologies.length === 0}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm tracking-wide transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 flex-shrink-0"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Estruturando Memorial Oficial...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Gerar Memorial Descritivo & Orçamento Oficial</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* BLOCO 3: DOCUMENTO OFICIAL GERADO — MEMORIAL DESCRITIVO & ORÇAMENTO COMPLETO (9 SEÇÕES) */}
          {activeProposal && (
            <div
              ref={memorialOutputRef}
              className="bg-[#0f2744] border border-slate-800 rounded-xl p-5 sm:p-7 space-y-6"
            >
              {/* CABEÇALHO CORPORATIVO COM LOGOTIPO E CNPJ 57.293.244/0001-27 */}
              <div className="bg-[#0a192f] border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white p-1 border border-slate-700 flex-shrink-0 overflow-hidden">
                    <img
                      src="/assets/aistudio/Logotipo_Renovar_51718f31.jpg"
                      alt="Renovar SC"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-white tracking-tight">
                        RENOVAR <span className="text-amber-400">SC</span> — SOLUÇÕES PREDIAIS LTDA
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-[#0f2744] text-amber-400 border border-slate-800 px-2.5 py-0.5 rounded">
                        CNPJ: {RENOVAR_COMPANY_CNPJ}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Engenharia Civil • Recuperação Estrutural, Impermeabilização e Restauração de Fachadas
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Registro CREA-SC Ativo • Conformidade ABNT NBR 13755, NBR 6118, NBR 15575, NR-18 e NR-35
                    </p>
                  </div>
                </div>

                <div className="md:text-right border-t md:border-t-0 border-slate-800 pt-3 md:pt-0 flex-shrink-0">
                  <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded inline-block">
                    PROTOCOLO: {activeProposal.protocol}
                  </span>
                  <span className="text-[11px] text-slate-300 block mt-1">
                    Data de Emissão: {new Date(activeProposal.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="text-[11px] text-amber-400 font-semibold block">
                    Garantia Contratual: 0{activeProposal.warrantyYears} Anos (Art. 618 CC)
                  </span>
                </div>
              </div>

              {/* BARRA DE TÍTULO E AÇÕES DE EXPORTAÇÃO */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                    DOCUMENTO TÉCNICO FORMAL DE ENGENHARIA CIVIL
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                    {activeProposal.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Contratante / Cliente: <strong className="text-white">{activeProposal.condoName}</strong> • {activeProposal.location}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowPdfModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-slate-950" />
                    <span>Exportar PDF Oficial</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyClipboard}
                    className="px-3.5 py-2.5 rounded-xl bg-[#0a192f] border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copySuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-amber-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Copiar Texto</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="px-3.5 py-2.5 rounded-xl bg-[#0a192f] border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Enviar WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveToHistory}
                    className="px-3.5 py-2.5 rounded-xl bg-[#0a192f] border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {saveSuccess ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-amber-400">Salvo</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5 text-amber-400" />
                        <span>Salvar no Acervo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* IDENTIFICAÇÃO FORMAL DO CONTRATANTE / CLIENTE E DADOS DA EDIFICAÇÃO */}
              <div className="bg-[#0a192f] p-4 sm:p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Identificação Formal do Contratante / Cliente e Dados da Edificação
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Emissor: Renovar SC • CNPJ {RENOVAR_COMPANY_CNPJ}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="bg-[#0f2744] p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Contratante / Edificação</span>
                    <span className="font-bold text-white text-sm mt-0.5 block">
                      {activeProposal.condoName}
                    </span>
                  </div>
                  <div className="bg-[#0f2744] p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Município / UF</span>
                    <span className="font-bold text-white text-sm mt-0.5 block">
                      {activeProposal.location}
                    </span>
                  </div>
                  <div className="bg-[#0f2744] p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Configuração Vertical</span>
                    <span className="font-bold text-white text-sm mt-0.5 block">
                      {activeProposal.towers} Torre(s) • {activeProposal.floors} Pavimentos
                    </span>
                  </div>
                  <div className="bg-[#0f2744] p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Área Total de Intervenção</span>
                    <span className="font-bold text-amber-400 font-mono text-sm mt-0.5 block">
                      {activeProposal.estimatedArea.toLocaleString('pt-BR')} m²
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="md:col-span-2 bg-[#0f2744]/60 px-3.5 py-2.5 rounded-lg border border-slate-800 text-slate-300">
                    <strong className="text-white">Enquadramento Ambiental: </strong>
                    {activeProposal.environmentalClassification}
                  </div>
                  <div className="bg-[#0f2744]/60 px-3.5 py-2.5 rounded-lg border border-slate-800 text-slate-300">
                    <strong className="text-white">Prazo & Garantia: </strong>
                    <span className="text-amber-400 font-semibold">
                      {activeProposal.timelineWeeks} Semanas • 0{activeProposal.warrantyYears} Anos
                    </span>
                  </div>
                </div>
              </div>

              {/* SEÇÃO 1: OBJETO DO ORÇAMENTO, FINALIDADE E DIRETRIZES TÉCNICAS */}
              <div className="bg-[#0a192f] p-4 sm:p-5 rounded-xl border border-slate-800 space-y-3.5">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2.5">
                  <ClipboardCheck className="w-4 h-4" />
                  1. Objeto do Orçamento, Finalidade e Diretrizes Técnicas
                </span>

                <div className="space-y-3 text-xs">
                  <div className="bg-[#0f2744]/70 p-3.5 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-white uppercase tracking-wide block">
                      1.1 Objeto do Orçamento
                    </span>
                    <p className="text-slate-300 leading-relaxed text-justify">
                      {activeProposal.scopeDeclaration}
                    </p>
                  </div>

                  <div className="bg-[#0f2744]/70 p-3.5 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-white uppercase tracking-wide block">
                      1.2 Finalidade Técnica e Parecer Diagnóstico de Vistoria
                    </span>
                    <p className="text-slate-300 leading-relaxed text-justify">
                      {activeProposal.executiveSummary}
                    </p>
                  </div>

                  <div className="bg-[#0f2744]/70 p-3.5 rounded-lg border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-white uppercase tracking-wide block">
                      1.3 Diretrizes Técnicas e Normas Regulamentadoras Aplicáveis (ABNT / MTE)
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {activeProposal.norms.map((norm, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-[11px] text-slate-300 bg-[#0a192f] p-2.5 rounded-lg border border-slate-800"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span>{norm}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SEÇÃO 2: DIAGNÓSTICO PERICIAL EXATO DAS PATOLOGIAS IDENTIFICADAS */}
              {activeProposal.pathologyDiagnostics && activeProposal.pathologyDiagnostics.length > 0 && (
                <div className="bg-[#0a192f] p-4 sm:p-5 rounded-xl border border-slate-800 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      2. Diagnóstico Pericial Exato das Patologias Identificadas
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {activeProposal.pathologyDiagnostics.length} patologia(s) periciada(s)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {activeProposal.pathologyDiagnostics.map((diag, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[#0f2744]/70 border border-slate-800 space-y-2.5 text-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                          <span className="font-bold text-white flex items-center gap-2">
                            <span className="text-[10px] font-mono bg-[#0a192f] text-amber-400 border border-slate-800 px-2 py-0.5 rounded">
                              {diag.code}
                            </span>
                            <span>{diag.pathology}</span>
                          </span>
                          <span className="text-[10px] font-semibold text-amber-400 bg-[#0a192f] px-2.5 py-0.5 rounded border border-slate-800">
                            {diag.severityLabel}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 text-[11px] text-slate-300 leading-relaxed">
                          <div className="bg-[#0a192f]/70 p-3 rounded-lg border border-slate-800">
                            <strong className="text-white block mb-1">
                              • Origem e Mecanismo Físico-Químico:
                            </strong>
                            {diag.technicalOrigin}
                          </div>
                          <div className="bg-[#0a192f]/70 p-3 rounded-lg border border-slate-800">
                            <strong className="text-white block mb-1">
                              • Riscos Associados à Edificação:
                            </strong>
                            {diag.riskImpact}
                          </div>
                          <div className="bg-[#0a192f]/70 p-3 rounded-lg border border-slate-800">
                            <strong className="text-amber-400 block mb-1">
                              • Terapia Normativa Prescrita:
                            </strong>
                            {diag.normativeTherapy}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SEÇÃO 3: METODOLOGIA EXECUTIVA DETALHADA POR FASES */}
              {activeProposal.methodologyHighlights && (
                <div className="bg-[#0a192f] p-4 sm:p-5 rounded-xl border border-slate-800 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <Wrench className="w-4 h-4" />
                      3. Metodologia Executiva Detalhada por Fases (NR-18 / NR-35 até Entrega e Garantia)
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">07 Fases Executivas</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {activeProposal.methodologyHighlights.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#0f2744]/70 border border-slate-800 text-xs space-y-1.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="font-bold text-white flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                              {m.step || idx + 1}
                            </span>
                            <span>{m.title}</span>
                          </div>
                          {m.technicalStandard && (
                            <span className="text-[10px] font-mono text-amber-400 bg-[#0a192f] px-2.5 py-0.5 rounded border border-slate-800">
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

              {/* SEÇÃO 4: PLANILHA DE SERVIÇOS COM DISCRIMINAÇÃO, INSUMOS, UNIDADES, QUANTITATIVOS, PREÇOS UNITÁRIOS, SUBTOTAIS, BDI E VALOR GLOBAL */}
              <div className="bg-[#0a192f] p-4 sm:p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    4. Planilha Oficial de Serviços, Insumos, Quantitativos e Preços
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Moeda: Real (BRL) • Empreitada Global
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#0f2744] text-slate-200 border-b border-slate-800 text-[11px]">
                        <th className="py-3 px-3 font-bold whitespace-nowrap">Item</th>
                        <th className="py-3 px-3.5 font-bold">
                          Discriminação Técnica dos Serviços, Procedimento & Insumos Aplicados
                        </th>
                        <th className="py-3 px-2.5 font-bold text-center whitespace-nowrap">Unid.</th>
                        <th className="py-3 px-3 font-bold text-right whitespace-nowrap">Quant.</th>
                        <th className="py-3 px-3 font-bold text-right whitespace-nowrap">Preço Unit.</th>
                        <th className="py-3 px-3.5 font-bold text-right whitespace-nowrap">Subtotal (R$)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-[11px] text-slate-300">
                      {activeProposal.services.map((item, idx) => (
                        <tr key={idx} className="bg-[#0a192f] hover:bg-[#0f2744]/50">
                          <td className="py-3 px-3 font-mono font-bold text-amber-400 align-top whitespace-nowrap">
                            {item.code}
                          </td>
                          <td className="py-3 px-3.5 align-top space-y-1.5">
                            <span className="font-bold text-white text-xs block leading-snug">
                              {item.description}
                            </span>
                            <p className="text-slate-300 leading-relaxed">
                              <strong className="text-slate-200">Metodologia: </strong>
                              {item.methodology}
                            </p>
                            {item.inputsAndMaterials && (
                              <div className="bg-[#0f2744]/80 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                                <strong className="text-amber-400">Insumos Inclusos: </strong>
                                {item.inputsAndMaterials}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-2.5 text-center font-mono text-slate-300 align-top">
                            {item.unit}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-semibold text-white align-top whitespace-nowrap">
                            {item.quantity.toLocaleString('pt-BR')}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-slate-300 align-top whitespace-nowrap">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="py-3 px-3.5 text-right font-mono font-bold text-amber-400 align-top whitespace-nowrap">
                            {formatCurrency(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#0f2744] border-t-2 border-slate-700 text-xs">
                      <tr className="border-b border-slate-800">
                        <td colSpan={5} className="py-2.5 px-3.5 text-right font-semibold text-slate-300">
                          Subtotal Direto (Mão de Obra Especializada, Insumos, Balancins e EPCs):
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-mono font-bold text-white whitespace-nowrap">
                          {formatCurrency(activeProposal.subtotal)}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-800">
                        <td colSpan={5} className="py-2.5 px-3.5 text-right font-semibold text-slate-300">
                          BDI Corporativo, Tributos, Seguros, ART/CREA-SC e Administração ({activeProposal.bdiPercent}%):
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-mono font-bold text-white whitespace-nowrap">
                          {formatCurrency(activeProposal.totalPrice - activeProposal.subtotal)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={5} className="py-3 px-3.5 text-right font-bold text-sm text-amber-400 uppercase">
                          VALOR GLOBAL PROPOSTO ({activeProposal.condoName}):
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono font-bold text-base text-amber-400 whitespace-nowrap">
                          {formatCurrency(activeProposal.totalPrice)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Especificações Tecnológicas dos Materiais */}
                {activeProposal.materialSpecifications && (
                  <div className="p-3.5 rounded-xl bg-[#0f2744]/60 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                      Especificação Tecnológica dos Insumos Homologados:
                    </span>
                    <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-300">
                      {activeProposal.materialSpecifications.map((mat, idx) => (
                        <p key={idx} className="leading-relaxed">
                          • {mat}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SEÇÃO 5: TABELA DE EQUIPE TÉCNICA ALOCADA */}
              {activeProposal.teamAllocation && activeProposal.teamAllocation.length > 0 && (
                <div className="bg-[#0a192f] p-4 sm:p-5 rounded-xl border border-slate-800 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      5. Tabela de Equipe Técnica Alocada (Engenheiro, TST, Encarregado, Fachadeiros e Pedreiros)
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Quadro Próprio • NR-35 / NR-18
                    </span>
                  </div>

                  <div className="overflow-x-auto border border-slate-800 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#0f2744] text-slate-200 border-b border-slate-800 text-[11px]">
                          <th className="py-2.5 px-3.5 font-bold">Função / Cargo na Obra</th>
                          <th className="py-2.5 px-3 font-bold text-center">Efetivo</th>
                          <th className="py-2.5 px-3.5 font-bold">Habilitação & Certificações</th>
                          <th className="py-2.5 px-3.5 font-bold">Atribuição Técnica no Canteiro</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-[11px] text-slate-300">
                        {activeProposal.teamAllocation.map((member, idx) => (
                          <tr key={idx} className="bg-[#0a192f] hover:bg-[#0f2744]/50">
                            <td className="py-2.5 px-3.5 font-bold text-white align-top">
                              {member.role}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-400 align-top whitespace-nowrap">
                              {String(member.quantity).padStart(2, '0')} prof.
                            </td>
                            <td className="py-2.5 px-3.5 text-slate-300 align-top">
                              {member.qualification}
                            </td>
                            <td className="py-2.5 px-3.5 text-slate-400 align-top leading-relaxed">
                              {member.assignment}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SEÇÃO 6: CRONOGRAMA FÍSICO-FINANCEIRO POR SEMANAS */}
              {activeProposal.weeklySchedule && activeProposal.weeklySchedule.length > 0 && (
                <div className="bg-[#0a192f] p-4 sm:p-5 rounded-xl border border-slate-800 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <CalendarRange className="w-4 h-4" />
                      6. Cronograma Físico-Financeiro por Semanas ({activeProposal.timelineWeeks} Semanas)
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Desembolso Vinculado às Medições
                    </span>
                  </div>

                  <div className="overflow-x-auto border border-slate-800 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#0f2744] text-slate-200 border-b border-slate-800 text-[11px]">
                          <th className="py-2.5 px-3.5 font-bold">Fase</th>
                          <th className="py-2.5 px-3.5 font-bold">Período Semanal</th>
                          <th className="py-2.5 px-3.5 font-bold">Etapa Executiva & Entrega Técnica</th>
                          <th className="py-2.5 px-3 font-bold text-center">Avanço (%)</th>
                          <th className="py-2.5 px-3.5 font-bold text-right">Medição Prevista (R$)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-[11px] text-slate-300">
                        {activeProposal.weeklySchedule.map((sch, idx) => (
                          <tr key={idx} className="bg-[#0a192f] hover:bg-[#0f2744]/50">
                            <td className="py-2.5 px-3.5 font-mono font-bold text-amber-400 align-top whitespace-nowrap">
                              {sch.phase}
                            </td>
                            <td className="py-2.5 px-3.5 font-mono text-white font-semibold align-top whitespace-nowrap">
                              {sch.weeksLabel}
                            </td>
                            <td className="py-2.5 px-3.5 align-top">
                              <span className="font-bold text-white block">{sch.stageTitle}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                Entrega: {sch.deliverable}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-200 align-top">
                              {sch.physicalWeightPercent}%
                            </td>
                            <td className="py-2.5 px-3.5 text-right font-mono font-bold text-amber-400 align-top whitespace-nowrap">
                              {formatCurrency(sch.financialAmount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SEÇÃO 7: TERMO DE GARANTIA CONTRATUAL DE 05 ANOS */}
              <div className="bg-[#0a192f] p-4 sm:p-5 rounded-xl border border-slate-800 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    7. Termo de Garantia Contratual de 05 (Cinco) Anos
                  </span>
                  <span className="text-[10px] font-semibold bg-[#0f2744] text-amber-400 border border-slate-800 px-2.5 py-0.5 rounded">
                    Art. 618 Código Civil • ABNT NBR 15575
                  </span>
                </div>

                {activeProposal.warrantyClauses && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeProposal.warrantyClauses.map((wc, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#0f2744]/70 border border-slate-800 space-y-1.5 text-xs"
                      >
                        <span className="font-bold text-white block">{wc.category}</span>
                        <span className="inline-block text-[10px] font-semibold text-amber-400 bg-[#0a192f] border border-slate-800 px-2 py-0.5 rounded">
                          {wc.period} • {wc.normReference}
                        </span>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {wc.coverageDescription}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SEÇÃO 8: CONDIÇÕES COMERCIAIS (FORMAS DE PAGAMENTO, ENTRADA, PARCELAMENTO E FATURAMENTO) */}
              <div className="bg-[#0a192f] p-4 sm:p-5 rounded-xl border border-slate-800 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    8. Condições Comerciais, Formas de Pagamento, Entrada e Parcelamento
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Faturamento Direto CNPJ {RENOVAR_COMPANY_CNPJ}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-[#0f2744] p-3.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">
                      Entrada / Mobilização (20%)
                    </span>
                    <span className="font-bold text-amber-400 font-mono text-sm mt-0.5 block">
                      {formatCurrency(activeProposal.totalPrice * 0.2)}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Na assinatura p/ ART, balancins e insumos
                    </span>
                  </div>

                  <div className="bg-[#0f2744] p-3.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">
                      Saldo Parcelado (80% em Medições)
                    </span>
                    <span className="font-bold text-white font-mono text-sm mt-0.5 block">
                      {formatCurrency(activeProposal.totalPrice * 0.8)}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Em até 06x ou conforme cronograma semanal
                    </span>
                  </div>

                  <div className="bg-[#0f2744] p-3.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">
                      Opção À Vista (5% de Desconto)
                    </span>
                    <span className="font-bold text-amber-400 font-mono text-sm mt-0.5 block">
                      {formatCurrency(activeProposal.totalPrice * 0.95)}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Economia direta de {formatCurrency(activeProposal.totalPrice * 0.05)}
                    </span>
                  </div>
                </div>

                {activeProposal.commercialTermsList && (
                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    {activeProposal.commercialTermsList.map((item, idx) => (
                      <p
                        key={idx}
                        className="leading-relaxed bg-[#0f2744]/50 px-3.5 py-2 rounded-lg border border-slate-800"
                      >
                        <span className="text-amber-400 font-bold">• </span>
                        {item}
                      </p>
                    ))}
                  </div>
                )}

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

              {/* SEÇÃO 9: APROVAÇÃO & ASSINATURA DIGITAL DO CONTRATANTE / CLIENTE */}
              <div className="bg-[#0a192f] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      9. Aprovação da Proposta & Assinatura Digital do Contratante / Cliente
                    </h4>
                  </div>
                  <span className="text-[10px] bg-[#0f2744] text-slate-300 border border-slate-800 px-2.5 py-0.5 rounded font-semibold">
                    Homologação Integrada ao PDF Oficial
                  </span>
                </div>

                {activeProposal.contractAcceptance?.signed ? (
                  <div className="bg-[#0f2744] border border-amber-400/40 rounded-xl p-4 space-y-3 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2 text-amber-400 font-bold">
                        <CheckCircle2 className="w-5 h-5 text-amber-400" />
                        <span>PROPOSTA E MEMORIAL HOMOLOGADOS DIGITALMENTE PELO CONTRATANTE</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-300 bg-[#0a192f] px-2.5 py-0.5 rounded border border-slate-800">
                        {activeProposal.contractAcceptance.protocolHash}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-slate-300">
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
                        <span className="font-semibold text-white">
                          {new Date(activeProposal.contractAcceptance.signedAt).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-2.5 flex flex-col items-center justify-center border border-slate-300">
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
                      <span className="text-[11px] text-slate-300 font-medium">
                        ✓ Assinatura incorporada ao PDF Oficial para impressão
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setGeneratedProposal({
                            ...activeProposal,
                            contractAcceptance: undefined,
                          });
                        }}
                        className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                      >
                        Refazer Assinatura
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                          Nome do Contratante / Representante
                        </label>
                        <input
                          type="text"
                          value={clientSignName}
                          onChange={(e) => setClientSignName(e.target.value)}
                          placeholder="Ex: Roberto Albuquerque"
                          className="w-full px-3 py-2 bg-[#0f2744] border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                          Qualificação / Cargo
                        </label>
                        <input
                          type="text"
                          value={clientSignRole}
                          onChange={(e) => setClientSignRole(e.target.value)}
                          placeholder="Ex: Contratante / Administrador"
                          className="w-full px-3 py-2 bg-[#0f2744] border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
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
                          className="w-full px-3 py-2 bg-[#0f2744] border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] text-slate-300 font-semibold">
                          Assinatura Digital do Contratante (Mouse ou Toque em Tela):
                        </label>
                        <button
                          type="button"
                          onClick={clearSignature}
                          className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Limpar Quadro</span>
                        </button>
                      </div>

                      <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-white">
                        <canvas
                          ref={canvasRef}
                          width={640}
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
                            <span>Assine aqui para homologar a proposta comercial</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setShowPdfModal(true)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0f2744] hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-amber-400" />
                        <span>Visualizar / Baixar PDF Oficial</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleApproveContract}
                        disabled={!hasDrawn}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Homologar Proposta & Registrar Assinatura</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
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
