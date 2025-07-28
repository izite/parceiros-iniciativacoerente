import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { UserProvider } from "@/contexts/user-context";
import { UsersProvider } from "@/contexts/users-context";
import { ContractsProvider } from "@/contexts/contracts-context";
import { ContactsProvider } from "@/contexts/contacts-context";
import { RequestsProvider } from "@/contexts/requests-context";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Contracts from "./pages/Contracts";
import NewContract from "./pages/NewContract";
import Requests from "./pages/Requests";
import NewRequest from "./pages/NewRequest";
import RequestChat from "./pages/RequestChat";
import Occurrences from "./pages/Occurrences";
import NewOccurrence from "./pages/NewOccurrence";
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
              <RequestsProvider>
              <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/home" element={<LayoutWrapper><Home /></LayoutWrapper>} />
            <Route path="/contacts" element={<LayoutWrapper><Contacts /></LayoutWrapper>} />
            <Route path="/contracts" element={<LayoutWrapper><Contracts /></LayoutWrapper>} />
            <Route path="/contracts/new" element={<LayoutWrapper><NewContract /></LayoutWrapper>} />
            <Route path="/requests" element={<LayoutWrapper><Requests /></LayoutWrapper>} />
            <Route path="/requests/new" element={<LayoutWrapper><NewRequest /></LayoutWrapper>} />
            <Route path="/requests/:requestId/chat" element={<LayoutWrapper><RequestChat /></LayoutWrapper>} />
            <Route path="/occurrences" element={<LayoutWrapper><Occurrences /></LayoutWrapper>} />
            <Route path="/new-occurrence" element={<LayoutWrapper><NewOccurrence /></LayoutWrapper>} />
            <Route path="/occurrences/:occurrenceId" element={<LayoutWrapper><OccurrenceDetails /></LayoutWrapper>} />
            <Route path="/users" element={<LayoutWrapper><Users /></LayoutWrapper>} />
            <Route path="/users/add" element={<LayoutWrapper><AddUser /></LayoutWrapper>} />
            <Route path="/users/edit/:id" element={<LayoutWrapper><EditUser /></LayoutWrapper>} />
            <Route path="/drive" element={<LayoutWrapper><Drive /></LayoutWrapper>} />
            <Route path="*" element={<LayoutWrapper><NotFound /></LayoutWrapper>} />
          </Routes>
        </BrowserRouter>
              </TooltipProvider>
              </RequestsProvider>
            </ContactsProvider>
          </ContractsProvider>
        </UsersProvider>
      </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
