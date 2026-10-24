import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker with auto-refresh on updates
registerSW({
  immediate: true,
  onOfflineReady() {
    console.log('AMD Furniture UK is installed and ready for offline use!');
  }
});

createRoot(document.getElementById('root')!).render(<App />);
