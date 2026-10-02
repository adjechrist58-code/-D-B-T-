import React, { useRef, useState } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Plus, 
  Check, 
  Link as LinkIcon, 
  Sparkles,
  Camera
} from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
  label?: string;
  maxImages?: number;
}

// Preset samples to help beginner store owners quickly test high quality fashion visuals
const PRESET_APPAREL_IMAGES = [
  { label: 'T-Shirt Noir Minimal', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80' },
  { label: 'T-Shirt Blanc Pur', url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80' },
  { label: 'Hoodie Écru Molleton', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sweat Vert Olive', url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80' },
  { label: 'Casquette Brodée', url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Ensemble Sportswear', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80' },
];

/**
 * Redimensionne et compresse une image côté client via HTML5 Canvas
 * afin de réduire une photo lourde de smartphone (5Mo+) en une image légère (~100-150Ko)
 */
function compressImage(file: File, maxWidth = 1000, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Exporte en JPEG compressé
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  multiple = true,
  label = "Photos de l'article",
  maxImages = 5,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [showPresets, setShowPresets] = useState(false);

  // Gestion du téléversement de fichiers locaux (appareil photo ou galerie)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const compressed = await compressImage(file, 1000, 0.8);
          newImages.push(compressed);
        }
      }

      if (multiple) {
        const updated = [...images, ...newImages].slice(0, maxImages);
        onChange(updated);
      } else {
        onChange([newImages[0]]);
      }
    } catch (err) {
      console.error('Erreur lors du traitement de la photo:', err);
      alert('Une erreur est survenue lors du traitement de la photo.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    if (multiple) {
      onChange([...images, customUrl.trim()].slice(0, maxImages));
    } else {
      onChange([customUrl.trim()]);
    }
    setCustomUrl('');
    setShowUrlInput(false);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleSetMainCover = (index: number) => {
    if (index === 0) return;
    const selected = images[index];
    const rest = images.filter((_, idx) => idx !== index);
    onChange([selected, ...rest]);
  };

  const handleSelectPreset = (presetUrl: string) => {
    if (multiple) {
      if (!images.includes(presetUrl)) {
        onChange([...images, presetUrl].slice(0, maxImages));
      }
    } else {
      onChange([presetUrl]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block font-semibold text-stone-800 text-xs">
          {label} {multiple && <span className="text-stone-400 font-normal">({images.length}/{maxImages} max)</span>}
        </label>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-stone-500 hover:text-stone-800 underline flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'Masquer URL' : 'Ajouter par lien web'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="text-[11px] text-amber-800 hover:text-amber-950 font-medium flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Photos d'exemples</span>
          </button>
        </div>
      </div>

      {/* Saisie d'URL manuelle optionnelle */}
      {showUrlInput && (
        <div className="flex gap-2 p-2 bg-stone-100 rounded-xl animate-fade-in">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Collez ici le lien direct de votre photo (https://...)"
            className="flex-1 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Ajouter
          </button>
        </div>
      )}

      {/* Panneau des photos modèles prêtes à l'emploi */}
      {showPresets && (
        <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-2 animate-fade-in">
          <span className="text-[11px] font-bold text-amber-900 block">
            Sélectionnez une photo modèle prête à l'emploi :
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESET_APPAREL_IMAGES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset.url)}
                className="flex items-center gap-2 p-1.5 bg-white border border-amber-200 rounded-xl hover:border-amber-500 text-left transition-colors cursor-pointer group"
              >
                <img src={preset.url} alt={preset.label} className="w-8 h-10 object-cover rounded-lg shrink-0" />
                <span className="text-[10px] text-stone-700 font-medium line-clamp-1 group-hover:text-amber-900">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input de fichier caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Zone de prévisualisation et ajout */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((imgUrl, index) => (
          <div 
            key={index} 
            className="relative aspect-4/5 rounded-2xl overflow-hidden bg-stone-100 border-2 border-stone-200 group shadow-xs"
          >
            <img 
              src={imgUrl} 
              alt={`Photo ${index + 1}`} 
              className="w-full h-full object-cover" 
            />

            {/* Badge photo principale */}
            {index === 0 && (
              <span className="absolute top-1.5 left-1.5 bg-stone-950/80 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-xs">
                Principale
              </span>
            )}

            {/* Action overlay au survol */}
            <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => handleSetMainCover(index)}
                  className="p-1.5 bg-white text-stone-900 rounded-full hover:bg-stone-100 text-[10px] font-bold"
                  title="Définir comme photo principale"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                </button>
              )}

              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-colors"
                title="Supprimer cette photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Bouton d'ajout d'une photo depuis l'appareil */}
        {(multiple ? images.length < maxImages : images.length === 0) && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="aspect-4/5 rounded-2xl border-2 border-dashed border-stone-300 hover:border-amber-700 bg-stone-50 hover:bg-amber-50/40 flex flex-col items-center justify-center p-3 text-center transition-all cursor-pointer group disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-full bg-white group-hover:bg-amber-100 text-stone-600 group-hover:text-amber-800 flex items-center justify-center shadow-xs transition-colors mb-2">
              {isProcessing ? (
                <Upload className="w-5 h-5 animate-bounce text-amber-700" />
              ) : (
                <Camera className="w-5 h-5" />
              )}
            </div>
            <span className="text-[11px] font-bold text-stone-800 group-hover:text-amber-900 block leading-tight">
              {isProcessing ? 'Traitement...' : 'Ajouter une photo'}
            </span>
            <span className="text-[9px] text-stone-400 mt-1 block">
              Depuis votre appareil (Téléphone ou PC)
            </span>
          </button>
        )}
      </div>

      <p className="text-[10px] text-stone-500">
        💡 Vos photos sont automatiquement optimisées pour un affichage ultra-rapide sur mobile sans ralentir le site.
      </p>
    </div>
  );
};
