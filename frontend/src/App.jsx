import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import useMediaQuery from "./hooks/useMediaQuery";
import { getSectionLabel } from "./routes/navigation";

const DESKTOP_QUERY = "(min-width: 1024px)";
const COLLAPSED_STORAGE_KEY = "sidebar-collapsed";

const readCollapsedPreference = () => {
  try {
    return window.localStorage.getItem(COLLAPSED_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

function App() {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(readCollapsedPreference);
  const { pathname } = useLocation();

  const sidebarVisible = isDesktop ? !collapsed : menuOpen;

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
    document.title = `${getSectionLabel(pathname)} · Gestión Académica ICBI-UAEH`;
  }, [pathname]);

  useEffect(() => {
    try {
      window.localStorage.setItem(COLLAPSED_STORAGE_KEY, String(collapsed));
    } catch {
      // Sin almacenamiento disponible la preferencia solo dura la sesión.
    }
  }, [collapsed]);

  useEffect(() => {
    if (isDesktop) setMenuOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.body.classList.add("no-scroll");
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("no-scroll");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const toggleSidebar = () => {
    if (isDesktop) {
      setCollapsed((current) => !current);
    } else {
      setMenuOpen((current) => !current);
    }
  };

  const hideSidebar = () => {
    if (isDesktop) {
      setCollapsed(true);
    } else {
      setMenuOpen(false);
    }
  };

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar open={menuOpen} visible={sidebarVisible} isDesktop={isDesktop} onHide={hideSidebar} />
      <div
        className={`sidebar-backdrop ${menuOpen ? "visible" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <div className="main-panel">
        <Topbar sidebarVisible={sidebarVisible} onMenuClick={toggleSidebar} />
        <main className="content-area">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}

export default App;
