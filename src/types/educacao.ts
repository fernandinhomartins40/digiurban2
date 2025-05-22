
export interface SchoolEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  allDay?: boolean;
  location?: string;
  type: "holiday" | "exam" | "event" | "meeting" | "break" | "cultural" | "pedagogical" | "sport" | "recess";
  schoolId?: string;
  schoolName?: string;
  grades?: string[];
  classes?: string[];
  organizer?: {
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
