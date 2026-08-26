import React from 'react';
import AnnouncementBar from '../../components/layout/AnnouncementBar';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProductCard from '../../components/product/ProductCard';
import { useWishlist } from '../../context/WishlistContext';
import { Heart } from 'lucide-react';

const WishlistPage = () => {
  const { wishlist } = useWishlist();
  const products = wishlist.products || [];

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between">
      <AnnouncementBar />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        <div className="border-b border-[#EAE1D2] pb-4 mb-8">
          <span className="text-xs font-bold tracking-widest text-[#7A6248] uppercase block mb-1">
            SAVED FORMULATIONS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123D2A]">
            My Wishlist ({products.length})
          </h1>
        </div>

        {products.length === 0 ? (
          <div className="bg-[#F7F2E8] p-12 text-center rounded-3xl border border-[#EAE1D2] space-y-4 max-w-lg mx-auto">
            <Heart className="w-12 h-12 text-[#123D2A] mx-auto" />
            <h2 className="font-serif text-xl font-bold text-[#123D2A]">Your Wishlist is Empty</h2>
            <p className="text-xs text-[#7A6248]">Save your favorite Ayurvedic formulations here by clicking the heart icon on any product.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;
