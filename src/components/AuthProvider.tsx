'use client';

import { getUser, User } from '@/server/actions/user';
import { login, signOut } from '@/server/actions/auth';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';

type Login = (args: FormData) => Promise<User>;

type Logout = () => Promise<void>;

type AuthContext = {
  logIn: Login;
  logOut: Logout;
  setUser: (user: User) => void;
  user: User;
};

const Context = createContext({} as AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const logIn = useCallback<Login>(async (args) => {
    await login(args);

    const user = await getUser();
    setUser(user);

    return user;
  }, []);

  const logOut = useCallback<Logout>(async () => {
    await signOut();

    setUser(null);
    router.push('/');
  }, [router]);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const user = await getUser();

        setUser(user);
      } catch (e) {
        setUser(null);
        throw new Error('Podczas pobierania użytkownika wystąpił błąd.');
      }
    };

    void fetchMe();
  }, []);

  return (
    <Context.Provider
      value={{
        logIn,
        logOut,
        setUser,
        user,
      }}
    >
      {children}
    </Context.Provider>
  );
};

type UseAuth<T = User> = () => AuthContext;

export const useAuth: UseAuth = () => useContext(Context);
