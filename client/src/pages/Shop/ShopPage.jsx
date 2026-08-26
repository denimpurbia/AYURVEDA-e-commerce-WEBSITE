import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AnnouncementBar from '../../components/layout/AnnouncementBar';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProductCard from '../../components/product/ProductCard';
import API from '../../services/api';
import { Filter, SlidersHorizontal, Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });

  // Filters state
  const keyword = searchParams.get('search') || '';
  const categorySlug = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get('/categories');
        if (res.success) setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (keyword) params.set('keyword', keyword);
        if (categorySlug) params.set('categorySlug', categorySlug);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (rating) params.set('rating', rating);
        if (sort) params.set('sort', sort);
        params.set('page', page);
        params.set('limit', 12);

        const res = await API.get(`/products?${params.toString()}`);
        if (res.success) {
          setProducts(res.data);
          setMeta(res.meta || { total: res.data.length, page: 1, pages: 1 });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between">
      <AnnouncementBar />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        
        {/* Shop Title & Controls */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#EAE1D2] pb-6 mb-8 gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#7A6248] uppercase block mb-1">
              AYURVEDAMART CATALOG
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123D2A]">
              Explore Wellness Products
            </h1>
          </div>

          {/* Sort Dropdown & Mobile Filter Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-4 py-2 bg-[#F7F2E8] border border-[#EAE1D2] rounded-full text-xs font-bold text-[#123D2A]"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-[#7A6248] hidden sm:inline">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="px-3 py-2 bg-[#FFFDF8] border border-[#EAE1D2] rounded-full text-xs font-bold text-[#123D2A] focus:outline-none focus:ring-1 focus:ring-[#123D2A]"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className={`lg:col-span-3 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'} bg-[#F7F2E8]/60 p-6 rounded-2xl border border-[#EAE1D2]`}>
            
            <div className="flex items-center justify-between border-b border-[#EAE1D2] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#123D2A] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#789B72]" /> Filters
              </h3>
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#C49A52] font-semibold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Search Input */}
            <div>
              <label className="text-xs font-bold text-[#123D2A] uppercase block mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Keyword..."
                  value={keyword}
                  onChange={(e) => updateParam('search', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FFFDF8] border border-[#EAE1D2] rounded-xl pl-8 focus:outline-none"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Categories Filter */}
            <div>
              <label className="text-xs font-bold text-[#123D2A] uppercase block mb-2">Categories</label>
              <div className="space-y-1 max-h-48 overflow-y-auto text-xs">
                <button
                  onClick={() => updateParam('category', '')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors font-medium ${
                    !categorySlug ? 'bg-[#123D2A] text-white font-bold' : 'text-[#243229] hover:bg-[#EAE1D2]'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => updateParam('category', cat.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors font-medium ${
                      categorySlug === cat.slug ? 'bg-[#123D2A] text-white font-bold' : 'text-[#243229] hover:bg-[#EAE1D2]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="text-xs font-bold text-[#123D2A] uppercase block mb-2">Price Range (₹)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateParam('minPrice', e.target.value)}
                  className="px-3 py-1.5 text-xs bg-[#FFFDF8] border border-[#EAE1D2] rounded-lg focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateParam('maxPrice', e.target.value)}
                  className="px-3 py-1.5 text-xs bg-[#FFFDF8] border border-[#EAE1D2] rounded-lg focus:outline-none"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="text-xs font-bold text-[#123D2A] uppercase block mb-2">Minimum Rating</label>
              <select
                value={rating}
                onChange={(e) => updateParam('rating', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FFFDF8] border border-[#EAE1D2] rounded-xl focus:outline-none"
              >
                <option value="">All Ratings</option>
                <option value="4.5">4.5★ & Above</option>
                <option value="4.0">4.0★ & Above</option>
                <option value="3.5">3.5★ & Above</option>
              </select>
            </div>

          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-9 space-y-6">
            
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-[#F7F2E8] rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-[#F7F2E8] p-12 text-center rounded-3xl border border-[#EAE1D2] space-y-3">
                <h3 className="font-serif font-bold text-xl text-[#123D2A]">No Products Found</h3>
                <p className="text-xs text-[#7A6248]">Try clearing your search filters or searching for another keyword.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-[#123D2A] text-white text-xs font-bold rounded-full"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {meta.pages > 1 && (
                  <div className="flex items-center justify-center space-x-2 pt-8">
                    <button
                      disabled={meta.page <= 1}
                      onClick={() => updateParam('page', meta.page - 1)}
                      className="p-2 rounded-full border border-[#EAE1D2] bg-[#FFFDF8] disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4 text-[#123D2A]" />
                    </button>
                    <span className="text-xs font-bold text-[#123D2A] px-4">
                      Page {meta.page} of {meta.pages}
                    </span>
                    <button
                      disabled={meta.page >= meta.pages}
                      onClick={() => updateParam('page', meta.page + 1)}
                      className="p-2 rounded-full border border-[#EAE1D2] bg-[#FFFDF8] disabled:opacity-40"
                    >
                      <ChevronRight className="w-4 h-4 text-[#123D2A]" />
                    </button>
                  </div>
                )}
              </>
            )}

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default ShopPage;
