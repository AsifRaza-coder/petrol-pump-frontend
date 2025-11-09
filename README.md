# Petrol Pump Frontend

Frontend application for Petrol Pump Management System built with React.js and Material-UI.

## Features

- Modern UI with Material-UI components
- Customer Management
- Employee Management
- Product & Price Management
- Purchase & Stock Management
- Sales & Readings Management
- Reports & Analytics
- Responsive Design

## Tech Stack

- **Framework:** React.js
- **UI Library:** Material-UI (MUI)
- **State Management:** Redux Toolkit
- **Routing:** React Router
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
REACT_APP_API_URL=https://your-backend-api-url.com
```

3. Start development server:
```bash
npm start
```

4. Build for production:
```bash
npm run build
```

## Environment Variables

- `REACT_APP_API_URL` - Backend API URL

## Deployment on Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `REACT_APP_API_URL` - Your backend API URL
3. Vercel will automatically detect React and deploy
4. Build command: `npm run build`
5. Output directory: `build`

## Project Structure

```
src/
├── Components/     # Reusable components
├── Pages/          # Page components
├── redux/          # Redux store and slices
├── backend/       # API configuration
└── routes/         # Route definitions
```

## License

ISC
# petrol_pump
# petrol_pump
