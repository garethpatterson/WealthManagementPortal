import { useState, useEffect } from 'react';
import { MOCK_ALLOCATION, MOCK_DOCUMENTS } from '../lib/sampleData';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

// Simulating network latency for mock data that wasn't migrated
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useClientData = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!currentUser) return;
      setLoading(true);
      
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : { name: currentUser.email };

        const q = query(collection(db, 'accounts'), where('userId', '==', currentUser.uid));
        const snapshot = await getDocs(q);
        
        const accounts = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
        const totalNetWorth = accounts.reduce((sum, acc) => sum + acc.balance, 0);

        setData({
          name: userData.name,
          accounts,
          totalNetWorth
        });
      } catch (e) {
        console.error("Error fetching client data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [currentUser]);

  return { data, loading };
};

export const usePortfolioHistory = () => {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const q = query(collection(db, 'history'), where('userId', '==', currentUser.uid));
        const snapshot = await getDocs(q);
        
        // Sorting history by date since Firestore doesn't guarantee order without an index
        const data = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
        setHistory(data);
      } catch (e) {
        console.error("Error fetching history:", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [currentUser]);

  return { history, loading };
};

export const usePositions = () => {
  const { currentUser } = useAuth();
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const q = query(collection(db, 'positions'), where('userId', '==', currentUser.uid));
        const snapshot = await getDocs(q);
        
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPositions(data);
      } catch (e) {
        console.error("Error fetching positions:", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [currentUser]);

  return { positions, loading };
};

export const useAssetAllocation = () => {
  const { currentUser } = useAuth();
  const [allocation, setAllocation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!currentUser) return;
      setLoading(true);
      
      try {
        // Build dynamic asset allocation from live positions
        const q = query(collection(db, 'positions'), where('userId', '==', currentUser.uid));
        const snapshot = await getDocs(q);
        const positions = snapshot.docs.map(doc => doc.data());
        
        if (positions.length === 0) {
          // Fallback if no specific positions
          setAllocation(MOCK_ALLOCATION);
          setLoading(false);
          return;
        }

        const allocMap: Record<string, number> = {};
        positions.forEach((p: any) => {
          let cat = 'Other';
          if (p.type === 'Equity') {
             cat = p.region === 'Canada' ? 'Canadian Equity' : (p.region === 'US' ? 'US Equity' : 'Global Equity');
          } else if (p.type === 'Fixed Income') {
             cat = 'Fixed Income';
          }
          allocMap[cat] = (allocMap[cat] || 0) + p.marketValue;
        });

        const colorMap: Record<string, string> = {
          'Canadian Equity': '#2563eb',
          'US Equity': '#3b82f6',
          'Global Equity': '#60a5fa',
          'Fixed Income': '#94a3b8',
          'Other': '#cbd5e1'
        };

        const dynamicAllocation = Object.entries(allocMap).map(([name, value]) => ({
          name,
          value,
          color: colorMap[name] || '#cbd5e1'
        }));

        setAllocation(dynamicAllocation);
      } catch (e) {
        console.error("Error generating asset allocation", e);
        setAllocation(MOCK_ALLOCATION); // fallback
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [currentUser]);

  return { allocation, loading };
};

export const useDocuments = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      await delay(1000);
      setDocuments(MOCK_DOCUMENTS);
      setLoading(false);
    };
    fetch();
  }, []);

  return { documents, loading };
};
