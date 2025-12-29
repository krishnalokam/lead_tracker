# Lead Tracker Application

A full-stack web application for managing leads, tracking follow-ups, and handling duplicate lead detection. Built with React (Vite) frontend and Node.js/Express backend with MySQL database.

## Features

- 📊 **Dashboard**: Overview of total leads, today's follow-ups, upcoming follow-ups, and missed follow-ups
- 👥 **Total Leads Management**: View, search, and edit all leads with follow-up dates and notes
- 📅 **Follow-up Tracking**: 
  - Today's follow-ups
  - Upcoming follow-ups
  - Missed follow-ups
- 🔄 **Duplicate Leads Detection**: Track and filter duplicate leads by date and phone number
- 📤 **CSV Import**: Bulk import leads from CSV files
- ✏️ **Lead Management**: Edit follow-up dates, notes, and status for each lead
- 🔍 **Search & Filter**: Search leads by name, phone, or email with pagination

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS** - Styling (inline styles)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL2** - Database driver
- **Multer** - File upload handling
- **CSV Parser** - CSV file processing
- **Node Cron** - Scheduled tasks
- **CORS** - Cross-origin resource sharing

## Project Structure

```
lead-tracker/
├── backend/
│   ├── database/
│   │   └── schema.sql          # Database schema
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Database configuration
│   │   ├── controllers/        # Route controllers
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Express middleware
│   │   ├── service/            # Business logic
│   │   ├── cron/               # Scheduled tasks
│   │   ├── app.js              # Express app setup
│   │   └── server.js           # Server entry point
│   ├── package.json
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── api/                # API client functions
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── public/                 # Static assets
│   ├── package.json
│   └── .gitignore
├── .gitignore
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)
- **Git**

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd lead-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=lead_tracker
PORT=5002
```

### Database Setup

1. Create a MySQL database:

```sql
CREATE DATABASE lead_tracker;
```

2. Run the schema file to create tables:

```bash
mysql -u your_username -p lead_tracker < backend/database/schema.sql
```

Or import it through MySQL Workbench or phpMyAdmin.

The schema creates two tables:
- `leads` - Main leads table with follow-up information
- `duplicate_leads` - Table for tracking duplicate leads

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5002`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

### Production Build

To build the frontend for production:

```bash
cd frontend
npm run build
```

The production build will be in the `frontend/dist` directory.

## API Endpoints

### Leads
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create a new lead
- `PUT /api/leads/:id/followup` - Update lead follow-up information
- `GET /api/leads/duplicates` - Get duplicate leads (with optional `date` and `phone` query params)
- `POST /api/leads/import` - Import leads from CSV file

### Follow-ups
- `GET /api/followup/today` - Get today's follow-ups
- `GET /api/followup/upcoming` - Get upcoming follow-ups
- `GET /api/followup/missed` - Get missed follow-ups
- `POST /api/followup` - Add a follow-up
- `PUT /api/followup/:id/status` - Update follow-up status

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard statistics

### Cron Jobs
- `GET /api/cron/mark-missed` - Manually trigger missed follow-ups marking

## Features Description

### Dashboard
- Visual pie chart showing follow-up distribution
- Clickable cards to navigate to different sections
- Real-time statistics

### Total Leads
- View all leads in a paginated table
- Search by name, phone, or email
- Edit follow-up date, notes, and status inline
- Full lead information display

### Follow-up Pages (Today/Upcoming/Missed)
- Filtered view of leads based on follow-up dates
- Edit follow-up information directly
- Update status (PENDING, COMPLETED, MISSED)
- Search functionality

### Duplicate Leads
- View all duplicate leads
- Filter by date and phone number
- Pagination support
- Clear filter options

### CSV Import
- Upload CSV files with lead data
- Sample CSV download for reference
- Automatic duplicate detection
- Import statistics (inserted/skipped)

## CSV Import Format

The CSV file should have the following columns:
- `name` (required)
- `phone` (required, must be unique)
- `email` (optional)

Sample CSV:
```csv
name,phone,email
John Doe,1234567890,john.doe@example.com
Jane Smith,9876543210,jane.smith@example.com
```

## Scheduled Tasks

The application includes a cron job that automatically marks missed follow-ups:
- Runs daily to update leads with past follow-up dates
- Changes status from PENDING to MISSED for overdue follow-ups

## Development

### Backend Scripts
- `npm run dev` - Start development server with nodemon (auto-reload)

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Database Schema

### Leads Table
- `id` - Primary key
- `name` - Lead name (required)
- `email` - Email address
- `phone` - Phone number (unique, required)
- `source` - Lead source
- `followup_date` - Follow-up date (defaults to today)
- `notes` - Follow-up notes
- `status` - Status (PENDING, COMPLETED, MISSED)
- `created_at` - Creation timestamp

### Duplicate Leads Table
- `id` - Primary key
- `name` - Lead name
- `email` - Email address
- `phone` - Phone number
- `source` - Lead source
- `created_at` - Creation timestamp

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues and questions, please open an issue in the repository.

