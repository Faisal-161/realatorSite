
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/AuthContext";

// Main Pages
import Home from "./pages/Home";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetail from "./pages/PropertyDetail";
import ServicesPage from "./pages/ServicesPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Buyer Pages
import BuyerDashboard from "./pages/buyer/BuyerDashboard";

// Seller Pages
import SellerDashboard from "./pages/seller/SellerDashboard";

// Partner Pages
import PartnerDashboard from "./pages/partner/PartnerDashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Buyer Routes */}
            <Route path="/buyer" element={<BuyerDashboard />} />
            <Route path="/buyer/properties" element={<BuyerDashboard />} />
            <Route path="/buyer/saved" element={<BuyerDashboard />} />
            <Route path="/buyer/requests" element={<BuyerDashboard />} />

            {/* Seller Routes */}
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/seller/properties" element={<SellerDashboard />} />
            <Route path="/seller/add-property" element={<SellerDashboard />} />
            <Route path="/seller/requests" element={<SellerDashboard />} />
            <Route path="/seller/marketing" element={<SellerDashboard />} />

            {/* Partner Routes */}
            <Route path="/partner" element={<PartnerDashboard />} />
            <Route path="/partner/services" element={<PartnerDashboard />} />
            <Route path="/partner/add-service" element={<PartnerDashboard />} />
            <Route path="/partner/properties" element={<PartnerDashboard />} />
            <Route path="/partner/chatbot" element={<PartnerDashboard />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminDashboard />} />
            <Route path="/admin/properties" element={<AdminDashboard />} />
            <Route path="/admin/services" element={<AdminDashboard />} />
            <Route path="/admin/ai-usage" element={<AdminDashboard />} />
            <Route path="/admin/billing" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<AdminDashboard />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
