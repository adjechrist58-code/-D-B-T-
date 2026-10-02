import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Check, 
  Phone, 
  Truck, 
  RotateCcw, 
  Ruler, 
  AlertCircle 
} from 'lucide-react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { formatPrice, settings, buildWhatsAppUrl } = useStore();
  const { addToCart } = useCart();

  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState<string>(product.images[0] || '');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0].name : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [validationError, setValidationError] = useState<string>('');
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const handleAddToCart = () => {
    if (!product.inStock) return;

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setValidationError('Veuillez sélectionner une taille avant d\'ajouter au panier.');
      return;
    }

    setValidationError('');
    addToCart(product, selectedSize || 'Unique', selectedColor || 'Standard', quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleDirectWhatsAppOrder = () => {
    const sizeInfo = selectedSize ? ` (Taille: ${selectedSize})` : '';
    const colorInfo = selectedColor ? ` (Couleur: ${selectedColor})` : '';
    const msg = `Bonjour ${settings.storeName}, je souhaite commander cet article vu sur votre boutique en ligne :
- Produit : ${product.name}
- Quantité : ${quantity}${sizeInfo}${colorInfo}
- Prix unitaire : ${formatPrice(product.price)}
Pouvez-vous me confirmer la disponibilité et les modalités de livraison ?`;
    window.open(buildWhatsAppUrl(msg), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-stone-100/90 hover:bg-stone-200 text-stone-700 hover:text-stone-950 rounded-full transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Photos Gallery */}
          <div className="p-6 md:p-8 bg-stone-50 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-stone-200/80">
            {/* Main Featured Photo */}
            <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-white shadow-xs">
              <img
                src={selectedImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-stone-900 text-white text-xs uppercase tracking-widest px-4 py-2 rounded-sm font-bold shadow-md">
                    Article Épuisé
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto max-w-full pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === img
                        ? 'border-amber-700 shadow-sm'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} vue ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Selection */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="space-y-4">
              
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs text-stone-500 font-medium tracking-wider uppercase">
                <span>{product.category}</span>
                {product.inStock ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    En Stock
                  </span>
                ) : (
                  <span className="text-rose-600 font-semibold">Rupture temporaire</span>
                )}
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950 leading-tight">
                {product.name}
              </h2>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-stone-950">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-sm sm:text-base text-stone-400 line-through">
                    {formatPrice(product.originalPrice!)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">
                    Économie immédiate
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line pt-2">
                {product.description}
              </p>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                      Taille <span className="text-rose-600">*</span>
                    </label>
                    <button
                      onClick={() => setShowSizeGuide(!showSizeGuide)}
                      className="text-xs text-stone-500 hover:text-stone-900 underline flex items-center gap-1 cursor-pointer"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      Guide des tailles
                    </button>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSize(size);
                          setValidationError('');
                        }}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                          selectedSize === size
                            ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {showSizeGuide && (
                    <div className="mt-3 p-3 bg-stone-100 rounded-xl text-xs text-stone-600 space-y-1 animate-fade-in">
                      <p className="font-semibold text-stone-800">Conseil taille Give to God :</p>
                      <p>• Nos t-shirts et sweats ont une coupe standard légèrement décontractée.</p>
                      <p>• Pour un effet oversize tendance, prenez une taille au-dessus de votre taille habituelle.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                    Couleur : <span className="font-normal text-stone-600">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`relative w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                          selectedColor === c.name
                            ? 'scale-110 border-amber-700 ring-2 ring-amber-700/30'
                            : 'border-stone-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                        aria-label={c.name}
                      >
                        {selectedColor === c.name && (
                          <Check className={`w-4 h-4 mx-auto ${['#FFFFFF', '#F9FAFB', '#F5F5DC'].includes(c.hex) ? 'text-stone-900' : 'text-white'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="pt-2 flex items-center gap-4">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Quantité :
                </label>
                <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 font-bold transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-semibold text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Validation Warning */}
              {validationError && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{validationError}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : !product.inStock
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-stone-900 hover:bg-stone-800 text-white hover:shadow-lg'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Ajouté au panier !</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Ajouter au panier</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDirectWhatsAppOrder}
                className="w-full py-3 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Commander directement via WhatsApp</span>
              </button>

              {/* Small assurances */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-stone-500">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-stone-400" />
                  <span>Livraison partout en ville</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
                  <span>Échange de taille facile</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
