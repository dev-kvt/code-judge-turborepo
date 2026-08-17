"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Role = "STUDENT" | "TEACHER";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("STUDENT");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("app_role");
      if (saved === "STUDENT" || saved === "TEACHER") {
        setRoleState(saved);
      }
    } catch (e) {
      console.warn("localStorage is not available", e);
    }
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    try {
      localStorage.setItem("app_role", newRole);
    } catch (e) {
      console.warn("localStorage is not available", e);
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
