
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
import AddPropertyPage from "./pages/seller/AddPropertyPage"; // New import
import EditPropertyPage from "./pages/seller/EditPropertyPage"; // New import

// Partner Pages
import PartnerDashboard from "./pages/partner/PartnerDashboard";
import AddServicePage from "./pages/partner/AddServicePage"; // New import
import EditServicePage from "./pages/partner/EditServicePage"; // New import

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

// Protected Route Component
import ProtectedRoute from "./components/layout/ProtectedRoute"; // Import ProtectedRoute

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

            {/* Buyer Routes - Example: protect all /buyer/* routes */}
            <Route path="/buyer" element={<ProtectedRoute element={<BuyerDashboard />} allowedRoles={['buyer']} />} />
            <Route path="/buyer/properties" element={<ProtectedRoute element={<BuyerDashboard />} allowedRoles={['buyer']} />} /> 
            <Route path="/buyer/saved" element={<ProtectedRoute element={<BuyerDashboard />} allowedRoles={['buyer']} />} />
            <Route path="/buyer/requests" element={<ProtectedRoute element={<BuyerDashboard />} allowedRoles={['buyer']} />} />

            {/* Seller Routes - Example: protect all /seller/* routes */}
            <Route path="/seller" element={<ProtectedRoute element={<SellerDashboard />} allowedRoles={['seller']} />} />
            <Route path="/seller/properties" element={<ProtectedRoute element={<SellerDashboard />} allowedRoles={['seller']} />} /> {/* This might list properties */}
            <Route path="/seller/property/new" element={<ProtectedRoute element={<AddPropertyPage />} allowedRoles={['seller']} />} /> {/* New route */}
            <Route path="/seller/property/:id/edit" element={<ProtectedRoute element={<EditPropertyPage />} allowedRoles={['seller']} />} /> {/* New route */}
            {/* Old /seller/add-property probably should be removed or redirected if it pointed to SellerDashboard itself */}
            <Route path="/seller/requests" element={<ProtectedRoute element={<SellerDashboard />} allowedRoles={['seller']} />} />
            <Route path="/seller/marketing" element={<ProtectedRoute element={<SellerDashboard />} allowedRoles={['seller']} />} />

            {/* Partner Routes - Example: protect all /partner/* routes */}
            {/* Note: 'partner' in frontend UI, 'service_provider' in backend/types */}
            <Route path="/partner" element={<ProtectedRoute element={<PartnerDashboard />} allowedRoles={['service_provider']} />} />
            <Route path="/partner/services/new" element={<ProtectedRoute element={<AddServicePage />} allowedRoles={['service_provider']} />} /> {/* New Route */}
            <Route path="/partner/service/:id/edit" element={<ProtectedRoute element={<EditServicePage />} allowedRoles={['service_provider']} />} /> {/* New Route */}
            {/* Old /partner/services and /partner/add-service might need review if they pointed to the main dashboard */}
            <Route path="/partner/services" element={<ProtectedRoute element={<PartnerDashboard />} allowedRoles={['service_provider']} />} />
            <Route path="/partner/properties" element={<ProtectedRoute element={<PartnerDashboard />} allowedRoles={['service_provider']} />} />
            <Route path="/partner/chatbot" element={<ProtectedRoute element={<PartnerDashboard />} allowedRoles={['service_provider']} />} />

            {/* Admin Routes - Example: protect all /admin/* routes */}
            <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />} />
            <Route path="/admin/users" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />} />
            <Route path="/admin/properties" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />} />
            <Route path="/admin/services" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />} />
            <Route path="/admin/ai-usage" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />} />
            <Route path="/admin/billing" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />} />
            <Route path="/admin/settings" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />} />
            
            {/* Consider a dedicated Unauthorized page route here */}
            {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
