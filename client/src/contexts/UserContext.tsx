import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, defaultUserProfiles } from '@/lib/data';

interface UserContextType {
  currentUser: UserProfile;
  currentRole: string;
  switchRole: (role: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<string>('Household');
  const [userProfiles, setUserProfiles] = useState(defaultUserProfiles);

  const currentUser = userProfiles[currentRole];

  const switchRole = (role: string) => {
    setCurrentRole(role);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfiles(prev => ({
      ...prev,
      [currentRole]: {
        ...prev[currentRole],
        ...updates
      }
    }));
  };

  return (
    <UserContext.Provider value={{ currentUser, currentRole, switchRole, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}