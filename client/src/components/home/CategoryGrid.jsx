import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import API from '../../services/api';

const defaultCategories = [
  {
    name: 'KADHA',
    slug: 'kadha',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'HERBAL MEDICINES',
    slug: 'ayurvedic-medicines',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'HERBAL OILS',
    slug: 'herbal-oils',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'POWDERS',
    slug: 'powders',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'WELLNESS',
    slug: 'wellness',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
  },
];

const CategoryGrid = () => {
  const [categories, setCategories] = useState(defaultCategories);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await API.get('/categories');
        if (res.success && res.data.length > 0) {
          setCategories(res.data);
        }
      } catch (err) {
        console.warn('Loaded default categories fallback:', err.message);
      }
    };
    loadCategories();
  }, []);

  return (
    <section className="py-20 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10">
          <span className="text-xs font-bold tracking-widest text-[#7A6248] uppercase block mb-1">
            EXPLORE BY CATEGORY
          </span>
          <div className="flex items-center space-x-3">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123D2A]">
              Find Your Wellness
            </h2>
            <div className="w-12 h-[2px] bg-[#789B72] mt-2" />
          </div>
        </div>

        {/* Categories Grid matching Reference image layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.slice(0, 5).map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group relative h-80 rounded-2xl overflow-hidden shadow-card hover:shadow-2xl transition-all duration-500 flex flex-col justify-end p-5"
            >
              {/* Background Image */}
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2D1E]/90 via-[#0B2D1E]/40 to-transparent" />

              {/* Text Content */}
              <div className="relative z-10 space-y-1">
                <h3 className="font-serif font-bold text-lg text-white tracking-wide uppercase">
                  {cat.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#C49A52] group-hover:translate-x-1 transition-transform">
                  Shop Now <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategoryGrid;
