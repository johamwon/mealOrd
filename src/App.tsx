import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MealProvider } from "@/contexts/MealContext";

// Meal Pages
import TodayMeal from "@/pages/meal/TodayMeal";
import TomorrowMeal from "@/pages/meal/TomorrowMeal";
import AdminSummary from "@/pages/admin/AdminSummary";
import AdminExport from "@/pages/admin/AdminExport";
import AdminMealConfig from "@/pages/admin/AdminMealConfig";
import AdminUsers from "@/pages/admin/AdminUsers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MealProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Employee Routes */}
            <Route path="/" element={<TodayMeal />} />
            <Route path="/tomorrow" element={<TomorrowMeal />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminSummary />} />
            <Route path="/admin/export" element={<AdminExport />} />
            <Route path="/admin/meals" element={<AdminMealConfig />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MealProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
