import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import App from './App';

// كتم أخطاء إضافات المتصفح الخارجية (Chrome Extensions) حتى يظل الـ Console نظيفاً 100%
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const msg = String(event?.reason?.message || event?.reason || '');
    if (
      msg.includes('Could not establish connection') ||
      msg.includes('Receiving end does not exist')
    ) {
      event.preventDefault();
    }
  });
}


// إجبار المتصفح على الابتداء من النقطة (0, 0) فوراً قبل تحميل الصفحة
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);