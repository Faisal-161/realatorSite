
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { properties } from "@/lib/data";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Building, Users, List, MessageSquare, X, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChatBot } from "@/components/chatbot/ChatBot";
import { Badge } from "@/components/ui/badge";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax effect
  const backgroundY = useTransform(scrollY, [0, 500], ['0%', '20%']);
  const opacityHero = useTransform(scrollY, [0, 300, 500], [1, 0.5, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.1]);
  
  // Featured properties - just get the first 6
  const featuredProperties = properties.slice(0, 6);
  const [displayProperties, setDisplayProperties] = useState(featuredProperties.slice(0, 3));
  
  // Stats data
  const stats = [
    { value: "5,000+", label: "Properties Listed" },
    { value: "15,000+", label: "Happy Clients" },
    { value: "500+", label: "Service Partners" },
    { value: "99%", label: "Satisfaction Rate" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };
  
  // Show more properties
  const handleShowMore = () => {
    setDisplayProperties(featuredProperties);
  };

  // Control chat visibility based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        // Auto-hide chatbot after scrolling past hero section
        if (showChatbot) setShowChatbot(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showChatbot]);

  return (
    <MainLayout>
      {/* Hero Section with Parallax */}
      <section className="relative h-[calc(100vh-64px)] min-h-[600px] flex items-center justify-center overflow-hidden bg-estate-900 text-white">
        <motion.div 
          className="absolute inset-0 bg-black/50 z-10"
          style={{ opacity: opacityHero }}
        />
        <motion.div 
          className="absolute inset-0 w-full h-full bg-cover bg-center z-0" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=1800&h=800&fit=crop')",
            y: backgroundY,
            scale
          }}
        />
        
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-estate-900 to-transparent z-10" />
        
        <div className="container relative z-20 mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Find Your Dream <span className="text-estate-400">Property</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Connect with sellers, service providers, and make your real estate journey seamless
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="max-w-lg mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search properties by location..." 
                className="w-full h-14 pl-12 pr-4 rounded-full bg-white/90 text-black text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-4 h-6 w-6 text-muted-foreground" />
              <Button 
                size="lg" 
                className="absolute right-2 top-1.5 rounded-full"
              >
                Search
              </Button>
            </div>
            <motion.div 
              className="mt-6 flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Badge variant="outline" className="bg-white/10 text-white backdrop-blur hover:bg-white/20 cursor-pointer">
                Apartments
              </Badge>
              <Badge variant="outline" className="bg-white/10 text-white backdrop-blur hover:bg-white/20 cursor-pointer">
                Houses
              </Badge>
              <Badge variant="outline" className="bg-white/10 text-white backdrop-blur hover:bg-white/20 cursor-pointer">
                Commercial
              </Badge>
              <Badge variant="outline" className="bg-white/10 text-white backdrop-blur hover:bg-white/20 cursor-pointer">
                Land
              </Badge>
              <Badge variant="outline" className="bg-white/10 text-white backdrop-blur hover:bg-white/20 cursor-pointer">
                Luxury
              </Badge>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <a 
              href="#features" 
              className="inline-flex flex-col items-center text-white/70 hover:text-white transition-colors"
            >
              <span className="text-sm mb-1">Discover More</span>
              <ChevronDown className="h-5 w-5 animate-bounce" />
            </a>
          </motion.div>
        </div>

        {/* Chatbot Button */}
        <motion.div 
          className="fixed bottom-6 right-6 z-30"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
        >
          <Button 
            size="lg" 
            className="rounded-full h-14 w-14 p-0 bg-estate-600 hover:bg-estate-700 transition-colors shadow-lg"
            onClick={() => setShowChatbot(!showChatbot)}
          >
            {showChatbot ? <X size={24} /> : <MessageSquare size={24} />}
          </Button>
        </motion.div>
        
        {/* Chatbot Dialog */}
        {showChatbot && (
          <motion.div 
            className="fixed bottom-24 right-6 z-30 w-80 md:w-96 bg-white shadow-xl rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <ChatBot onClose={() => setShowChatbot(false)} />
          </motion.div>
        )}
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-3xl md:text-4xl font-bold text-estate-600 mb-2">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white scroll-mt-16">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It <span className="text-estate-600">Works</span>
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="flex flex-col items-center text-center p-6 hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-slate-100"
              variants={itemVariants}
            >
              <motion.div 
                className="bg-estate-100 p-5 rounded-full mb-5 transform transition-transform hover:scale-110 duration-300"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              >
                <Building className="h-10 w-10 text-estate-600" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-3">Find Properties</h3>
              <p className="text-muted-foreground">
                Browse through our extensive listings of properties from verified sellers.
                Filter by location, price, features, and more to find your dream property.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center p-6 hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-slate-100"
              variants={itemVariants}
            >
              <motion.div 
                className="bg-estate-100 p-5 rounded-full mb-5 transform transition-transform hover:scale-110 duration-300"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              >
                <Users className="h-10 w-10 text-estate-600" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-3">Connect with Partners</h3>
              <p className="text-muted-foreground">
                Find essential services for your new home from our trusted service partners.
                From moving services to interior design, we've got you covered.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center p-6 hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-slate-100"
              variants={itemVariants}
            >
              <motion.div 
                className="bg-estate-100 p-5 rounded-full mb-5 transform transition-transform hover:scale-110 duration-300"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              >
                <List className="h-10 w-10 text-estate-600" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-3">Bundle Services</h3>
              <p className="text-muted-foreground">
                Get special deals on bundled services with your property purchase.
                Save money and time with our exclusive package deals tailored for new homeowners.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold">Featured <span className="text-estate-600">Properties</span></h2>
            <Link to="/properties">
              <Button variant="outline" className="hover:bg-estate-100 transition-colors">View All</Button>
            </Link>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {displayProperties.map((property, index) => (
              <motion.div 
                key={property.id} 
                variants={itemVariants} 
                custom={index}
                whileHover={{ y: -5 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
          
          {displayProperties.length < featuredProperties.length && (
            <div className="text-center mt-8">
              <Button onClick={handleShowMore} variant="outline" size="lg">
                Show More Properties
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-estate-50 border-y">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-2"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            What Our Clients Say
          </motion.h2>
          <motion.p 
            className="text-center text-muted-foreground mb-12 max-w-xl mx-auto"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Read testimonials from our satisfied clients who found their dream properties through our platform
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="text-5xl text-estate-200 absolute top-4 right-6">"</div>
              <p className="text-muted-foreground mb-6 relative z-10">
                The platform made finding my dream home incredibly easy. The property listings were detailed, and the ability to connect with service providers saved me so much time!
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src="https://i.pravatar.cc/100?img=33" alt="Sarah J." className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Home Buyer</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="text-5xl text-estate-200 absolute top-4 right-6">"</div>
              <p className="text-muted-foreground mb-6 relative z-10">
                As a seller, I was able to list my property with detailed information and connect with serious buyers quickly. The analytics dashboard gave me valuable insights!
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src="https://i.pravatar.cc/100?img=52" alt="Michael P." className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium">Michael Peterson</p>
                  <p className="text-sm text-muted-foreground">Property Seller</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="text-5xl text-estate-200 absolute top-4 right-6">"</div>
              <p className="text-muted-foreground mb-6 relative z-10">
                Being a service provider on this platform has been great for business. The integrated system allows me to showcase my services to potential clients effectively.
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src="https://i.pravatar.cc/100?img=2" alt="Emily R." className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium">Emily Rodriguez</p>
                  <p className="text-sm text-muted-foreground">Interior Designer</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-estate-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Property?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join our platform today and start your journey to finding your dream home.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto hover:scale-105 transition-transform"
                >
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto hover:bg-white/10 transition-colors"
                >
                  Log In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
