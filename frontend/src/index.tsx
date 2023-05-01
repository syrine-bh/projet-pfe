import ReactDOM from 'react-dom/client';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from "react-router-dom";
import { Suspense } from 'react';
import { AuthProvider } from 'react-auth-kit';
import SuspenceScreen from './components/suspence-screen';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);




root.render(
  <Suspense fallback={<SuspenceScreen />}>
    <AuthProvider authType={'cookie'} authName={'_wevioo_auth'} cookieDomain={window.location.hostname} cookieSecure={window.location.protocol === 'https:'}>
      <HashRouter>
        <App />
      </HashRouter>
    </AuthProvider>

  </Suspense>
);


reportWebVitals();
