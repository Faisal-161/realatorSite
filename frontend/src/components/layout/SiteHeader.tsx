
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { Building } from "lucide-react";

export function SiteHeader() {
  const { user, logout, isAuthenticated, authLoading } = useAuth(); // Added isAuthenticated, authLoading
  const location = useLocation();
  
  // Don't show header on auth pages
  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Building className="h-6 w-6 text-estate-600" />
            <span className="text-xl font-bold text-estate-800">PropertyHub</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link 
            to="/" 
            className={`transition-colors hover:text-estate-600 ${
              location.pathname === '/' ? 'text-estate-600 font-medium' : 'text-foreground'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/properties" 
            className={`transition-colors hover:text-estate-600 ${
              location.pathname === '/properties' ? 'text-estate-600 font-medium' : 'text-foreground'
            }`}
          >
            Properties
          </Link>
          <Link 
            to="/services" 
            className={`transition-colors hover:text-estate-600 ${
              location.pathname === '/services' ? 'text-estate-600 font-medium' : 'text-foreground'
            }`}
          >
            Services
          </Link>
          <Link 
            to="/about" 
            className={`transition-colors hover:text-estate-600 ${
              location.pathname === '/about' ? 'text-estate-600 font-medium' : 'text-foreground'
            }`}
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {authLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-sm text-muted-foreground">
                Welcome, {user.username} {/* Changed user.name to user.username */}
              </div>
              <Link to={user.role === 'service_provider' ? '/partner' : `/${user.role}`}> {/* Map role to path */}
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm">Log in</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
