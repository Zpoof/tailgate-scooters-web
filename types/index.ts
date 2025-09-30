export interface User {
  id: string
  email: string
  full_name: string
  phone_number?: string | null
  profile_image_url?: string | null
  stripe_customer_id?: string | null
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Scooter {
  id: string
  title: string
  brand: string
  model: string
  condition: 'Excellent' | 'Good' | 'Fair' | 'Needs Repair'
  plan_type: 'basic' | 'premium'
  monthly_price: number
  purchase_price?: number | null
  description: string
  images: string[]
  owner_id: string
  owner_name: string
  location: string
  is_available: boolean
  created_at: string
  battery_life?: string | null
  max_speed?: string | null
  range?: string | null
}

export interface Subscription {
  id: string
  user_id: string
  scooter_id: string
  stripe_subscription_id: string
  stripe_customer_id: string
  status: 'pending' | 'active' | 'paused' | 'completed' | 'cancelled' | 'expired'
  semester: 'Fall Semester' | 'Spring Semester' | 'Whole Year'
  monthly_price: number
  security_deposit: number
  delivery_address: string
  contact_number: string
  delivery_date: string
  delivery_time: string
  lease_start_date?: string | null
  lease_end_date?: string | null
  created_at: string
  updated_at?: string | null
}

export interface PaymentTransaction {
  id: string
  user_id: string
  subscription_id?: string | null
  amount: number
  transaction_type: 'deposit' | 'monthly_payment' | 'refund' | 'penalty' | 'bonus'
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
  description: string
  stripe_payment_intent_id?: string | null
  created_at: string
  updated_at?: string | null
}
