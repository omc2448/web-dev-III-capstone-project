# 🏠 RentEasy – Property Rental Listing

**Web Development Capstone Project — 3rd Semester**  
**KR Mangalam University**

| Student Name | Roll Number | Course / Subject | Academic Semester |
| :--- | :--- | :--- | :--- |
| **Om Chaurasia** | **2501010063** | Web Development | 3rd Semester |

---

## 📌 Project Overview

**RentEasy** is a full-stack MERN (MongoDB, Express, React, Node.js) property rental platform designed to streamline real estate listings, tenant-owner enquiries, in-person visit scheduling, and market analytics in the Gurugram & NCR metropolitan area.

Owners list properties with full specifications (rent, location, amenities, bedrooms, furnishing status), tenants search and shortlist rentals with responsive range filtering and book physical visits, and administrators oversee listings through an approval workflow and live area-wise average rental aggregation analytics.

---

## 🚀 Key Features & Assignment Compliance

| Requirement from Specification | Implementation Details | Status |
| :--- | :--- | :---: |
| **Roles: tenant, owner, admin** | Role-based JWT authentication (`tenant`, `owner`, `admin`) with protected frontend & backend routes. | ✅ Complete |
| **Property CRUD with rent, location, type & amenities** | Full Create, Read, Update, Delete for owners with rent, security deposit, address, area, city, bedrooms, bathrooms, and amenities list. | ✅ Complete |
| **Search with range filters & sorting** | Real-time search by area/keyword, range filtering by minimum/maximum rent, bedrooms filter, property type filter, and price/date sorting. | ✅ Complete |
| **Enquiry & visit-request flow** | Tenant proposes visit date with custom message; Owner accepts or declines visit requests with status tracking and confirmation notes. | ✅ Complete |
| **Saved properties per tenant** | Shortlist bookmarking feature with 1-click heart toggle, stored per tenant in MongoDB. | ✅ Complete |
| **Admin approval of new listings** | Owner-created properties start in `pending` status. Administrator reviews and approves or rejects submissions. | ✅ Complete |
| **Area-wise average rent using aggregation** | High-performance MongoDB Aggregation Pipeline (`$match`, `$group`, `$project`, `$sort`) calculating real-time area average, min, and max rents. | ✅ Complete |

---

## 🛠️ Technology Stack

### Backend
- **Node.js & Express.js**: RESTful API design, controller-route architecture, error middleware.
- **MongoDB & Mongoose**: Object Data Modeling (ODM), compound indexing, and Aggregation pipelines.
- **jsonwebtoken (JWT)**: Stateless token-based authentication and role authorization middleware.
- **bcryptjs**: Salt-hashed password storage.
- **dotenv & cors**: Configuration management and Cross-Origin Resource Sharing.

### Frontend
- **React.js (Vite)**: Modern component-driven single-page architecture.
- **React Router DOM v6**: Client-side protected routing, dynamic URL parameters, and redirects.
- **Context API**: Global state management for authentication (`AuthContext`) and favorites (`SavedContext`).
- **Tailwind CSS**: Modern, mobile-responsive styling and typography.
- **Lucide React**: Clean SVG iconography.
- **Fetch API**: Native promise-based HTTP client.

---

## 👥 Demo Test Accounts

The database comes pre-seeded with test accounts for each role:

| Role | Email Address | Password | Permissions & Dashboard |
| :--- | :--- | :--- | :--- |
| 👑 **Administrator** | `admin@renteasy.com` | `password123` | Listing approval/rejection queue, MongoDB area aggregation metrics, user and property stats. |
| 🏢 **Property Owner** | `owner@renteasy.com` | `password123` | Add/Edit/Delete listings, track approval status, accept/decline tenant visit requests. |
| 🏠 **Tenant** | `tenant@renteasy.com` | `password123` | Search & filter rentals, save properties to wishlist, book visits & send enquiries. |

*(You can also use the 1-Click Demo Login buttons directly on the Login page).*

---

## ⚡ Quick Start Instructions

### Option 1: 1-Click Launch (Recommended for Windows)
Simply double-click the included batch script in the root directory:
```bash
start-all.bat
```
This automatically boots MongoDB, starts the Express backend on `http://localhost:5000`, and opens the React frontend on `http://localhost:3000`.

---

### Option 2: Manual Terminal Execution

#### 1. Start MongoDB
Ensure MongoDB is running locally on port `27017`:
```powershell
"C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe" --dbpath "./data/db" --bind_ip 127.0.0.1 --port 27017
```

#### 2. Start Backend Server
```bash
cd backend
npm install
npm run seed     # (Optional) Resets and seeds sample properties & demo accounts
npm start
```
*Backend runs at `http://localhost:5000`.*

#### 3. Start Frontend Client
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:3000`.*

---

## 📊 MongoDB Aggregation Pipeline Specification

The area-wise average rent calculation requested in the assignment is executed in `backend/controllers/adminController.js`:

```javascript
const aggregationResult = await Property.aggregate([
  // Stage 1: Only aggregate approved public listings
  {
    $match: { status: 'approved' }
  },
  // Stage 2: Group by Area and calculate mathematical aggregates
  {
    $group: {
      _id: {
        area: '$location.area',
        city: '$location.city'
      },
      averageRent: { $avg: '$rent' },
      minRent: { $min: '$rent' },
      maxRent: { $max: '$rent' },
      totalListings: { $sum: 1 },
      avgBedrooms: { $avg: '$bedrooms' }
    }
  },
  // Stage 3: Format output projection and round average rent
  {
    $project: {
      _id: 0,
      area: '$_id.area',
      city: '$_id.city',
      averageRent: { $round: ['$averageRent', 2] },
      minRent: '$minRent',
      maxRent: '$maxRent',
      totalListings: '$totalListings',
      avgBedrooms: { $round: ['$avgBedrooms', 1] }
    }
  },
  // Stage 4: Order by average rent descending
  {
    $sort: { averageRent: -1 }
  }
]);
```

---

## 🗂️ Project Directory Structure

```text
webdev 3rd sem capstone/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile
│   │   ├── propertyController.js # Property CRUD, range filters, sorting
│   │   ├── enquiryController.js  # Visit request booking & owner responses
│   │   ├── savedController.js    # Wishlist bookmarking toggle & retrieval
│   │   └── adminController.js    # Listing approvals & MongoDB aggregations
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification & RBAC role guards
│   ├── models/
│   │   ├── User.js               # Tenant, Owner, Admin schema
│   │   ├── Property.js           # Rental property schema with location & amenities
│   │   ├── Enquiry.js            # Enquiry & visit booking schema
│   │   └── SavedProperty.js      # Saved property bookmark schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── enquiryRoutes.js
│   │   ├── savedRoutes.js
│   │   └── adminRoutes.js
│   ├── scripts/
│   │   └── seed.js               # Database seeder with realistic NCR properties
│   ├── .env                      # Environment config (Port, Mongo URI, Secret)
│   ├── package.json
│   └── server.js                 # Express application root
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar with role badges & student info
│   │   │   ├── Footer.jsx        # Academic credits & submission footer
│   │   │   ├── PropertyCard.jsx  # Reusable property card with wishlist toggle
│   │   │   └── SearchFilterBar.jsx# Keyword search, rent sliders, BHK & sorting
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Global auth state & JWT token management
│   │   │   └── SavedContext.jsx  # Wishlist state management
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Discover properties, hero section, filters
│   │   │   ├── PropertyDetailPage.jsx # Full gallery, specs, enquiry & visit booking
│   │   │   ├── LoginPage.jsx     # Login with 1-click demo role buttons
│   │   │   ├── RegisterPage.jsx  # Registration with role toggle (Tenant/Owner)
│   │   │   ├── TenantDashboard.jsx # Visit status tracking & saved shortlist
│   │   │   ├── OwnerDashboard.jsx  # Property CRUD modal & visit request decisioning
│   │   │   ├── AdminDashboard.jsx  # Approval queue & live aggregation tables
│   │   │   └── AnalyticsPage.jsx # Public area rent comparison charts & tables
│   │   ├── App.jsx               # Protected route tree
│   │   ├── main.jsx              # React DOM entry
│   │   └── index.css             # Tailwind CSS directives
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── start-all.bat                 # 1-Click application launcher
├── start-mongo.bat               # Starts local MongoDB instance
├── start-backend.bat             # Starts Express server
├── start-frontend.bat            # Starts React Vite client
├── PROJECT_REPORT.md             # Formal academic submission documentation
└── README.md                     # Project documentation
```

---

## 👨‍🎓 Project Credits & Submission

- **Student**: Om Chaurasia
- **Roll Number**: 2501010063
- **Institution**: KR Mangalam University
- **Subject**: Web Development (3rd Semester Capstone)
