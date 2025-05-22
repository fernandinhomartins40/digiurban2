
export interface SchoolEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  type: "holiday" | "exam" | "event" | "meeting" | "break";
  allDay?: boolean;
  location?: string;
  color?: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  grade: string;
  teacher: string;
  room: string;
  students: number;
}

export interface SchoolActivity {
  id: string;
  title: string;
  description: string;
  date: string;
  responsible: string;
  status: string;
}

export interface Occurrence {
  id: string;
  studentId: string;
  studentName: string;
  schoolId: string;
  schoolName: string;
  date: string;
  type: "disciplinary" | "health" | "accident" | "performance" | "other";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  reportedById: string;
  reportedByName: string;
  reportedByRole: string;
  parentNotified?: boolean;
  parentResponse?: string;
  measures?: string;
  resolved?: boolean;
  resolutionDate?: string;
}
