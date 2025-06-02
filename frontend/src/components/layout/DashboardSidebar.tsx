
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { 
  Building, 
  Home, 
  User, 
  Users, 
  Settings, 
  List, 
  Plus, 
  BarChart2, 
  MessageSquare,
  CreditCard 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon: Icon,
  children,
  className,
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:text-primary",
        isActive
          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
          : "hover:bg-secondary",
        className
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  );
};

export function DashboardSidebar() {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="h-screen w-64 border-r bg-sidebar shadow-sm">
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2">
          <Building className="h-6 w-6" />
          <span className="font-semibold">PropertyHub</span>
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 border-b p-4">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
          </div>
        </div>
        <div className="p-4">
          {user.role === 'buyer' && (
            <nav className="flex flex-col gap-1">
              <SidebarLink to="/buyer" icon={Home}>Dashboard</SidebarLink>
              <SidebarLink to="/buyer/properties" icon={Building}>Properties</SidebarLink>
              <SidebarLink to="/buyer/saved" icon={List}>Saved Listings</SidebarLink>
              <SidebarLink to="/buyer/requests" icon={MessageSquare}>Contact Requests</SidebarLink>
            </nav>
          )}
          
          {user.role === 'seller' && (
            <nav className="flex flex-col gap-1">
              <SidebarLink to="/seller" icon={Home}>Dashboard</SidebarLink>
              <SidebarLink to="/seller/properties" icon={Building}>My Properties</SidebarLink>
              <SidebarLink to="/seller/add-property" icon={Plus}>Add Property</SidebarLink>
              <SidebarLink to="/seller/requests" icon={MessageSquare}>Inquiries</SidebarLink>
              <SidebarLink to="/seller/marketing" icon={MessageSquare}>AI Marketing</SidebarLink>
            </nav>
          )}
          
          {user.role === 'partner' && (
            <nav className="flex flex-col gap-1">
              <SidebarLink to="/partner" icon={Home}>Dashboard</SidebarLink>
              <SidebarLink to="/partner/services" icon={List}>My Services</SidebarLink>
              <SidebarLink to="/partner/add-service" icon={Plus}>Add Service</SidebarLink>
              <SidebarLink to="/partner/properties" icon={Building}>Properties</SidebarLink>
              <SidebarLink to="/partner/chatbot" icon={MessageSquare}>Chatbot Script</SidebarLink>
            </nav>
          )}
          
          {user.role === 'admin' && (
            <nav className="flex flex-col gap-1">
              <SidebarLink to="/admin" icon={Home}>Dashboard</SidebarLink>
              <SidebarLink to="/admin/users" icon={Users}>Users</SidebarLink>
              <SidebarLink to="/admin/properties" icon={Building}>Properties</SidebarLink>
              <SidebarLink to="/admin/services" icon={List}>Services</SidebarLink>
              <SidebarLink to="/admin/ai-usage" icon={BarChart2}>AI Usage</SidebarLink>
              <SidebarLink to="/admin/billing" icon={CreditCard}>Billing</SidebarLink>
              <SidebarLink to="/admin/settings" icon={Settings}>Settings</SidebarLink>
            </nav>
          )}
        </div>
      </div>
      <div className="mt-auto p-4 border-t">
        <Button variant="outline" className="w-full" onClick={logout}>
          Log out
        </Button>
      </div>
    </div>
  );
}
