// types.ts

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ContactMessage {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  message: string;
  created_at: string;
}

// Nueva interfaz para mapear el JSONB de logistica_y_disponibilidad
export interface Logistics {
  duracion_estimada?: string;
  no_incluye?: string[];
}

export interface Experience {
  id: number;
  slug: string;
  title: string;
  plan_type: string; // Ej: 'PLAN' | 'EXPERIENCIA' | 'PERSONALIZADA'
  destination: string;
  price: number;
  currency: string;
  tax_included: boolean;
  description: string;
  suggested_route: string[];
  included: string[];
  logistics: Logistics;
  category_id: number;
  images: string[];
  categories?: Category; 
  created_at?: string;
}

export interface Customer {
  id: string; 
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  created_at: string;
}

export interface CustomQuote {
  id: number;
  customer_name: string;
  customer_email: string;
  phone: string;
  destination: string;
  start_date?: string;
  pax_qty: number; 
  budget: string;
  special_requests: string;
  status: 'pending' | 'attended';
  created_at: string;
}

export interface Booking {
  id: string; 
  customer_id: string;
  session_id?: string; 
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  transaction_id?: string;
  payment_provider?: string;
  payment_date?: string;
  created_at: string;
  pais?: string;
  direccion?: string;
  localidad?: string;
  estado?: string;
  codigo_postal?: string;
  order_notes?: string;
  customers?: Customer; 
}

export interface BookingItem {
  id: number;
  booking_id: string;
  activity_id: number; 
  scheduled_date: string;
  scheduled_time?: string; 
  pax_qty: number; 
  unit_price: number;
  custom_destination?: string;
  activities_horizon?: { 
    title: string; 
    destination: string;
    plan_type: string;
  };
}

export interface CartItem {
  id?: number; 
  sessionId?: string; 
  activityId: number; // Reemplaza al antiguo packageId
  experience: Experience;
  date: string; 
  time?: string; 
  people: number;
  pricePerPerson: number;
  totalPrice: number; 
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface FifaExp {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  items: string[];
  image_url: string;
  order_index?: number;
}

// Interfaz optimizada para las consultas directas a Supabase
export interface SupabaseExperienceResponse {
  id: number;
  slug: string;
  title: string;
  plan_type: string;
  destination: string;
  price: number;
  currency: string;
  tax_included: boolean;
  description: string;
  images: string[]; 
  category_id: number;
  categories?: { id: number; name: string; slug: string } | null;
}