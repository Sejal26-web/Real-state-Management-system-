
Real Estate Consultant Management System

A full-stack Real Estate CRM application built using MERN Stack (MongoDB, Express.js, React.js, Node.js).
This system helps manage leads, customers, properties, rentals, sales, and role-based access for Admins and Agents.

 Project Overview

The Real Estate Consultant Management System is designed to streamline real estate operations such as:

* Managing leads and converting them into customers
* Assigning leads to agents
* Managing properties for rent and sale
* Handling rentals, payments, and move-outs
* Managing sales transactions
* Role-based authentication and authorization
* Secure APIs with JWT authentication
* Simple and clean frontend dashboard

 User Roles & Access

1️⃣ Admin

* Login to system
* Create & manage agents
* View all leads, customers, properties, rentals, and sales
* Assign leads to agents
* Full access to all APIs

 2️⃣ Real Estate Consultant / Agent

* Login to system
* View assigned leads
* Update lead status
* Convert leads into customers
* Manage rentals and sales (assigned only)

3️⃣ Customer

* Created internally after lead conversion
* Buyers, Sellers, Tenants, Landlords
* Managed by Admin / Agent (no direct login)

🛠️ Tech Stack
 Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

Frontend
* React.js
* Vite
* React Router DOM
* Axios
* CSS

Tools

* Postman (API testing)
* Git & GitHu


 Project Structure
RealEstate_Consultant_Management/
│
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── .gitignore
├── package.json
└── README.md

 Authentication & Authorization
* JWT token-based authentication
* Token stored in frontend (localStorage)
* Middleware protects private routes
* Role-based access for Admin and Agent
* Unauthorized users are redirected to login

 API Modules Implemented
 Authentication

* Login (Admin / Agent)
 Leads

* Create lead
* Assign lead to agent
* Update lead status
* Convert lead to customer
* Get all leads

 Customers

* Create customer
* View customer details
* Update customer

 Properties

* Add property
* Update property
* View properties
* Mark property as Sold / Rented

Rentals

* Create rental
* Add rent payment
* Track outstanding amount
* Move-out rental

Sales

* Create sale
* Validate token amount
* Track payments
* Close sale
* Prevent duplicate sales

 API Testing (Postman)

* All APIs tested using Postman
* Includes:

  * Auth APIs
  * Lead lifecycle APIs
  * Rental APIs
  * Sales APIs
* JWT token passed in headers:

Authorization: Bearer <token>
 Frontend Features
* Login page
* Sidebar navigation
* Dashboard layout
* Lead listing
* Buttons for actions (assign, convert, download, etc.)
* Clean CSS styling
* React Router protected routes


 How to Run the Project

 Backend Setup

cd Backend
npm install
npm start

Server runs on:
http://localhost:5000

 Frontend Setup


cd Frontend
npm install
npm run dev

Frontend runs on:
http://localhost:5173




Environment Variables

Create a `.env` file inside Backend:
PORT=5000
MONGO_URI=mongodb+srv://sejal:FBbMkSV6i7I8tMnN@cluster0.9ao1hia.mongodb.net/?appName=Cluster0
JWT_SECRET=e5f12ebb5384e8d654fa51b6fd1cb89601399990b02a2869d4cbf757bddd00e1


Key Features Implemented

✔ Role-based access control
✔ JWT authentication
✔ Lead to customer conversion
✔ Rental and sale workflows
✔ Secure REST APIs
✔ Modular backend structure
✔ Clean frontend integration

 Future Enhancements

* Better UI/UX design
* Admin analytics dashboard
* Customer login portal
* Notifications & reminders
* Deployment on cloud (AWS / Render)
