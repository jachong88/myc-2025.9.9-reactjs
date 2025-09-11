import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'antd/dist/reset.css'
import './index.css'
import App from './App.tsx'

// Initialize MSW for development if enabled
async function initializeApp() {
  // Start MSW if enabled in development
  if (import.meta.env.DEV) {
    const { startMSW } = await import('./mocks/browser');
    await startMSW();
  }

  // Render the app
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

// Start the application
initializeApp().catch((error) => {
  console.error('Failed to initialize application:', error);
});
