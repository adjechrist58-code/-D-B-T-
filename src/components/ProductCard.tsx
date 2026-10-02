import React from 'react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { formatPrice } = useStore();
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div 
      onClick={() => onSelect(product)}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-md hover:border-stone-300 transition-all duration-300 cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-4/5 w-full bg-stone-100 overflow-hidden">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badge in top left if discounted or out of stock */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {!product.inStock && (
            <span className="bg-stone-900/90 text-white text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-xs backdrop-blur-xs">
              Épuisé
            </span>
          )}
          {hasDiscount && product.inStock && (
            <span className="bg-amber-700 text-white text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-xs">
              Promo
            </span>
          )}
        </div>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex items-center gap-2 bg-white/95 text-stone-900 font-medium text-xs px-4 py-2.5 rounded-full shadow-md hover:bg-white transition-all transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Voir les détails</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category - clean text without pills */}
          <div className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">
            {product.category}
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Available Sizes List */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="text-xs text-stone-400 mt-1 line-clamp-1">
              Tailles : {product.sizes.join(', ')}
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-stone-900 text-base sm:text-lg">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            aria-label={`Choisir la taille pour ${product.name}`}
            title="Choisir et ajouter au panier"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
