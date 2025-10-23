import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
  useLocation,
} from "@remix-run/react";
import { LinksFunction } from "@remix-run/node";
import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import ScreenshotTool from "./components/ScreenshotTool";
import { useEffect, useRef, useState } from "react";
import rootStyles from "./styles/root.css?url";

// ==================== SVG ICON COMPONENTS ====================
const AnalyticsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3v18h18"/>
    <path d="m19 9-5 5-4-4-3 3"/>
  </svg>
);

const ProductIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <path d="M3 9h18"/>
    <path d="M3 15h18"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const LogoIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
    </defs>
    
    <rect width="24" height="24" rx="6" fill="url(#bgGradient)"/>
    
    <rect x="5" y="14" width="1.3" height="4" fill="#22c55e" rx="0.3"/>
    <rect x="8.5" y="12" width="1.3" height="6" fill="#3b82f6" rx="0.3"/>
    <rect x="12" y="10" width="1.3" height="8" fill="#f59e0b" rx="0.3"/>
    <rect x="15.5" y="8" width="1.3" height="10" fill="#ef4444" rx="0.3"/>
    <rect x="19" y="3" width="1.3" height="15" fill="#8b5cf6" rx="0.3"/>
  </svg>
);

// ==================== LOADING COMPONENT ====================
function GlobalLoadingProgress() {
  const loadingSteps = [
    "Initializing dashboard...",
    "Loading store data...", 
    "Preparing analytics...",
    "Loading insights...",
    "Completing setup..."
  ];

  return (
    <div className="global-loading-progress">
      <div className="global-loading-header">
        <h2>Nexus Analytics</h2>
        <p>Preparing your business intelligence dashboard...</p>
      </div>
      
      <div className="global-progress-bar-container">
        <div className="global-progress-bar">
          <div className="global-progress-fill"></div>
        </div>
      </div>

      <div className="global-loading-steps">
        {loadingSteps.map((step, index) => (
          <div key={index} className="global-loading-step">
            <div className="global-step-indicator"></div>
            <div className="global-step-text">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== LINKS CONFIGURATION ====================
export const links: LinksFunction = () => [
  { 
    rel: "stylesheet", 
    href: polarisStyles 
  },
  { 
    rel: "stylesheet", 
    href: rootStyles 
  },
  {
    rel: "preconnect",
    href: "https://cdn.shopify.com/",
  },
  {
    rel: "stylesheet",
    href: "https://cdn.shopify.com/static/fonts/inter/v4/styles.css",
  },
];

// ==================== ROOT COMPONENT ====================
export default function App() {
  const navigation = useNavigation();
  const location = useLocation();
  const navMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuBtnRef = useRef<HTMLButtonElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navMenuRef.current && 
        mobileMenuBtnRef.current && 
        !navMenuRef.current.contains(event.target as Node) && 
        !mobileMenuBtnRef.current.contains(event.target as Node) &&
        isMobileMenuOpen
      ) {
        closeMobileMenu();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {navigation.state === 'loading' && <GlobalLoadingProgress />}
        
        {navigation.state !== 'loading' && (
          <AppProvider i18n={enTranslations}>
            <div className="app-container">
              <header className="root-header" id="rootHeader">
                <div className="header-content">
                  <NavLink to="/app" className="brand-link">
                    <div className="logo">
                      <LogoIcon />
                    </div>
                    <div className="brand-text">
                      <h1>Nexus Analytics</h1>
                      <p>Real-time Business Intelligence</p>
                    </div>
                  </NavLink>

                  <button 
                    className="mobile-menu-btn" 
                    id="mobileMenuBtn"
                    onClick={toggleMobileMenu}
                    ref={mobileMenuBtnRef}
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  >
                    {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                  </button>

                  <nav className="nav-menu desktop-nav">
                    <NavLink
                      to="/app"
                      end
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                      <AnalyticsIcon />
                      <span>Orders Dashboard</span>
                    </NavLink>
                  </nav>

                  <nav 
                    className={`nav-menu mobile-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`} 
                    id="navMenu" 
                    ref={navMenuRef}
                  >
                    <NavLink
                      to="/app"
                      end
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      <AnalyticsIcon />
                      <span>Orders Dashboard</span>
                    </NavLink>

                    <NavLink
                      to="/app/email-settings"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      <EmailIcon />
                      <span>Email Settings</span>
                    </NavLink>
                  </nav>
                </div>
              </header>

              <main className="main-content">
                <Outlet />
              </main>

              <div style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                zIndex: 9999
              }}>
                <ScreenshotTool />
              </div>
            </div>

            <ScrollRestoration />
            <Scripts />
          </AppProvider>
        )}
      </body>
    </html>
  );
}