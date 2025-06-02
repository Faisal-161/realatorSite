
import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { getServices } from "@/api/services";
import type { ServiceOffer } from "@/lib/types";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

const ServicesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // const [categoryFilter, setCategoryFilter] = useState<string>("all"); // Category filter removed
  const [sortBy, setSortBy] = useState("latest"); // Default sort
  const [isMobile, setIsMobile] = useState(false);

  const { data: allServices, isLoading, isError, error } = useQuery<ServiceOffer[], Error>({
    queryKey: ['services'],
    queryFn: getServices,
  });

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Filter services based on search term
  const filteredServices = useMemo(() => {
    if (!allServices) return [];
    return allServices.filter((service) => {
      const matchesSearch =
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());
      // Category filter logic removed
      return matchesSearch;
    });
  }, [allServices, searchTerm]);

  // Sort services
  const sortedServices = useMemo(() => {
    return [...filteredServices].sort((a, b) => {
      // Price sort options removed as price is not in ServiceOffer model
      if (sortBy === "latest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      // Add other sorting relevant to ServiceOffer if needed, e.g., by title
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      if (sortBy === "title-desc") return b.title.localeCompare(a.title);
      return 0;
    });
  }, [filteredServices, sortBy]);

  // Categories array removed as category field is not available

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  // Filter controls for desktop
  const DesktopFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div>
        {/* Category Select Removed */}
      </div>

      <div>
        <Label htmlFor="sort-by" className="sr-only">Sort By</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger id="sort-by">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            {/* Price sort options removed */}
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  // Filter controls for mobile
  const MobileFilters = () => (
    <div className="flex justify-between items-center mb-6">
      <div className="relative flex-1 mr-2">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters & Sort</SheetTitle>
            <SheetDescription>
              Apply filters and sort services
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-6 py-6">
            {/* Mobile Category Filter Removed */}
            
            <div className="space-y-2">
              <Label htmlFor="mobile-sort">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="mobile-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  {/* Price sort options removed */}
                  <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <MainLayout>
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Partner Services</h1>

          {isMobile ? <MobileFilters /> : <DesktopFilters />}
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div key="loading" className="text-center p-8">
              <p>Loading services...</p> {/* Replace with spinner/skeleton */}
            </motion.div>
          )}
          {isError && (
            <motion.div key="error" className="text-center p-8 text-red-500">
              <p>Error fetching services: {error?.message}</p>
            </motion.div>
          )}
          {!isLoading && !isError && sortedServices.length > 0 && (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key="results"
            >
              {sortedServices.map((service) => (
                <motion.div key={service.id} variants={itemVariants}>
                  <ServiceCard service={service} />
                </motion.div>
              ))}
            </motion.div>
          )}
          {!isLoading && !isError && sortedServices.length === 0 && (
            <motion.div 
              className="p-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              key="no-results"
            >
              <h3 className="text-lg font-medium">No services found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or filter to find services.
              </p>
              <Button 
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  // setCategoryFilter("all"); // Category filter removed
                  setSortBy("latest");
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default ServicesPage;
