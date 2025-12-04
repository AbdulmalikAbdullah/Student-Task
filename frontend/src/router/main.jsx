import { StrictMode, useContext } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider, AuthContext } from "../context/AuthContext.jsx";
import { NotificationProvider } from "../context/NotificationContext.jsx";

function AppWithNotifications() {
  const { user } = useContext(AuthContext);
  return (
    <NotificationProvider user={user}>
      <App />
    </NotificationProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppWithNotifications />
    </AuthProvider>
  </StrictMode>
)
