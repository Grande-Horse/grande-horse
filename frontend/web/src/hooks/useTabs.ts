import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useTabs = (tabLength: number) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  if (tabLength === 0) {
    throw new Error('tabList is empty');
  }

  const navigate = useNavigate();
  const location = useLocation();

  let hash = Number(location.hash.replace('#', ''));

  if (isNaN(hash) || hash < 0 || hash >= tabLength) {
    navigate('#0');
  }

  useEffect(() => {
    setActiveTab(hash);
  }, [hash]);

  const handleActiveTab = (hash: number) => {
    navigate(`#${hash}`);
  };

  return [activeTab, handleActiveTab] as const;
};

export default useTabs;
