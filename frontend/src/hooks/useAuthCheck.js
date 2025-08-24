import { useState, useEffect } from 'react';
import api from '../lib/axios';

export default function useAuthCheck() {
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setAuthChecked(true);
      return;
    }

    api.get('/auth/me/')
      .then((res) => setUser(res.data.data))
      .catch(() => localStorage.clear())
      .finally(() => setAuthChecked(true));
  }, []);

  return { authChecked, user };
}
