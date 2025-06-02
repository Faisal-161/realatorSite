
import {
  ChevronDown,
  Menu,
  Plus,
  Settings,
  User,
  UserPlus,
  CreditCard,
  HelpCircle,
  LogOut,
  Building,
  Sparkles,
  Users,
  MessageSquare
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useRole } from "@/hooks/useRole";
import { ModeToggle } from "@/components/ui/mode-toggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "seller" | "partner" | "buyer";
}

export function DashboardLayout({
  children,
  requiredRole,
}: DashboardLayoutProps) {
  const { user, logout: signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const role = useRole();
  
  // Check if the user has the required role
  if (requiredRole && role !== requiredRole) {
    // Redirect to unauthorized page or home page
    navigate("/unauthorized", {
      replace: true,
      state: {
        from: location
      }
    });
    return null; // or return <UnauthorizedPage /> component
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // For the user dropdown, change how we access the image
  // Replace the avatar implementation with a properly typed version
  const userAvatar = user?.avatar || ""; // Fixed: Changed from avatarUrl to avatar
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="flex h-screen bg-gray-100 text-gray-700">
      {/* Mobile Menu */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="md:hidden absolute top-4 left-4 z-10"
            onClick={toggleMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>Dashboard Menu</SheetTitle>
            <SheetDescription>
              Navigate through your dashboard options.
            </SheetDescription>
          </SheetHeader>
          <Separator className="my-4" />
          <div className="flex flex-col space-y-2">
            {role === "admin" && (
              <>
                <Link to="/admin/dashboard" className="block px-4 py-2">
                  Dashboard
                </Link>
                <Link to="/admin/users" className="block px-4 py-2">
                  Users
                </Link>
                <Link to="/admin/properties" className="block px-4 py-2">
                  Properties
                </Link>
                <Link to="/admin/services" className="block px-4 py-2">
                  Services
                </Link>
                <Link to="/admin/requests" className="block px-4 py-2">
                  Requests
                </Link>
                <Link to="/admin/ai-usage" className="block px-4 py-2">
                  AI Usage
                </Link>
              </>
            )}
            {role === "seller" && (
              <>
                <Link to="/seller/dashboard" className="block px-4 py-2">
                  Dashboard
                </Link>
                <Link to="/seller/properties" className="block px-4 py-2">
                  Properties
                </Link>
                <Link to="/seller/add-property" className="block px-4 py-2">
                  Add Property
                </Link>
                <Link to="/seller/requests" className="block px-4 py-2">
                  Requests
                </Link>
                <Link to="/seller/marketing" className="block px-4 py-2">
                  Marketing
                </Link>
              </>
            )}
            {role === "partner" && (
              <>
                <Link to="/partner/dashboard" className="block px-4 py-2">
                  Dashboard
                </Link>
                <Link to="/partner/services" className="block px-4 py-2">
                  Services
                </Link>
                <Link to="/partner/add-service" className="block px-4 py-2">
                  Add Service
                </Link>
              </>
            )}
            {role === "buyer" && (
              <Link to="/buyer/dashboard" className="block px-4 py-2">
                Dashboard
              </Link>
            )}
          </div>
          <Separator className="my-4" />
          <Button variant="outline" className="w-full" onClick={() => signOut()}>
            Logout
          </Button>
        </SheetContent>
      </Sheet>

      {/* Sidebar (Hidden on small screens) */}
      <div className="hidden md:flex flex-col w-64 bg-gray-50 border-r">
        <div className="flex items-center justify-center h-16 border-b">
          <Link to="/" className="text-lg font-bold">
            Estate Platform
          </Link>
        </div>
        <div className="flex flex-col flex-grow p-4 space-y-2">
          {role === "admin" && (
            <>
              <Link
                to="/admin/dashboard"
                className={cn(
                  "block px-4 py-2 rounded-md hover:bg-gray-200",
                  location.pathname.startsWith("/admin/dashboard")
                    ? "bg-gray-200"
                    : ""
                )}
              >
                <Building className="h-4 w-4 mr-2 inline-block" />
                Dashboard
              </Link>
              <Link
                to="/admin/users"
                className={cn(
                  "block px-4 py-2 rounded-md hover:bg-gray-200",
                  location.pathname.startsWith("/admin/users")
                    ? "bg-gray-200"
                    : ""
                )}
              >
                <Users className="h-4 w-4 mr-2 inline-block" />
                Users
              </Link>
              <Link
                to="/admin/properties"
                className={cn(
                  "block px-4 py-2 rounded-md hover:bg-gray-200",
                  location.pathname.startsWith("/admin/properties")
                    ? "bg-gray-200"
                    : ""
                )}
              >
                <Building className="h-4 w-4 mr-2 inline-block" />
                Properties
              </Link>
              <Link
                to="/admin/services"
                className={cn(
                  "block px-4 py-2 rounded-md hover:bg-gray-200",
                  location.pathname.startsWith("/admin/services")
                    ? "bg-gray-200"
                    : ""
                )}
              >
                <CreditCard className="h-4 w-4 mr-2 inline-block" />
                Services
              </Link>
              <Link
                to="/admin/requests"
                className={cn(
                  "block px-4 py-2 rounded-md hover:bg-gray-200",
                  location.pathname.startsWith("/admin/requests")
                    ? "bg-gray-200"
                    : ""
                )}
              >
                <MessageSquare className="h-4 w-4 mr-2 inline-block" />
                Requests
              </Link>
              <Link
                to="/admin/ai-usage"
                className={cn(
                  "block px-4 py-2 rounded-md hover:bg-gray-200",
                  location.pathname.startsWith("/admin/ai-usage")
                    ? "bg-gray-200"
                    : ""
                )}
              >
                <Sparkles className="h-4 w-4 mr-2 inline-block" />
                AI Usage
              </Link>
            </>
          )}
          {role === "seller" && (
            <>
              <Link
                to="/seller/dashboard"
                className={cn(
                  "block px-4 py-2 rounded-md hover:bg-gray-200",
                  location.pathname.startsWith("/seller/dashboard")
                    ? "bg-gray-200"
                    : ""
                )}
              >
                <Building className="h-4 w-4 mr-2 inline-block" />
                Dashboard
              </Link>
              <Link
                to="/seller/properties"
                className={cn(
                  "block px-4 py-2 rounded-md hover:bg-gray-200",
                  location.pathname.startsWith("/seller/properties")
                    ? "bg-gray-200"
                    : ""
                )}
              >
                <Building className="h-4 w-4 mr-2 inline-block" />
                Properties
              </Link>
              <Link
                to="/seller/add-property"
                className={cn(
                  "block px-4 py-2 rounded-md hover:bg-gray-200",
                  location.pathname.startsWith("/seller/add-property")
                    ? "bg-gray-200"
                    : ""
                )}
              >
                <Plus className="h-4 w-4 mr-2 inline-block" />
                Add Property
              </Link>
              <Link
                to="/seller/requests"
                className={cn(
                  "block px-4 py-2 rounded-md hover:bg-gray-200",
                  location.pathname.startsWith("/seller/requests")
                    ? "bg-gray-200"
                    : ""
                )}
              >
                <MessageSquare className="h-4 w-4 mr-2 inline-block" />
                Requests
              </Link>
              <Link
                to="/seller/marketing"
                className={cn(
                  "block px-4 py-2 rounded-md hover:bg-gray-200",
                  location.pathname.startsWith("/seller/marketing")
                    ? "bg-gray-200"
                    : ""
                )}
              >
                <Sparkles className="h-4 w-4 mr-2 inline-block" />
                Marketing
              </Link>
            </>
          )}
          {role === "partner" && (
            <>
              <Link
                to="/partner/dashboard"
                className={cn(
                  "block px-4 py-2 rounded-md hover:bg-gray-200",
                  location.pathname.startsWith("/partner/dashboard")
                    ? "bg-gray-200"
                    : ""
                )}
              >
                <Building className="h-4 w-4 mr-2 inline-block" />
                Dashboard
              </Link>
              <Link
                to="/partner/services"
                className={cn(
                  "block px-4 py-2 rounded-md hover:bg-gray-200",
                  location.pathname.startsWith("/partner/services")
                    ? "bg-gray-200"
                    : ""
                )}
              >
                <CreditCard className="h-4 w-4 mr-2 inline-block" />
                Services
              </Link>
              <Link
                to="/partner/add-service"
                className={cn(
                  "block px-4 py-2 rounded-md hover:bg-gray-200",
                  location.pathname.startsWith("/partner/add-service")
                    ? "bg-gray-200"
                    : ""
                )}
              >
                <Plus className="h-4 w-4 mr-2 inline-block" />
                Add Service
              </Link>
            </>
          )}
          {role === "buyer" && (
            <Link
              to="/buyer/dashboard"
              className={cn(
                "block px-4 py-2 rounded-md hover:bg-gray-200",
                location.pathname.startsWith("/buyer/dashboard")
                  ? "bg-gray-200"
                  : ""
              )}
            >
              <Building className="h-4 w-4 mr-2 inline-block" />
              Dashboard
            </Link>
          )}
          <div className="mt-auto">
            <Separator />
            <ModeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-grow overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="font-bold text-lg">
            {role ? `${role.toUpperCase()} Dashboard` : "Dashboard"}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userAvatar} alt={user.name || "Avatar"} />
                  <AvatarFallback>
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" forceMount>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                {role === "admin" && (
                  <DropdownMenuItem>
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Invite User</span>
                    <DropdownMenuShortcut>⌘I</DropdownMenuShortcut>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <main className="flex-grow p-4">{children}</main>
      </div>
    </div>
  );
}
