import React from 'react';
import { Sparkles, Heart, Award, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface AboutPageProps {
  setCurrentTab: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setCurrentTab }) => {
  const { settings } = useStore();

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* Header Banner */}
      <section className="relative py-20 sm:py-28 bg-stone-900 text-stone-100 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1600&q=80"
            alt="Maison Give to God"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-stone-950/70" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Notre Identité & Vision</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            L'Histoire de la Maison {settings.storeName}
          </h1>
          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
            {settings.slogan || "L'élégance qui glorifie. Vêtements haut de gamme d'inspiration divine."}
          </p>
        </div>
      </section>

      {/* Main Story */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              La Genèse
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-950 leading-tight">
              Une foi affirmée dans les codes du streetwear contemporain.
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              La marque <strong>{settings.storeName}</strong> est née d'une conviction profonde : ce que nous portons chaque jour est le reflet de notre identité et de nos valeurs. Face à une mode souvent éphémère et dénuée de sens, nous avons souhaité créer des vêtements qui ont une âme.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              Chaque t-shirt, sweat à capuche et accessoire porte en lui un message d'espérance, de foi inébranlable et de gratitude. "Give to God", c'est rendre hommage au Créateur à travers l'excellence, la beauté et la bienveillance.
            </p>
          </div>

          <div className="aspect-4/5 rounded-3xl overflow-hidden shadow-xl bg-stone-200">
            <img
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"
              alt="Streetwear Give to God"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Pillars */}
        <div className="pt-12">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Nos Piliers
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950">
              Ce qui nous anime chaque jour
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-stone-900">
                La Foi & L'Espérance
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Nos messages ne sont pas de simples slogans, mais des déclarations de vie pour encourager ceux qui les portent et inspirer ceux qui les croisent.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-900 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-stone-900">
                L'Excellence du Tissu
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Sélection rigoureuse de cotons peignés lourds (240g à 420g/m²), broderies denses et finitions soignées pour garantir une tenue parfaite lavage après lavage.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-stone-900">
                La Solidarité
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Donner fait partie intégrante de notre ADN. Nous réinvestissons une part de nos recettes dans des actions concrètes au profit des personnes vulnérables.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-10 bg-stone-900 rounded-3xl text-stone-100 text-center space-y-6">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white max-w-xl mx-auto">
            Prêt à porter une marque qui a du sens ?
          </h3>
          <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto">
            Explorez notre collection actuelle et trouvez la pièce qui vous accompagnera dans vos journées.
          </p>
          <button
            onClick={() => {
              setCurrentTab('boutique');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="py-3 px-8 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <span>Voir la boutique</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </section>

    </div>
  );
};
