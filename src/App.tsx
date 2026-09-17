import { AnimatePresence } from "motion/react";
import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { AboutPage } from "./pages/AboutPage";
import { CaseDetailPage } from "./pages/CaseDetailPage";
import { HomePage } from "./pages/HomePage";
import { IncidentsPage } from "./pages/IncidentsPage";
import { NetworkPage } from "./pages/NetworkPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PatternDetailPage } from "./pages/PatternDetailPage";
import { PatternsPage } from "./pages/PatternsPage";
import { SourcesPage } from "./pages/SourcesPage";
import { TechniqueDetailPage } from "./pages/TechniqueDetailPage";
import { TechniquesPage } from "./pages/TechniquesPage";

export function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="incidents" element={<IncidentsPage />} />
          <Route path="incidents/:id" element={<CaseDetailPage />} />
          <Route path="patterns" element={<PatternsPage />} />
          <Route path="patterns/:id" element={<PatternDetailPage />} />
          <Route path="techniques" element={<TechniquesPage />} />
          <Route path="techniques/:id" element={<TechniqueDetailPage />} />
          <Route path="sources" element={<SourcesPage />} />
          <Route path="network" element={<NetworkPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="not-found" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
