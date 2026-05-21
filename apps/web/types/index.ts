// ============================================================
// DentalOS — TypeScript Interfaces
// These types mirror the FastAPI backend schemas.
// Update when the OpenAPI spec changes.
// ============================================================

// ---- Auth / Users ----

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export type UserRole = "admin" | "doctor" | "receptionist" | "assistant" | "patient" | "superadmin";

export interface UserCreate {
  username: string;
  email: string;
  full_name: string;
  password: string;
  role: UserRole;
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
  password?: string;
  role?: UserRole;
  is_active?: boolean;
}

// ---- Patients ----

export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: "M" | "F" | "O";
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  medical_notes?: string;
  allergies?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface PatientCreate {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: "M" | "F" | "O";
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  medical_notes?: string;
  allergies?: string;
}

export interface PatientUpdate extends Partial<PatientCreate> {
  is_active?: boolean;
}

// ---- Appointments ----

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
  updated_at?: string;
  // Populated by the API in some endpoints
  patient?: Patient;
  doctor?: User;
}

export interface AppointmentCreate {
  patient_id: number;
  doctor_id: number;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  status?: AppointmentStatus;
  notes?: string;
}

export interface AppointmentUpdate extends Partial<AppointmentCreate> {}

// ---- Treatments / Services ----

export interface Treatment {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  category?: string;
  is_active: boolean;
  created_at: string;
}

export interface TreatmentCreate {
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  category?: string;
}

// ---- Clinical Records ----

export interface ClinicalRecord {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id?: number;
  diagnosis: string;
  treatment_plan?: string;
  notes?: string;
  tooth_number?: string;
  created_at: string;
  updated_at?: string;
}

export interface ClinicalRecordCreate {
  patient_id: number;
  doctor_id?: number;
  appointment_id?: number;
  diagnosis: string;
  treatment_plan?: string;
  notes?: string;
  tooth_number?: string;
}

// ---- Pagination ----

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// ---- Dashboard Stats ----

export interface DashboardStats {
  total_patients: number;
  total_appointments_today: number;
  total_appointments_week: number;
  total_revenue_month: number;
  upcoming_appointments: Appointment[];
  recent_patients: Patient[];
}
