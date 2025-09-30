# Tailgate Scooters Web

A production-ready web application for Tailgate Scooters - Cornell's premier scooter marketplace. Built with Next.js, TypeScript, Supabase, and Stripe.

## 🚀 Features

- **Dual Pricing Plans**: Basic ($1.25/day) and Premium ($1.75/day) scooter options
- **Authentication**: Secure email-based authentication with magic links
- **Scooter Marketplace**: Browse and filter scooters by plan type
- **Payment Processing**: Integrated Stripe checkout for secure payments
- **User Dashboard**: Manage profile and subscriptions
- **Responsive Design**: Beautiful, mobile-first UI with Tailwind CSS
- **Real-time Updates**: Powered by Supabase real-time subscriptions

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom components
- **State Management**: React Query

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Stripe account
- Environment variables configured

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tailgate-scooters-web
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🗄️ Database Setup

1. Run the following SQL in your Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  profile_image_url TEXT,
  stripe_customer_id TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create scooters table
CREATE TABLE scooters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  condition TEXT CHECK (condition IN ('Excellent', 'Good', 'Fair', 'Needs Repair')),
  plan_type TEXT CHECK (plan_type IN ('basic', 'premium')) NOT NULL DEFAULT 'basic',
  monthly_price DECIMAL(10, 2) NOT NULL,
  purchase_price DECIMAL(10, 2),
  description TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  owner_id TEXT DEFAULT 'tailgatescooters',
  owner_name TEXT DEFAULT 'Tailgate Scooters',
  location TEXT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  battery_life TEXT,
  max_speed TEXT,
  range TEXT
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  scooter_id UUID REFERENCES scooters(id),
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'active', 'paused', 'completed', 'cancelled', 'expired')),
  semester TEXT CHECK (semester IN ('Fall Semester', 'Spring Semester', 'Whole Year')),
  monthly_price DECIMAL(10, 2) NOT NULL,
  security_deposit DECIMAL(10, 2) NOT NULL,
  delivery_address TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  delivery_date DATE NOT NULL,
  delivery_time TEXT NOT NULL,
  lease_start_date DATE,
  lease_end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Create payment_transactions table
CREATE TABLE payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  subscription_id UUID REFERENCES subscriptions(id),
  amount DECIMAL(10, 2) NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('deposit', 'monthly_payment', 'refund', 'penalty', 'bonus')),
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  description TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scooters ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view available scooters" ON scooters
  FOR SELECT USING (true);

CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own transactions" ON payment_transactions
  FOR SELECT USING (auth.uid() = user_id);
```

2. Insert some sample scooters:

```sql
INSERT INTO scooters (title, brand, model, condition, plan_type, monthly_price, description, location, battery_life, max_speed, range)
VALUES 
  ('Basic Segway Ninebot E22', 'Segway', 'Ninebot E22', 'Excellent', 'basic', 37.50, 'Affordable and reliable. Perfect for daily campus commuting at just $1.25/day.', 'West Campus Pickup', '11 mile range', '12 mph', '11 miles'),
  ('Premium Segway Ninebot ES2', 'Segway', 'Ninebot ES2', 'Excellent', 'premium', 52.50, 'Premium scooter with superior build quality and extended range at $1.75/day.', 'North Campus Pickup', '19 mile range', '15 mph', '19 miles');
```

## 💻 Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🏗️ Building for Production

```bash
npm run build
npm run start
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 🔒 Security

- All API routes require authentication
- Stripe webhooks are verified
- Database access controlled by Row Level Security
- Environment variables for sensitive data

## 📝 License

This project is private and intended for Cornell University students.

## 🤝 Support

For issues or questions, please contact the development team.