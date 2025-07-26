
export interface Patient {
  id: string;
  name: string;
  birthDate: string;
  cpf: string;
  cns: string; // Cartão Nacional de Saúde
  phone: string;
  address: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  crm: string;
  phone: string;
  email: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'agendado' | 'confirmado' | 'realizado' | 'cancelado' | 'remarcado';
  notes?: string;
  priority: 'normal' | 'urgente' | 'emergência';
}

export interface Medication {
  id: string;
  name: string;
  description: string;
  category: string;
  stock: number;
  unit: string;
  expirationDate: string;
  batchNumber: string;
  minimumStock: number;
}

export interface MedicationDispensing {
  id: string;
  medicationId: string;
  medicationName: string;
  patientId: string;
  patientName: string;
  quantity: number;
  date: string;
  prescribedBy: string;
  dispensedBy: string;
}

export interface HealthCampaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  targetAudience: string;
  location: string;
  status: 'planejada' | 'em andamento' | 'concluída' | 'cancelada';
  coverageGoal: number;
  currentCoverage: number;
}

export interface HealthProgram {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  startDate: string;
  endDate?: string;
  coordinator: string;
  status: 'ativo' | 'inativo' | 'em planejamento';
  enrolledPatients: number;
  metrics: { [key: string]: number };
}

export interface Exam {
  id: string;
  patientId: string;
  patientName: string;
  examType: string;
  requestDate: string;
  scheduledDate?: string;
  resultDate?: string;
  status: 'solicitado' | 'agendado' | 'realizado' | 'resultados disponíveis' | 'cancelado';
  requestedBy: string;
  priority: 'normal' | 'urgente' | 'emergência';
  notes?: string;
}

export interface TFDReferral {
  id: string;
  patientId: string;
  patientName: string;
  originUnit: string;
  destinationUnit: string;
  specialtyRequired: string;
  referralDate: string;
  scheduledDate?: string;
  status: 'solicitado' | 'aprovado' | 'em andamento' | 'concluído' | 'negado';
  priority: 'normal' | 'urgente' | 'emergência';
  transportation: 'terrestre' | 'aéreo' | 'não necessário';
  accommodationNeeded: boolean;
  medicalReport: string;
}

export interface ACSVisit {
  id: string;
  agentName: string;
  area: string;
  micro: string;
  familyId: string;
  address: string;
  visitDate: string;
  visitTime: string;
  visitType: 'rotina' | 'acompanhamento' | 'busca ativa' | 'primeira visita';
  completed: boolean;
  findings: string;
  followUpRequired: boolean;
}

export interface PatientTransport {
  id: string;
  patientId: string;
  patientName: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  returnScheduled: boolean;
  returnDate?: string;
  returnTime?: string;
  reason: string;
  specialRequirements?: string;
  vehicleType: 'ambulância' | 'van' | 'carro' | 'outro';
  status: 'agendado' | 'em andamento' | 'concluído' | 'cancelado';
  responsibleName: string;
}
