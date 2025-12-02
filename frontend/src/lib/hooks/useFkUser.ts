
import { useEffect, useState } from "react";

export function useFkUser(): number | null {
  const [fkUser, setFkUser] = useState<number | null>(null);

  useEffect(() => {
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const authData = JSON.parse(authStorage);
        const user = authData?.state?.user;
        
        if (user?.FK) {
          const val = user?.FK ?? null;
          setFkUser(typeof val === "number" ? val : null);
        }
      }
    } catch {
      setFkUser(null);
    }
  }, []);
  return fkUser;
}
