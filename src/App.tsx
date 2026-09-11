import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AppLayout } from "@/components/layout/AppLayout";

// Páginas Públicas
import Login from "./pages/Login";

// Páginas Protegidas (Responsável & Admin)
import Dashboard from "./pages/Dashboard";
import Patrimonios from "./pages/Patrimonios";
import PatrimonioDetalhes from "./pages/PatrimonioDetalhes";
import Inventarios from "./pages/Inventarios";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";

// Páginas Admin
import Locais from "./pages/Locais";
import Categorias from "./pages/Categorias";
import Usuarios from "./pages/Usuarios";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth (public) */}
            <Route path="/login" element={<Login />} />

            {/* App (protected) */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Módulo de Patrimônio */}
              <Route path="/patrimonios" element={<Patrimonios />} />
              <Route path="/patrimonios/:id" element={<PatrimonioDetalhes />} />
              
              {/* Inventário e Relatórios */}
              <Route path="/inventarios" element={<Inventarios />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/configuracoes" element={<Configuracoes />} />

              {/* Módulos Administrativos (Somente Admin) */}
              <Route path="/locais" element={<AdminRoute><Locais /></AdminRoute>} />
              <Route path="/categorias" element={<AdminRoute><Categorias /></AdminRoute>} />
              <Route path="/usuarios" element={<AdminRoute><Usuarios /></AdminRoute>} />
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
