import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to inventories screen on app start
    router.replace('/inventories');
  }, [router]);

  return null;
}
