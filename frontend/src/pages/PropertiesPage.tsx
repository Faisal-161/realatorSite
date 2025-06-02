
import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { getListings } from "@/api/listings";
import type { PropertyListing } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/utils";
import { Search, Filter, Building, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const PropertiesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1500000]);
  const [bedrooms, setBedrooms] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("latest");
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };
    
    // Initial check
    checkScreenSize();
    
    // Listen for resize events
    window.addEventListener('resize', checkScreenSize);
    
    // Update active filters when filter values change
    updateActiveFilters();
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [priceRange, bedrooms]);

  // Update active filters list
  const updateActiveFilters = () => {
    const filters: string[] = [];
    
    if (priceRange[0] > 0 || priceRange[1] < 1500000) {
      filters.push(`Price: ${formatCurrency(priceRange[0])} - ${formatCurrency(priceRange[1])}`);
    }
    
    if (bedrooms) {
      filters.push(`${bedrooms} ${parseInt(bedrooms) === 1 ? 'Bedroom' : 'Bedrooms'}`);
    }
    
    setActiveFilters(filters);
  };

  // Clear all filters
  const clearFilters = () => {
    setPriceRange([0, 1500000]);
    setBedrooms(null);
    setSearchTerm("");
    setSortBy("latest");
    setActiveFilters([]);
  };

  const { data: allProperties, isLoading, isError, error } = useQuery<PropertyListing[], Error>({
    queryKey: ['listings'],
    queryFn: getListings,
  });

  // Filter properties based on search criteria
  const filteredProperties = useMemo(() => {
    if (!allProperties) return [];
    return allProperties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) || // Changed location to address
        property.description.toLowerCase().includes(searchTerm.toLowerCase());
        
      const propertyPrice = parseFloat(property.price); // Parse price string
      const matchesPrice = 
        propertyPrice >= priceRange[0] && propertyPrice <= priceRange[1];
        
      const matchesBedrooms = 
        !bedrooms || property.num_bedrooms === parseInt(bedrooms); // Changed bedrooms to num_bedrooms
        
      return matchesSearch && matchesPrice && matchesBedrooms;
    });
  }, [allProperties, searchTerm, priceRange, bedrooms]);

  // Sort properties
  const sortedProperties = useMemo(() => {
    return [...filteredProperties].sort((a, b) => {
      if (sortBy === "price-asc") return parseFloat(a.price) - parseFloat(b.price); // Parse price
      if (sortBy === "price-desc") return parseFloat(b.price) - parseFloat(a.price); // Parse price
      if (sortBy === "latest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // Changed createdAt
      return 0;
    });
  }, [filteredProperties, sortBy]);

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

  return (
    <MainLayout>
      <div className="container py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-muted-foreground mt-2">Find your dream property from our extensive listings</p>
        </motion.div>

        {/* Mobile Search and Filters */}
        {isMobile && (
          <div className="flex flex-col gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex justify-between">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Property Filters</SheetTitle>
                    <SheetDescription>
                      Refine your property search
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-6">
                    <div className="space-y-4">
                      <Label>Price Range</Label>
                      <Slider
                        defaultValue={[0, 1500000]}
                        max={1500000}
                        step={50000}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>{formatCurrency(priceRange[0])}</span>
                        <span>{formatCurrency(priceRange[1])}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile-bedrooms">Bedrooms</Label>
                      <Select
                        value={bedrooms || "any"}
                        onValueChange={(value) => setBedrooms(value === "any" ? null : value)}
                      >
                        <SelectTrigger id="mobile-bedrooms">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mobile-sort">Sort By</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger id="mobile-sort">
                          <SelectValue placeholder="Latest" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="latest">Latest</SelectItem>
                          <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                          <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={clearFilters}>
                        Clear All
                      </Button>
                      <SheetClose asChild>
                        <Button>Apply Filters</Button>
                      </SheetClose>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                  <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex flex-wrap gap-2 mt-2"
              >
                {activeFilters.map((filter, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {filter}
                  </Badge>
                ))}
                {activeFilters.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-xs h-6 px-2"
                  >
                    Clear All
                  </Button>
                )}
              </motion.div>
            )}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          {!isMobile && (
            <motion.aside 
              className={`md:w-64 shrink-0 transition-all duration-300 ease-in-out ${sidebarOpen ? 'block' : 'hidden md:block'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="sticky top-20 space-y-6 p-4 bg-white rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="search">Search</Label>
                    <div className="relative mt-1">
                      <Input
                        id="search"
                        placeholder="Search properties..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div>
                    <Label>Price Range</Label>
                    <div className="mt-1">
                      <Slider
                        defaultValue={[0, 1500000]}
                        max={1500000}
                        step={50000}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="mt-2"
                      />
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>{formatCurrency(priceRange[0])}</span>
                        <span>{formatCurrency(priceRange[1])}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select
                      value={bedrooms || "any"}
                      onValueChange={(value) => setBedrooms(value === "any" ? null : value)}
                    >
                      <SelectTrigger id="bedrooms">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {activeFilters.length > 0 && (
                    <div className="pt-2">
                      <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                        Clear All Filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.aside>
          )}

          {/* Properties List */}
          <div className="flex-1">
            {!isMobile && (
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  {!sidebarOpen && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSidebarOpen(true)}
                      className="mr-2"
                    >
                      <Filter className="h-4 w-4 mr-1" /> Filters
                    </Button>
                  )}
                  <p className="text-muted-foreground">
                    Showing <span className="font-medium">{sortedProperties.length}</span> properties
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="sort" className="text-sm whitespace-nowrap">Sort by:</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sort" className="w-[180px]">
                      <SelectValue placeholder="Latest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest</SelectItem>
                      <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                      <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {isLoading && (
                <motion.div key="loading" className="col-span-full text-center p-8">
                  <p>Loading properties...</p> {/* Replace with spinner/skeleton later */}
                </motion.div>
              )}
              {isError && (
                <motion.div key="error" className="col-span-full text-center p-8 text-red-500">
                  <p>Error fetching properties: {error?.message}</p>
                </motion.div>
              )}
              {!isLoading && !isError && sortedProperties.length > 0 && (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  key="results"
                >
                  {sortedProperties.map((property) => (
                    <motion.div key={property.id} variants={itemVariants}>
                      <PropertyCard property={property} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
              {!isLoading && !isError && sortedProperties.length === 0 && (
                <motion.div 
                  className="p-8 text-center border rounded-lg bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  key="no-results"
                >
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No properties found</h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    Try adjusting your search or filters to find properties.
                  </p>
                  <Button onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PropertiesPage;
