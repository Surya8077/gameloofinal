# Gaming Website

A modern gaming website built with React, TypeScript, and Node.js.

## Features

- Modern, responsive design
- User authentication
- Game browsing and purchasing
- User profiles
- Support system
- Secure payment processing

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- SASS
- React Router

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- RESTful API

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- MongoDB

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gaming-website
   ```

2. Install frontend dependencies:
   ```bash
   cd Frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd ../Backend
   npm install
   ```

4. Create environment files:
   - Create `.env` in the Backend directory with the following variables:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     ```

5. Start the development servers:

   Frontend:
   ```bash
   cd Frontend
   npm run dev
   ```

   Backend:
   ```bash
   cd Backend
   npm run dev
   ```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

## Building for Production

1. Build the frontend:
   ```bash
   cd Frontend
   npm run build
   ```

2. Start the production server:
   ```bash
   cd Backend
   npm start
   ```

## Project Structure

```
gaming-website/
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── assets/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   └── package.json
├── Backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── config/
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 