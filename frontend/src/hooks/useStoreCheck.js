import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';

function useStoreCheck() {
  const [storeChecked, setStoreChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/stores/me/')
      .then(() => setStoreChecked(true))
      .catch(() => {
        navigate('/store/create');
      });
  }, [navigate]);

  return storeChecked;
}

export default useStoreCheck;
