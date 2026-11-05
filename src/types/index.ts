export type Role = 'gestor' | 'supervisor' | 'operador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  roleLabel: string;
  avatar?: string;
}

export interface FinancialStats {
  entradas: number;     // R$ 27.000,00
  saidas: number;       // R$ 14.100,00
  aReceber: number;     // R$ 18.200,00
  resultadoObra: number;// R$ 12.900,00
}

export interface Obra {
  id: string;
  name: string;
  location: string;
  city: string;
  towers: number;
  floors: number;
  progress: number;
  status: 'em_andamento' | 'planejamento' | 'concluida' | 'inspecao';
  manager: string;
  crewCount: number;
  startDate: string;
  estimatedEndDate: string;
  facadeAreaM2: number;
  primaryPathology: string;
  latitude?: number;
  longitude?: number;
  geofenceRadiusMeters?: number;
}

export interface BudgetServiceItem {
  code: string;
  description: string;
  methodology: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PathologyDiagnosisItem {
  code: string;
  pathology: string;
  severityLabel: string;
  technicalOrigin: string;
  riskImpact: string;
  normativeTherapy: string;
}

export interface WarrantyClauseItem {
  category: string;
  period: string;
  coverageDescription: string;
  normReference: string;
}

export interface ContractAcceptance {
  signed: boolean;
  clientName: string;
  clientRole: string; // Contratante / Responsável Legal
  clientDocument: string; // CPF ou CNPJ
  signedAt: string;
  signatureDataUrl: string; // Base64 drawing
  protocolHash: string;
}

export interface BudgetProposal {
  id: string;
  protocol: string;
  condoName: string;
  location: string;
  towers: number;
  floors: number;
  estimatedArea: number;
  pathologies: string[];
  urgency: string;
  notes?: string;
  title: string;
  executiveSummary: string;
  scopeDeclaration?: string;
  environmentalClassification?: string;
  pathologyDiagnostics?: PathologyDiagnosisItem[];
  norms: string[];
  services: BudgetServiceItem[];
  methodologyHighlights: {
    step: number;
    phaseCode?: string;
    title: string;
    detail: string;
    technicalStandard?: string;
  }[];
  materialSpecifications?: string[];
  warrantyClauses?: WarrantyClauseItem[];
  contractualTerms?: string[];
  timelineWeeks: number;
  warrantyYears: number;
  paymentConditions: string;
  subtotal: number;
  bdiPercent: number;
  totalPrice: number;
  technicalResponsible: string;
  createdAt: string;
  contractAcceptance?: ContractAcceptance;
}

export interface CronogramaStage {
  id: string;
  stageNumber: number;
  title: string;
  category: string;
  description: string;
  startWeek: number; // 1 a 12
  endWeek: number;   // 1 a 12
  progressPercent: number; // 0 a 100
  weightPercent: number; // % do total
  financialAmount: number; // R$
  status: 'concluido' | 'em_andamento' | 'programado';
  criticalChecklist: string[];
}

export interface ObraCronograma {
  obraId: string;
  obraName: string;
  totalWeeks: number; // 12
  currentWeek: number; // ex: 6
  totalBudget: number;
  executedFinancial: number;
  stages: CronogramaStage[];
}

export type PathologyType = 
  | 'fissura'
  | 'desplacamento'
  | 'eflorescencia'
  | 'armadura'
  | 'junta'
  | 'infiltracao';

export type PathologySeverity = 'leve' | 'media' | 'critica';

export interface PhotoReport {
  id: string;
  condoName: string;
  category: PathologyType;
  categoryLabel: string;
  title: string;
  description: string;
  technicalDiagnosis: string;
  severity: PathologySeverity;
  locationTag: string;
  imageUrl: string;
  technician: string;
  date: string;
  status: 'identificado' | 'em_tratamento' | 'recuperado';
  recommendedIntervention: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  cpfMasked: string;
  nr35Certified: boolean;
  nr18Certified: boolean;
  asoValidUntil: string;
  allocatedObra: string;
}

export interface GpsCoordinate {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  timestamp: string; // ISO ou HH:mm:ss
  addressDescription?: string;
  distanceToObraMeters?: number;
  isWithinGeofence?: boolean;
}

export interface TimesheetPunchGps {
  entrada?: GpsCoordinate;
  almocoIda?: GpsCoordinate;
  almocoVolta?: GpsCoordinate;
  saida?: GpsCoordinate;
}

export interface TimesheetEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  entryTime: string; // 07:30
  lunchStartTime: string; // 12:00
  lunchEndTime: string; // 13:00
  exitTime: string; // 17:30
  regularHours: number;
  overtime50: number;
  overtime100: number;
  obraName: string;
  epiVerified: boolean;
  balancimInspectionOk: boolean;
  status: 'aprovado' | 'pendente' | 'em_revisao';
  notes?: string;
  gpsLocation?: GpsCoordinate;
  punchesGps?: TimesheetPunchGps;
  isWithinGeofence?: boolean;
  verificationHash?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  rpsNumber: string;
  verificationCode: string;
  condoName: string;
  condoCnpj: string;
  condoAddress: string;
  city: string;
  serviceDescription: string;
  grossAmount: number;
  inssRetentionRate: number; // 11%
  inssRetentionAmount: number;
  issRetentionRate: number; // 2% a 5%
  issRetentionAmount: number;
  netAmount: number;
  issueDate: string;
  dueDate: string;
  status: 'emitida' | 'paga' | 'aguardando_retencao';
  measurementReference: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: 'cronograma' | 'orcamento_aprovado' | 'seguranca' | 'fiscal';
  createdAt: string; // ISO date
  read: boolean;
  urgency?: 'alta' | 'media' | 'baixa';
  actionTab?: string;
  relatedEntityId?: string;
}

