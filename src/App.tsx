import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import AdminPanel from './components/AdminPanel';
import { AlertTriangle } from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import { seedProducts } from './lib/seedData';

export default function App() {
  const [hasConfig, setHasConfig] = useState(true);

  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    setHasConfig(!!(url && key));

    if (url && key) {
      seedDatabase();
    }
  }, []);

  async function seedDatabase() {
    try {
      const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      if (count === 0) {
        console.log('Seeding database with initial products...');
        const { error: insertError } = await supabase
          .from('products')
          .insert(seedProducts);
        
        if (insertError) throw insertError;
        console.log('Database seeded successfully!');
      }
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        {!hasConfig && (
          <div className="bg-orange-600 text-white px-4 py-3 flex items-center justify-center gap-3 text-sm font-bold sticky top-0 z-[100] shadow-lg">
            <AlertTriangle size={20} />
            <span>Configuración de Supabase pendiente. Por favor, añade las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.</span>
          </div>
        )}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
