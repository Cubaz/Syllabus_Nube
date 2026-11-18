import AppRoutes from "./routes/AppRoutes";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-panel">
        <Topbar />
        <main className="content-area">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}

export default App;
