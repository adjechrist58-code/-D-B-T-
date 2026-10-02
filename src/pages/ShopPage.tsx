import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ShoppingBag, 
  ArrowUpDown 
} from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types/store';

interface ShopPageProps {
  onSelectProduct: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onSelectProduct }) => {
  const { products } = useProducts();
  const { formatPrice } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedSize, setSelectedSize] = useState<string>('Toutes');
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract unique categories and sizes
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['Tous', ...Array.from(set)];
  }, [products]);

  const sizes = ['Toutes', 'S', 'M', 'L', 'XL', 'XXL'];

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchCat = product.category.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }

        // Category filter
        if (selectedCategory !== 'Tous' && product.category !== selectedCategory) {
          return false;
        }

        // Size filter
        if (selectedSize !== 'Toutes') {
          if (!product.sizes || !product.sizes.includes(selectedSize)) {
            return false;
          }
        }

        // Price filter
        if (product.price > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0; // default / popular
      });
  }, [products, searchQuery, selectedCategory, selectedSize, maxPrice, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Tous');
    setSelectedSize('Toutes');
    setMaxPrice(50000);
    setSortBy('popular');
  };

  const isFiltered =
    searchQuery !== '' ||
    selectedCategory !== 'Tous' ||
    selectedSize !== 'Toutes' ||
    maxPrice < 50000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-stone-200 gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
            Catalogue Officiel
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950 mt-1">
            Boutique & Collections
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {filteredProducts.length} article{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher t-shirt, hoodie, casquette..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-2 px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtres</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className={`md:block ${showMobileFilters ? 'block' : 'hidden'} space-y-6 md:sticky md:top-28 md:self-start bg-stone-50 md:bg-transparent p-5 md:p-0 rounded-2xl border md:border-0 border-stone-200`}>
          
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-700" />
              Filtres de recherche
            </span>
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-amber-800 hover:underline font-semibold cursor-pointer"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-800">
              Catégorie
            </label>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'text-stone-600 hover:bg-stone-200/60'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-800">
              Taille
            </label>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-1.5 px-2 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                    selectedSize === s
                      ? 'border-stone-900 bg-stone-900 text-white font-bold'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold uppercase tracking-wider text-stone-800">
                Budget Max
              </label>
              <span className="font-extrabold text-stone-950 font-serif">
                {formatPrice(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="50000"
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-amber-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>{formatPrice(5000)}</span>
              <span>{formatPrice(50000)}</span>
            </div>
          </div>

          {/* Sorting */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-800">
              Trier par
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-700 cursor-pointer"
            >
              <option value="popular">Popularité & Nouveautés</option>
              <option value="price-asc">Prix : Croissant</option>
              <option value="price-desc">Prix : Décroissant</option>
              <option value="name">Nom du produit (A - Z)</option>
            </select>
          </div>

        </aside>

        {/* Product Grid Area */}
        <div className="md:col-span-3 space-y-6">
          
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-stone-200/80 p-8">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Aucun article ne correspond à votre recherche
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Essayez d'ajuster vos filtres de prix ou de catégorie, ou supprimez votre mot-clé de recherche.
              </p>
              <button
                onClick={resetFilters}
                className="py-2.5 px-6 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
