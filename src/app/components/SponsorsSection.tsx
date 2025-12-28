import React from 'react';

interface Sponsor {
  id: string;
  name: string;
  tier: 'platinum' | 'gold' | 'silver' | 'partner';
  logo?: string;
}

interface SponsorsSectionProps {
  sponsors?: Sponsor[];
  className?: string;
}

// Sponsors de placeholder - à remplacer avec les vrais sponsors
const defaultSponsors: Sponsor[] = [
  { id: '1', name: 'Tech Corp', tier: 'platinum' },
  { id: '2', name: 'AI Solutions', tier: 'platinum' },
  { id: '3', name: 'DataVision', tier: 'gold' },
  { id: '4', name: 'CloudBase', tier: 'gold' },
  { id: '5', name: 'StartupX', tier: 'gold' },
  { id: '6', name: 'InnovateAI', tier: 'silver' },
  { id: '7', name: 'DevTools Pro', tier: 'silver' },
  { id: '8', name: 'CodeFactory', tier: 'silver' },
  { id: '9', name: 'TechHub', tier: 'partner' },
  { id: '10', name: 'Innovation Lab', tier: 'partner' },
];

export const SponsorsSection: React.FC<SponsorsSectionProps> = ({ 
  sponsors = defaultSponsors,
  className = ''
}) => {
  const tierConfig = {
    platinum: { label: 'Platinum Partners', color: 'from-gray-400 to-gray-600', size: 'h-24' },
    gold: { label: 'Gold Partners', color: 'from-yellow-400 to-yellow-600', size: 'h-20' },
    silver: { label: 'Silver Partners', color: 'from-gray-300 to-gray-400', size: 'h-16' },
    partner: { label: 'Partners', color: 'from-indigo-400 to-purple-500', size: 'h-14' }
  };

  const tiers = ['platinum', 'gold', 'silver', 'partner'] as const;

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">
            Nos Sponsors
          </h2>
          <p className="text-gray-600">
            Merci à nos partenaires qui rendent cet événement possible
          </p>
        </div>

        <div className="space-y-12">
          {tiers.map(tier => {
            const tierSponsors = sponsors.filter(s => s.tier === tier);
            if (tierSponsors.length === 0) return null;

            const config = tierConfig[tier];

            return (
              <div key={tier} className="space-y-6">
                <div className="text-center">
                  <h3 className={`text-lg font-semibold ${tier === 'platinum' ? 'text-[#CDFF00]' : 'text-gray-700'}`}>
                    {config.label}
                  </h3>
                </div>
                
                <div className={`grid grid-cols-2 md:grid-cols-${tier === 'platinum' ? '2' : tier === 'gold' ? '3' : '4'} gap-8 items-center`}>
                  {tierSponsors.map(sponsor => (
                    <div 
                      key={sponsor.id}
                      className="group relative bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 border-2 border-gray-200 hover:border-[#CDFF00]"
                    >
                      <div className={`flex items-center justify-center ${config.size}`}>
                        {sponsor.logo ? (
                          <img 
                            src={sponsor.logo} 
                            alt={sponsor.name}
                            className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                          />
                        ) : (
                          <div className="text-center">
                            <div className={`text-lg font-bold text-gray-800`}>
                              {sponsor.name}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA for becoming a sponsor */}
        <div className="mt-16 text-center">
          <div className="bg-black text-white rounded-xl p-8 border-2 border-[#CDFF00]">
            <h3 className="text-xl font-bold mb-2">Devenez sponsor</h3>
            <p className="text-gray-400 mb-4">
              Contactez-nous pour découvrir nos offres de partenariat
            </p>
            <a 
              href="mailto:sponsors@aiproductday.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#CDFF00] text-black font-bold rounded-lg hover:bg-[#b8e600] transition-all duration-200"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};