export type ServiceCategoryKey = 'sedan_comfort' | 'suv_premium' | 'mini_van';

export interface Service {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  category: string;
  basePrice: number;
  imageUrl: string;
  popular: boolean;
}

export interface Vehicle {
  id: string;
  nameAr: string;
  nameEn: string;
  category: string;
  passengers: number;
  luggage: number;
  descriptionAr: string;
  descriptionEn: string;
  imageUrl: string;
  features: string[];
}

export interface PricingRule {
  id: string;
  serviceId: string;
  vehicleCategoryId: string;
  routeName: string;
  baseRate: number;
  notes: string;
  // Structured Trip-Based Pricing fields
  origin?: string;
  destination?: string;
  sedanPrice?: number | null;
  suvPrice?: number | null;
  miniVanPrice?: number | null;
  isActive?: boolean;
  bidirectional?: boolean;
}

export type BookingStatus =
  | 'pending_review'
  | 'quote_provided'
  | 'pending_customer_approval'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'unpaid' | 'cash_collected';

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  serviceName: string;
  vehicleCategoryId: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: string;
  passengersCount: number;
  luggageCount: number;
  notes: string;
  status: BookingStatus;
  estimatedPrice: number;
  finalAgreedPrice?: number;
  priceNotes?: string;
  paymentStatus: PaymentStatus;
  adminNotes?: string;
  createdAt: string;
  // Trip-based & Internal Operational Assignment fields
  serviceCategory?: ServiceCategoryKey;
  serviceCategoryLabel?: string;
  pricingType?: 'fixed' | 'quote_required';
  assignedVehicleModel?: string;
  assignedDriverName?: string;
  assignmentStatus?: 'unassigned' | 'assigned';
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleAssigned: string;
  status: 'available' | 'on_trip' | 'offline';
}
