import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import ZonesPage from "./pages/ZonesPage";
import EntrancePage from "./pages/EntrancePage";
import ObjectsPage from "./pages/ObjectsPage";
import RemediesPage from "./pages/RemediesPage";
import ColorsPage from "./pages/ColorsPage";
import MetalsPage from "./pages/MetalsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/zones" element={<ZonesPage />} />
            <Route path="/entrances" element={<EntrancePage />} />
            <Route path="/objects" element={<ObjectsPage />} />
            <Route path="/remedies" element={<RemediesPage />} />
            <Route path="/colors" element={<ColorsPage />} />
            <Route path="/metals" element={<MetalsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
