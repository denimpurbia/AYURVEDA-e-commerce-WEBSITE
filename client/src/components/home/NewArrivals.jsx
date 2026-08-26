import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../product/ProductCard';
import API from '../../services/api';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await API.get('/products?sort=newest&limit=6');

        console.log('New Arrivals API Response:', res);

        if (res.success && Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Failed to load new arrivals:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <section className="py-16 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#7A6248] uppercase block mb-1">
              CURATED SELECTION
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123D2A]">
              NEW ARRIVALS
            </h2>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#123D2A] hover:text-[#C49A52] transition-colors group"
          >
            VIEW ALL PRODUCTS
            <ArrowRight className="w-4 h-4 text-[#C49A52] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-sm text-[#7A6248]">
              Loading new arrivals...
            </p>
          </div>
        )}

        {/* Products */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}

        {/* No Products */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-[#7A6248]">
              No new arrivals available right now.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

export default NewArrivals;