import React from 'react';
import { Twitter, Linkedin, Youtube, Mail, MapPin, Calendar } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t-2 border-[#CDFF00]">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Logo & Description */}
          <div className="space-y-4">
            <Logo className="text-white" />
            <p className="text-gray-400 text-sm leading-relaxed">
              L'événement de référence pour les professionnels de l'IA et du Product Management.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://twitter.com/aiproductday" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-900 hover:bg-[#CDFF00] hover:text-black p-2 rounded-lg transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/company/aiproductday" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-900 hover:bg-[#CDFF00] hover:text-black p-2 rounded-lg transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com/@aiproductday" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-900 hover:bg-[#CDFF00] hover:text-black p-2 rounded-lg transition-colors duration-200"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Event Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-[#CDFF00]">Informations</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#CDFF00]" />
                <span>29 Septembre 2026</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#CDFF00]" />
                <span>Paris, France</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#CDFF00]" />
                <a 
                  href="mailto:contact@aiproductday.com"
                  className="hover:text-[#CDFF00] transition-colors"
                >
                  contact@aiproductday.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-[#CDFF00]">Liens rapides</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="/programme" className="hover:text-[#CDFF00] transition-colors">
                  Programme
                </a>
              </li>
              <li>
                <a href="/speakers" className="hover:text-[#CDFF00] transition-colors">
                  Speakers
                </a>
              </li>
              <li>
                <a href="/sponsors" className="hover:text-[#CDFF00] transition-colors">
                  Sponsors
                </a>
              </li>
              <li>
                <a href="/tickets" className="hover:text-[#CDFF00] transition-colors">
                  Billets
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-[#CDFF00]">Légal</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="/mentions-legales" className="hover:text-[#CDFF00] transition-colors">
                  Mentions légales
                </a>
              </li>
              <li>
                <a href="/politique-confidentialite" className="hover:text-[#CDFF00] transition-colors">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="/conditions-generales" className="hover:text-[#CDFF00] transition-colors">
                  Conditions générales
                </a>
              </li>
              <li>
                <a href="/cookies" className="hover:text-[#CDFF00] transition-colors">
                  Gestion des cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>
              © {currentYear} AI Product Day. Tous droits réservés.
            </p>
            <p className="text-gray-500">
              Made with ❤️ for the AI community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};