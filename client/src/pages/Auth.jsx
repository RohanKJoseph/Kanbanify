import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/auth/Login";
import SignUp from "@/components/auth/SignUp";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/assets/logo_with_text.svg";

const Auth = () => {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col gap-[10vh] justify-start items-center pt-[10vh] h-screen">
      <img src={Logo} alt="logo" className="scale-100" />
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2 mb-[20px]">
          <TabsTrigger value="login" className="cursor-pointer">
            Login
          </TabsTrigger>
          <TabsTrigger value="signup" className="cursor-pointer">
            Sign Up
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <SignUp />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
