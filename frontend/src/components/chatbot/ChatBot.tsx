import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, ArrowRight, X, ThumbsUp, ThumbsDown, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  type?: "text" | "suggestion" | "property" | "service";
  propertyData?: any;
  serviceData?: any;
  actions?: {
    text: string;
    action: string;
  }[];
}

interface ChatBotProps {
  onClose: () => void;
}

export function ChatBot({ onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      text: "Hi there! I'm PropertyBot. How can I help you find your dream property today?",
      isBot: true,
      timestamp: new Date(),
      type: "text",
      actions: [
        { text: "Show me featured properties", action: "featured" },
        { text: "Find properties by location", action: "location" },
        { text: "What services do you offer?", action: "services" }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text = inputValue) => {
    if (text.trim() === "") return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text,
      isBot: false,
      timestamp: new Date(),
      type: "text"
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot thinking/typing
    setTimeout(() => {
      let botResponse: ChatMessage;
      
      // Basic intent matching
      const lowercaseText = text.toLowerCase();
      
      if (lowercaseText.includes("featured") || lowercaseText.includes("show") || lowercaseText === "featured") {
        botResponse = {
          id: Date.now().toString(),
          text: "Here are some of our featured properties that might interest you:",
          isBot: true,
          timestamp: new Date(),
          type: "property",
          propertyData: [
            {
              id: "prop1",
              title: "Luxury Waterfront Villa",
              price: "$1,250,000",
              location: "Miami, FL",
              image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&w=300&h=200&fit=crop"
            },
            {
              id: "prop2",
              title: "Modern Downtown Apartment",
              price: "$450,000",
              location: "San Francisco, CA",
              image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&w=300&h=200&fit=crop"
            },
            {
              id: "prop3",
              title: "Suburban Family Home",
              price: "$780,000",
              location: "Austin, TX",
              image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&w=300&h=200&fit=crop"
            }
          ],
          actions: [
            { text: "View all properties", action: "view-all" },
            { text: "Filter by price", action: "filter-price" }
          ]
        };
      } else if (lowercaseText.includes("location") || lowercaseText.includes("where") || lowercaseText.includes("area")) {
        botResponse = {
          id: Date.now().toString(),
          text: "I can help you find properties in specific locations. Which city are you interested in?",
          isBot: true,
          timestamp: new Date(),
          type: "suggestion",
          actions: [
            { text: "New York", action: "location-newyork" },
            { text: "Los Angeles", action: "location-la" },
            { text: "Chicago", action: "location-chicago" },
            { text: "Miami", action: "location-miami" },
            { text: "Other location", action: "location-other" }
          ]
        };
      } else if (lowercaseText.includes("service") || lowercaseText.includes("offer")) {
        botResponse = {
          id: Date.now().toString(),
          text: "We offer various services to help with your property journey:",
          isBot: true,
          timestamp: new Date(),
          type: "service",
          serviceData: [
            {
              id: "serv1",
              title: "Home Inspection",
              provider: "InspectPro",
              price: "$350"
            },
            {
              id: "serv2",
              title: "Moving Service",
              provider: "EasyMove",
              price: "$1,200"
            },
            {
              id: "serv3",
              title: "Interior Design",
              provider: "DesignPlus",
              price: "$80/hr"
            }
          ]
        };
      } else if (lowercaseText.includes("price") || lowercaseText.includes("cost") || lowercaseText.includes("budget")) {
        botResponse = {
          id: Date.now().toString(),
          text: "I can help you find properties within your budget. What price range are you looking for?",
          isBot: true,
          timestamp: new Date(),
          type: "suggestion",
          actions: [
            { text: "Under $300,000", action: "price-low" },
            { text: "$300,000 - $600,000", action: "price-medium" },
            { text: "$600,000 - $1,000,000", action: "price-high" },
            { text: "Over $1,000,000", action: "price-luxury" }
          ]
        };
      } else {
        // Default responses
        const botResponses = [
          "I can help you find properties that match your criteria. Would you like to see some featured listings?",
          "That's a great area to look in! We have several properties available there.",
          "The average price in that neighborhood is around $450,000. Would you like me to show you some options?",
          "I recommend booking a viewing for that property. Would you like me to help schedule one?",
          "You might be interested in our newest listings. They match what you're looking for."
        ];

        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

        botResponse = {
          id: Date.now().toString(),
          text: randomResponse,
          isBot: true,
          timestamp: new Date(),
          type: "text"
        };
      }

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleQuickAction = (action: string) => {
    let userText = "";
    
    switch (action) {
      case "featured":
        userText = "Show me featured properties";
        break;
      case "location":
        userText = "I want to find properties by location";
        break;
      case "services":
        userText = "What services do you offer?";
        break;
      case "location-newyork":
        userText = "Show me properties in New York";
        break;
      case "location-la":
        userText = "Show me properties in Los Angeles";
        break;
      case "location-chicago":
        userText = "Show me properties in Chicago";
        break;
      case "location-miami":
        userText = "Show me properties in Miami";
        break;
      case "price-low":
        userText = "I'm looking for properties under $300,000";
        break;
      case "price-medium":
        userText = "I'm looking for properties between $300,000 and $600,000";
        break;
      case "price-high":
        userText = "I'm looking for properties between $600,000 and $1,000,000";
        break;
      case "price-luxury":
        userText = "I'm looking for luxury properties over $1,000,000";
        break;
      default:
        userText = action;
    }
    
    handleSendMessage(userText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleFeedback = (isPositive: boolean) => {
    // In a real app, you would send this feedback to your backend
    alert(`Thank you for your ${isPositive ? "positive" : "negative"} feedback!`);
  };

  return (
    <div className="flex flex-col h-[500px] max-h-[70vh] w-full">
      <div className="bg-estate-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <h3 className="font-medium">PropertyBot</h3>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="h-8">
            <TabsTrigger value="chat" className="text-xs px-2 py-1 h-7">Chat</TabsTrigger>
            <TabsTrigger value="help" className="text-xs px-2 py-1 h-7">Help</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-estate-700">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activeTab} className="flex-1 flex flex-col">
        <TabsContent value="chat" className="flex-1 overflow-y-auto p-4 bg-slate-50 m-0">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`mb-4 flex ${msg.isBot ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-[85%] ${
                    msg.isBot
                      ? "bg-white text-gray-800 shadow-sm"
                      : "bg-estate-600 text-white"
                  }`}
                >
                  {msg.isBot && msg.type !== "text" && (
                    <div className="flex items-center gap-1 mb-1">
                      <Bot className="h-3 w-3" />
                      <span className="text-xs font-medium">PropertyBot</span>
                    </div>
                  )}
                  
                  <p className="text-sm">{msg.text}</p>
                  
                  {msg.type === "property" && msg.propertyData && (
                    <div className="mt-2 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                        {msg.propertyData.map((property: any) => (
                          <Card key={property.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                            <div className="h-24 overflow-hidden">
                              <img 
                                src={property.image} 
                                alt={property.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-2">
                              <p className="font-medium text-xs truncate">{property.title}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-estate-600 font-medium">{property.price}</span>
                                <span className="text-xs text-muted-foreground">{property.location}</span>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {msg.type === "service" && msg.serviceData && (
                    <div className="mt-3 space-y-2">
                      {msg.serviceData.map((service: any) => (
                        <div key={service.id} className="bg-muted/50 p-2 rounded-md">
                          <div className="flex justify-between">
                            <span className="font-medium text-xs">{service.title}</span>
                            <span className="text-estate-600 text-xs">{service.price}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">By {service.provider}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {msg.actions && msg.actions.length > 0 && (
                    <div className={`flex flex-wrap gap-2 mt-2 ${msg.actions.length > 3 ? "justify-start" : "justify-center"}`}>
                      {msg.actions.map((action, index) => (
                        <Button 
                          key={index} 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-7 bg-white hover:bg-slate-50"
                          onClick={() => handleQuickAction(action.action)}
                        >
                          {action.text}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs mt-1 opacity-70 text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  
                  {msg.isBot && (
                    <div className="flex justify-end gap-1 mt-2">
                      <button 
                        onClick={() => handleFeedback(true)} 
                        className="text-muted-foreground hover:text-green-600 transition-colors"
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={() => handleFeedback(false)} 
                        className="text-muted-foreground hover:text-red-600 transition-colors"
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start mb-4"
              >
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "400ms" }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </TabsContent>
        
        <TabsContent value="help" className="flex-1 overflow-y-auto p-4 bg-slate-50 m-0">
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <h4 className="font-medium flex items-center gap-1 mb-1 text-sm">
                <Info className="h-4 w-4 text-estate-600" />
                How to use PropertyBot
              </h4>
              <p className="text-sm text-muted-foreground">
                I can help you find properties, answer questions about listings, and connect you with our services.
              </p>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <h4 className="font-medium mb-2 text-sm">Example questions:</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start h-auto py-1 text-left"
                    onClick={() => {
                      setActiveTab("chat");
                      setTimeout(() => handleQuickAction("featured"), 100);
                    }}
                  >
                    "Show me featured properties"
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start h-auto py-1 text-left"
                    onClick={() => {
                      setActiveTab("chat");
                      setTimeout(() => handleQuickAction("location"), 100);
                    }}
                  >
                    "Find properties in Miami"
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start h-auto py-1 text-left"
                    onClick={() => {
                      setActiveTab("chat");
                      setTimeout(() => handleQuickAction("price-medium"), 100);
                    }}
                  >
                    "Properties under $500,000"
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start h-auto py-1 text-left"
                    onClick={() => {
                      setActiveTab("chat");
                      setTimeout(() => handleQuickAction("services"), 100);
                    }}
                  >
                    "What services do you offer?"
                  </Button>
                </li>
              </ul>
            </div>
            
            <div className="text-center">
              <Button 
                variant="outline"
                className="text-sm"
                onClick={() => setActiveTab("chat")}
              >
                Back to Chat
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="border-t p-3 bg-white">
        <div className="flex">
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon"
            onClick={() => handleSendMessage()}
            disabled={inputValue.trim() === "" || isTyping}
            className="ml-2"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
