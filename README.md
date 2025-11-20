Nganya Trip – Real-Time Ride Booking System

A real-time ride booking application with passenger, driver, and admin systems, built with Node.js, Express, MongoDB, Socket.IO, and Vanilla JS/HTML frontend. Passengers can request rides, see available drivers, and track trips in real-time. Drivers can accept bookings and go online/offline. Admin can approve driver applications and monitor the system.

Features

Passenger:

Register and login

Request rides (pickup → dropoff)

Receive real-time trip updates and driver notifications

Driver:

Register and login (after admin approval)

Go online/offline

Receive real-time ride requests

Accept or decline bookings

Admin:

Approve or reject driver applications

Monitor all drivers and passengers

Real-time notifications for new drivers

Real-Time Updates:

GPS updates from passengers to drivers

Booking status updates via Socket.IO

Project Structure
muhad/
muhad/
│
├─ nganya-trip-backend/     # Node.js backend
│  ├─ models/              # Mongoose schemas
│  │  ├─ Passenger.js
│  │  ├─ Driver.js
│  │  └─ Booking.js
│  ├─ socket.js            # Socket.IO setup
│  └─ server.js            # Main backend server
│
├─ Nganya-Style-/           # Frontend (HTML/JS/CSS)
│  ├─ client.html
│  ├─ driver.html
│  ├─ admin.html
│  └─ styles.css
│
└─ .gitignore

Requirements

Node.js v18+

MongoDB

Internet browser for frontend

npm packages:

npm install express mongoose cors dotenv socket.io

Getting Started

Clone the repo:

git clone https://github.com/sesco001/Nganya-project.git
cd muhad


Install backend dependencies:

cd nganya-trip-backend
npm install


Set up environment variables:
Create a .env file in nganya-trip-backend:

MONGO_URI=mongodb://localhost:27017/nganya
PORT=5000


Start backend server:

node server.js


Backend will run on http://localhost:5000
but the one on production is running on mongo db atlas  and render so the render link replacde with http://localhost:5000 incase you want to run on local host
Open frontend:

Open Nganya-Style-/client.html in a browser

Drivers: driver.html

Admin: admin.html

Real-time features:

Passengers and drivers communicate via Socket.IO

Notifications and online status updates are live

Usage

Register passengers and drivers

Drivers submit application → wait for admin approval

Passengers book rides → drivers see notifications and accept

Track ride status and GPS in real-time

Notes

Make sure MongoDB is running

Use latest browsers for proper Socket.IO support

Admin system must be accessed via admin.html

Only approved drivers can log in
