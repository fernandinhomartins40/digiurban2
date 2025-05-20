
export interface Student {
  id: string;
  name: string;
  dateOfBirth: string;
  registrationNumber: string;
  schoolId: string;
  grade: string;
  class: string;
  parentName: string;
  parentContact: string;
  address: string;
  documentUrl?: string;
  status: "active" | "inactive" | "transferred" | "pending";
}

export interface School {
  id: string;
  name: string;
  type: "school" | "cmei";
  address: string;
  phone: string;
  email: string;
  director: string;
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  availableSeats: number;
  infrastructure: string[];
  rating?: number;
  imageUrl?: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  schoolId: string;
  schoolName: string;
  grade: string;
  class: string;
  year: number;
  status: "requested" | "analyzing" | "approved" | "denied" | "waiting";
  requestDate: string;
  approvalDate?: string;
  documents: {
    name: string;
    uploaded: boolean;
    url?: string;
  }[];
}

export interface Transport {
  id: string;
  routeName: string;
  vehicle: {
    id: string;
    type: "bus" | "van" | "car";
    plate: string;
    capacity: number;
    model: string;
    year: number;
  };
  driver: {
    id: string;
    name: string;
    license: string;
    contact: string;
    photo?: string;
  };
  schools: {
    id: string;
    name: string;
  }[];
  students: {
    id: string;
    name: string;
    grade: string;
    pickupPoint: string;
    pickupTime: string;
    dropoffTime: string;
  }[];
  schedule: {
    departureTime: string;
    arrivalTime: string;
    days: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday")[];
  };
  stops: {
    name: string;
    time: string;
    location: {
      lat: number;
      lng: number;
    };
  }[];
  status: "active" | "inactive" | "maintenance";
}

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  schoolId: string;
  schoolName: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  term: string;
  value: number;
  maxValue: number;
  date: string;
  evaluationType: "test" | "project" | "presentation" | "homework" | "participation";
  comments?: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  schoolId: string;
  schoolName: string;
  classId: string;
  className: string;
  date: string;
  status: "present" | "absent" | "justified" | "late";
  justification?: string;
}

export interface Communication {
  id: string;
  type: "message" | "meeting" | "announcement" | "alert";
  title: string;
  content: string;
  senderId: string;
  senderName: string;
  senderRole: "teacher" | "director" | "coordinator" | "secretary";
  recipients: {
    type: "student" | "class" | "grade" | "school" | "all";
    id?: string;
    name?: string;
  }[];
  date: string;
  readBy: string[];
  attachments?: {
    name: string;
    url: string;
  }[];
  meetingDate?: string;
  meetingLocation?: string;
  requiresResponse: boolean;
  responses?: {
    userId: string;
    userName: string;
    response: string;
    date: string;
  }[];
}

export interface Menu {
  id: string;
  schoolId: string;
  schoolName: string;
  week: string;
  year: number;
  meals: {
    day: string;
    breakfast?: string;
    lunch: string;
    snack?: string;
    dinner?: string;
  }[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  specialDiets: {
    type: string;
    alternatives: {
      day: string;
      meal: string;
      alternative: string;
    }[];
  }[];
  feedback?: {
    rating: number;
    comments: string;
  }[];
}

export interface Occurrence {
  id: string;
  studentId: string;
  studentName: string;
  schoolId: string;
  schoolName: string;
  date: string;
  type: "disciplinary" | "accident" | "health" | "performance" | "other";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  reportedById: string;
  reportedByName: string;
  reportedByRole: "teacher" | "director" | "coordinator" | "other";
  measures?: string;
  parentNotified: boolean;
  parentResponse?: string;
  resolved: boolean;
  resolutionDate?: string;
  attachments?: {
    name: string;
    url: string;
  }[];
}

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  location: string;
  type: "holiday" | "recess" | "pedagogical" | "cultural" | "sport" | "meeting" | "exam";
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
    type: "students" | "teachers" | "parents" | "staff" | "community";
    required: boolean;
  }[];
  color?: string;
}
