import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthProvider } from "@/contexts/auth-context";
import { UserProvider } from "@/contexts/user-context";
import { UsersProvider } from "@/contexts/users-context";
import { ContractsProvider } from "@/contexts/contracts-context";
import { ContactsProvider } from "@/contexts/contacts-context";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Contracts from "./pages/Contracts";
import AddContract from "./pages/AddContract";
import ContractDetails from "./pages/ContractDetails";
import Requests from "./pages/Requests";
import RequestDetails from "./pages/RequestDetails";
import NewRequest from "./pages/NewRequest";
import Occurrences from "./pages/Occurrences";
import OccurrenceDetails from "./pages/OccurrenceDetails";

import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import AddContact from "./pages/AddContact";
import Contacts from "./pages/Contacts";
import Drive from "./pages/Drive";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="crm-ui-theme">
      <AuthProvider>
        <UserProvider>
        <UsersProvider>
          <ContractsProvider>
            <ContactsProvider>
              <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/home" element={
              <SidebarProvider defaultOpen={true}>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
                      <SidebarTrigger />
                      <ThemeToggle />
                    </header>
                    <main className="flex-1 p-6">
                      <Home />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            } />
            <Route path="/contacts" element={
              <SidebarProvider defaultOpen={true}>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
                      <SidebarTrigger />
                      <ThemeToggle />
                    </header>
                    <main className="flex-1 p-6">
                      <Contacts />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            } />
            <Route path="/contracts" element={
              <SidebarProvider defaultOpen={true}>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
                      <SidebarTrigger />
                      <ThemeToggle />
                    </header>
                    <main className="flex-1 p-6">
                      <Contracts />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            } />
            <Route path="/requests" element={
              <SidebarProvider defaultOpen={true}>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
                      <SidebarTrigger />
                      <ThemeToggle />
                    </header>
                    <main className="flex-1 p-6">
                      <Requests />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            } />
            <Route path="/requests/:requestId" element={
              <SidebarProvider defaultOpen={true}>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
                      <SidebarTrigger />
                      <ThemeToggle />
                    </header>
                    <main className="flex-1 p-6">
                      <RequestDetails />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            } />
            <Route path="/requests/new" element={
              <SidebarProvider defaultOpen={true}>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
                      <SidebarTrigger />
                      <ThemeToggle />
                    </header>
                    <main className="flex-1 p-6">
                      <NewRequest />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            } />
            <Route path="/occurrences" element={
              <SidebarProvider defaultOpen={true}>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
                      <SidebarTrigger />
                      <ThemeToggle />
                    </header>
                    <main className="flex-1 p-6">
                      <Occurrences />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            } />
            <Route path="/occurrences/:occurrenceId" element={
              <SidebarProvider defaultOpen={true}>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
                      <SidebarTrigger />
                      <ThemeToggle />
                    </header>
                    <main className="flex-1 p-6">
                      <OccurrenceDetails />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            } />
            <Route path="/users" element={
              <SidebarProvider defaultOpen={true}>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
                      <SidebarTrigger />
                      <ThemeToggle />
                    </header>
                    <main className="flex-1 p-6">
                      <Users />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            } />
            <Route path="/users/add" element={
              <SidebarProvider defaultOpen={true}>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
                      <SidebarTrigger />
                      <ThemeToggle />
                    </header>
                    <main className="flex-1 p-6">
                      <AddUser />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            } />
            <Route path="/users/edit/:id" element={
              <SidebarProvider defaultOpen={true}>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
                      <SidebarTrigger />
                      <ThemeToggle />
                    </header>
                    <main className="flex-1 p-6">
                      <EditUser />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            } />
            <Route path="/drive" element={
              <SidebarProvider defaultOpen={true}>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
                      <SidebarTrigger />
                      <ThemeToggle />
                    </header>
                    <main className="flex-1 p-6">
                      <Drive />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            } />
            <Route path="*" element={
              <SidebarProvider defaultOpen={true}>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
                      <SidebarTrigger />
                      <ThemeToggle />
                    </header>
                    <main className="flex-1 p-6">
                      <NotFound />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            } />
          </Routes>
        </BrowserRouter>
              </TooltipProvider>
            </ContactsProvider>
          </ContractsProvider>
        </UsersProvider>
      </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
