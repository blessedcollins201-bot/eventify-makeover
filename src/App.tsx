import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import EventDetail from "./pages/EventDetail.tsx";
import InfoPage from "./pages/InfoPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/:section(discover|help|company|legal|fans)" element={<InfoPage />} />
          <Route path="/discover/:slug" element={<InfoPage />} />
          <Route path="/help/:slug" element={<InfoPage />} />
          <Route path="/company/:slug" element={<InfoPage />} />
          <Route path="/legal/:slug" element={<InfoPage />} />
          <Route path="/fans/:slug" element={<InfoPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
