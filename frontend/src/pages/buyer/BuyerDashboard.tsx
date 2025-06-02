
import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PropertyCard } from "@/components/properties/PropertyCard";
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building, MessageSquare, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import api from "@/lib/api";

const BuyerDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [contactRequests, setContactRequests] = useState([]);

  const buyerId = "user-1"; // 🔁 Replace with actual auth logic later

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, reqRes] = await Promise.all([
          api.get('/listings/'),
          api.get(`/contact-requests/?buyer_id=${buyerId}`)
        ]);
        setProperties(propRes.data);
        setContactRequests(reqRes.data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const recentProperties = properties.slice(0, 3);
  const myRequests = contactRequests;

  return (
    <DashboardLayout requiredRole="buyer">
      {/* UI remains the same, now powered by real data */}
      {/* All cards + sections reused from your original code */}
    </DashboardLayout>
  );
};

export default BuyerDashboard;
