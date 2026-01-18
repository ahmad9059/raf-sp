# RAF-SP Platform - Regional Agriculture Facilities South Punjab

A comprehensive web-based asset management and resource tracking system designed for managing agriculture departments across South Punjab, Pakistan. The platform enables multiple agricultural research institutes, laboratories, and departments to efficiently manage their equipment inventory, track maintenance activities, and visualize asset data through role-based dashboards.

## 🌾 Overview

RAF-SP (Repair & Facility - Smart Platform) is a specialized government agriculture management system that consolidates and digitizes asset information from various agricultural departments across South Punjab. The system serves as a centralized platform for:

- **15+ Agricultural Departments** including research institutes, testing laboratories, and university facilities
- **Equipment & Asset Tracking** for agricultural machinery, laboratory equipment, and research facilities
- **Resource Management** for staff, infrastructure, and departmental resources
- **Real-time Analytics** with interactive dashboards and data visualization

### Live Demo
🔗 **[https://raf-sp.vercel.app](https://raf-sp.vercel.app)**

---

## 🏛️ Participating Departments

The platform manages data for the following agriculture departments in South Punjab:

1. **Mango Research Institute (MRI)** - Mango cultivation and post-harvest research
2. **Cotton Research Institute (CRI)** - Cotton variety development and pest management
3. **Adaptive Research Center (ARC)** - Agricultural research and development
4. **Entomological Research Sub-Station (ERSS)** - Pest control and entomology research
5. **Agricultural Engineering** - Farm mechanization and engineering solutions
6. **Agricultural Extension Wing** - Farmer outreach and extension services
7. **Agricultural Mechanization Research Institute (AMRI)** - Farm machinery research
8. **Floriculture Research Institute** - Ornamental plants and landscaping research
9. **Regional Agricultural Research Institute (RARI)** - Regional agricultural research
10. **Regional Agricultural Economic Development Centre (RAEDC)** - Training and capacity building
11. **Pesticide Quality Control Laboratory** - Pesticide testing and quality assurance
12. **Soil & Water Testing Laboratory** - Soil and water analysis services
13. **Food Science & Technology Department (Muhammad Nawaz Shareef University of Agriculture)** - Food processing research
14. **Agronomy Department (Muhammad Nawaz Shareef University of Agriculture)** - Crop production and soil management
15. **Muhammad Nawaz Shareef University of Agriculture Estate** - University farm management

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- Secure NextAuth v5 authentication system
- Role-based access control (ADMIN, DEPT_HEAD)
- Department-specific user accounts with unique credentials
- Protected routes and API endpoints

### 📊 Department Dashboards
- **Customized Dashboards** for each department type
- **Real-time Statistics** on equipment status and inventory
- **Interactive Charts** using Recharts for data visualization
- **Equipment Status Tracking** (Available, In Use, Needs Repair, Discarded)
- **Maintenance History** and repair logs

### 🔧 Asset Management
- Comprehensive equipment inventory tracking
- Machinery status monitoring (Functional/Non-functional)
- Laboratory equipment and infrastructure management
- Human resource tracking (staff positions and scales)
- Building and facility documentation

### 📈 Analytics & Reporting
- Visual analytics with pie charts, bar graphs, and trend analysis
- Equipment utilization statistics
- Status-based filtering and sorting
- Export capabilities for reports

### 📁 Bulk Data Import
- CSV file upload for equipment data
- PDF parsing for document-based data entry
- Automated data processing and validation

### 🎨 Modern UI/UX
- Government-themed landing page
- Responsive design for all devices
- Clean, professional interface using Shadcn UI components
- Smooth animations with Framer Motion
- Accessible and user-friendly navigation

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 16 (React 19)
- **Styling:** Tailwind CSS with custom government theme
- **UI Components:** Shadcn UI, Radix UI
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Forms:** React Hook Form with Zod validation
- **State Management:** TanStack React Query

### Backend
- **Runtime:** Node.js
- **Framework:** Next.js API Routes
- **Authentication:** NextAuth v5
- **ORM:** Prisma
- **Database:** PostgreSQL (via Supabase)
- **File Parsing:** PapaParse (CSV), pdf-parse (PDF)

### Infrastructure
- **Hosting:** Vercel
- **Database:** Supabase (PostgreSQL)
- **Version Control:** Git/GitHub
- **Package Manager:** npm

---

## 📋 Prerequisites

Before setting up the project, ensure you have:

- Node.js 18.x or higher
- npm or yarn package manager
- PostgreSQL database (or Supabase account)
- Git for version control

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/AliAbdullahpgr/raf-sp.git
cd raf-sp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@host:port/database"

# NextAuth Configuration
AUTH_SECRET="your-auth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Supabase Configuration (Optional)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 4. Database Setup

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma db push
```

### 5. Seed Department Data

The platform includes seeding scripts for all departments:

```bash
# Seed all departments
npm run seed

# Or seed specific departments
npm run seed:ento
ts-node scripts/seed-mri.ts
ts-node scripts/seed-cri.ts
ts-node scripts/seed-amri.ts
# ... and so on for other departments
```

### 6. Create Admin Account

Run the admin creation SQL script in your database:

```sql
-- See create-admin.sql for full script
```

### 7. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

---

## 📂 Project Structure

```
raf-sp/
├── actions/              # Server actions for data mutations
├── app/                  # Next.js 14 app directory
│   ├── (auth)/          # Authentication routes
│   ├── admin/           # Admin dashboard
│   ├── department/      # Department-specific pages
│   └── api/             # API routes
├── components/           # React components
│   ├── departments/     # Department-specific components
│   ├── ui/              # Reusable UI components
│   └── ...
├── lib/                 # Utility functions and configurations
│   ├── data/            # Static data files
│   └── ...
├── prisma/              # Database schema and migrations
│   └── schema.prisma
├── scripts/             # Database seeding scripts
│   ├── seed-*.ts        # Department-specific seeders
│   └── ...
├── public/              # Static assets (images, logos)
├── types/               # TypeScript type definitions
└── ...
```

---

## 🔑 Department Login Credentials

Each department has dedicated login credentials. See `DEPARTMENT_LOGIN_CREDENTIALS.md` for complete details.

**Default Password:** `ChangeMe123!` (All departments - to be changed on first login)

**Sample Logins:**
- **MRI:** abidhameedkhan@yahoo.com
- **CRI:** dircrimm@gmail.com
- **AMRI:** focalperson@amri.gov.pk
- **Admin:** admin@raf-sp.gov.pk

*Note: Change all default passwords in production.*

---

## 📱 Features by Department Type

### Research Institutes (MRI, CRI, RARI, etc.)
- Research equipment tracking
- Project management
- Staff and researcher details
- Publication records

### Testing Laboratories (Pesticide QC, Soil & Water)
- Lab equipment inventory
- Testing capacity tracking
- Quality control records
- Sample processing management

### Universities (MNSUAM Departments)
- Academic equipment tracking
- Laboratory management
- Student resource allocation
- Faculty details

### Mechanization Centers (AMRI)
- Farm machinery inventory
- Functional status monitoring
- Maintenance schedules
- Equipment specifications

---

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode

# Database
npm run seed         # Seed all department data
npm run seed:ento    # Seed entomology data
```

---

## 🌐 Deployment

The application is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables
4. Deploy

For manual deployment:

```bash
npm run build
npm run start
```

---

## 📚 Documentation

- **Setup Guide:** See `SUPABASE_SETUP.md` for database configuration
- **Login Credentials:** See `DEPARTMENT_LOGIN_CREDENTIALS.md`
- **API Documentation:** Available in `/app/api` directory
- **Component Docs:** JSDoc comments in component files

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is developed for the Agriculture Department of South Punjab, Pakistan. All rights reserved.

---

## 👥 Contact & Support

For issues, questions, or support:

- **Project Repository:** [https://github.com/AliAbdullahpgr/raf-sp](https://github.com/AliAbdullahpgr/raf-sp)
- **Issues:** [GitHub Issues](https://github.com/AliAbdullahpgr/raf-sp/issues)

---

## 🙏 Acknowledgments

- Agriculture Department, Government of Punjab
- MNS University of Agriculture, Multan
- All participating research institutes and laboratories
- Development team and contributors

---

**Built with ❤️ for South Punjab Agriculture Development**