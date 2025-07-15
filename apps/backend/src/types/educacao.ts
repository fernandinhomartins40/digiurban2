
// Tipos existentes
export interface Occurrence {
  id: string;
  studentId: string;
  studentName: string;
  schoolId: string;
  schoolName: string;
  date: string;
  type: string;
  severity: string;
  description: string;
  reportedById: string;
  reportedByName: string;
  reportedByRole: string;
  measures?: string;
  parentNotified: boolean;
  parentResponse?: string;
  resolved: boolean;
  resolutionDate?: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  location?: string;
  type: string;
  schoolId?: string;
  schoolName?: string;
  grades?: string[];
  classes?: string[];
  organizer: {
    id: string;
    name: string;
    role: string;
  };
  participants?: {
    type: string;
    required: boolean;
  }[];
  color?: string;
}

// Novos tipos para o módulo de Educação
export interface School {
  id: string;
  name: string;
  address: string;
  type: string;
  principal: string;
  phone: string;
  email: string;
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  active: boolean;
}

export interface Student {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  documentNumber: string;
  motherName: string;
  fatherName?: string;
  guardianName?: string;
  guardianPhone: string;
  guardianEmail?: string;
  address: string;
  enrollments: Enrollment[];
  specialNeeds?: string;
  healthIssues?: string;
  observations?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  schoolId: string;
  schoolName: string;
  grade: string;
  className: string;
  schoolYear: string;
  status: string;
  enrollmentDate: string;
  withdrawalDate?: string;
  observations?: string;
}

export interface MealPlan {
  id: string;
  name: string;
  schoolId: string;
  schoolName: string;
  date: string;
  weekDay: string;
  breakfast?: string;
  morningSnack?: string;
  lunch: string;
  afternoonSnack?: string;
  dinner?: string;
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  allergens?: string[];
  specialDiets?: string[];
}

export interface TransportRoute {
  id: string;
  name: string;
  description: string;
  vehicle: {
    id: string;
    type: string;
    plate: string;
    capacity: number;
    driver: string;
    helper?: string;
  };
  schools: {
    id: string;
    name: string;
    arrivalTime: string;
    departureTime: string;
  }[];
  stops: {
    id: string;
    name: string;
    time: string;
    location: string;
    studentsCount: number;
  }[];
  distance: number;
  estimatedTime: number;
  active: boolean;
}
