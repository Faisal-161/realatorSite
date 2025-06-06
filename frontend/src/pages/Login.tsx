
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate might be used if login itself doesn't redirect
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // For loading spinner
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

const Login = () => {
  const { login, authLoading } = useAuth(); // authLoading from context might be useful for initial page load state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const navigate = useNavigate(); // If navigation needs to be handled here

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      // Navigation is handled by AuthContext's login method on success
    } catch (error) {
      // Error toast is handled by AuthContext's login method
      // If specific form error display is needed, handle it here
      console.error("Login page caught error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo account information
  const demoAccounts = [
    { email: "john@example.com", role: "Buyer" },
    { email: "robert@example.com", role: "Seller" },
    { email: "michael@example.com", role: "Partner" },
    { email: "admin@example.com", role: "Admin" },
  ];

  const setDemoAccount = (email: string) => {
    setEmail(email);
    setPassword("password"); // In a real app, you would never do this
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Building className="h-12 w-12 text-estate-600" />
          <h1 className="text-3xl font-bold">PropertyHub</h1>
          <p className="text-muted-foreground">Real Estate Collaboration System</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Log in to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="text-sm">
                <p className="font-medium mb-2">Demo accounts:</p>
                <div className="grid grid-cols-2 gap-2">
                  {demoAccounts.map((account) => (
                    <Button
                      key={account.email}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs justify-start"
                      onClick={() => setDemoAccount(account.email)}
                    >
                      {account.role}
                    </Button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  For demo purposes, use any password.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isSubmitting || authLoading}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Log in
              </Button>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="text-estate-600 hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
