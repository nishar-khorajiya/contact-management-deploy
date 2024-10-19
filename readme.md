# Contact Management System

This is a Contact Management System built using the MERN (MongoDB, Express, React, Node.js) stack. The application allows users to manage their contacts, including adding, editing, deleting, and grouping contacts. It also provides functionalities like importing/exporting contacts and merging duplicates.

## Features
- User authentication (Login/Register)
- Add, edit, and delete contacts
- Search and group contacts
- Import contacts from a VCF file
- Export contacts to a VCF file
- Merge duplicate contacts

## Prerequisites

Make sure you have the following installed on your machine:
- **Node.js** (v14.x or higher)
- **MongoDB** (Database service running locally or using MongoDB Atlas)
- **Git** 

## Setup Instructions

### 1. Clone the repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/nishar-khorajiya/contact-management-system.git
cd contact-management-system


cd backend
npm install

cd ../frontend
npm install

MONGO_URI=mongodb://localhost:27017/contact_management_db
JWT_SECRET=your_jwt_secret
PORT=5000


contact-management-system/
│
├── backend/              
│   ├── controllers/       
│   ├── models/            
│   ├── routes/           
│   └── server.js          
│
├── frontend/              
│   ├── src/               
│   └── public/            
│
└── README.md              
