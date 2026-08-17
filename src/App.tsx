import React, { Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { FixedFooter } from './components/FixedFooter';
import { useData } from './context/DataContext';
import { useCart } from './context/CartContext';

// Lazy load all pages for performance
const Home = React.lazy(() => import('./pages/Home'));
const Store = React.lazy(() => import('./pages/Store'));
const Collections = React.lazy(() => import('./pages/Collections'));
const CollectionDetail = React.lazy(() => import('./pages/CollectionDetail'));
const Personalize = React.lazy(() => import('./pages/Personalize'));
const MomentsFaith = React.lazy(() => import('./pages/MomentsFaith'));
const OurStory = React.lazy(() => import('./pages/OurStory'));
const SaintPage = React.lazy(() => import('./pages/SaintPage'));
const ProductDetails = React.lazy(() => import('./pages/ProductDetails').then(m => ({ default: m.ProductDetails })));
const Admin = React.lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));

const LoadingScreen: React.FC<{ message?: string }> = ({ message = 'Carregando...' }) => (
  <div className="min-h-screen bg-cream flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin" />
      <p className="text-navy font-serif animate-pulse">{message}</p>
    </div>
  </div>
);

function Layout() {
  const { isCartOpen, setIsCartOpen } = useCart();
  const { loading } = useData();

  if (loading) {
    return <LoadingScreen message="Invocando a fé..." />;
  }

  return (
    <div className="min-h-screen selection:bg-gold selection:text-navy text-navy">
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <FixedFooter onClick={() => setIsCartOpen(true)} />
    </div>
  );
}

function App() {
  const pageSuspense = (component: React.ReactNode) => (
    <Suspense fallback={<LoadingScreen />}>
      {component}
    </Suspense>
  );

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={pageSuspense(<Home />)} />
        <Route path="/loja" element={pageSuspense(<Store />)} />
        <Route path="/colecoes" element={pageSuspense(<Collections />)} />
        <Route path="/colecoes/:slug" element={pageSuspense(<CollectionDetail />)} />
        <Route path="/personalize" element={pageSuspense(<Personalize />)} />
        <Route path="/momentos-de-fe" element={pageSuspense(<MomentsFaith />)} />
        <Route path="/nossa-historia" element={pageSuspense(<OurStory />)} />
        <Route path="/santos/:slug" element={pageSuspense(<SaintPage />)} />
        <Route path="/produto/:id" element={pageSuspense(<ProductDetails />)} />
      </Route>
      <Route path="/admin" element={
        <Suspense fallback={<LoadingScreen message="Carregando painel..." />}>
          <Admin />
        </Suspense>
      } />
    </Routes>
  );
}

export default App;
