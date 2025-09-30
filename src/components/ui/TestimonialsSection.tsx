import React from 'react';
import TestimonialsColumn from './TestimonialsColumn';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

const testimonialsData: Testimonial[] = [
  {
    id: '1',
    name: 'Jeanne Dubois',
    role: 'Développeuse Front-end',
    content: 'Grâce à ColabSwipe, j\'ai trouvé le partenaire idéal pour mon projet en un temps record. La plateforme est intuitive et efficace.',
    avatar: 'JD'
  },
  {
    id: '2',
    name: 'Marc Dupont',
    role: 'Entrepreneur Tech',
    content: 'La fonctionnalité de matching est bluffante ! J\'ai pu collaborer avec des personnes aux compétences complémentaires que je n\'aurais jamais trouvées ailleurs.',
    avatar: 'MD'
  },
  {
    id: '3',
    name: 'Sophie Leclerc',
    role: 'Designer graphique',
    content: 'ColabSwipe a transformé ma manière de réseauter. C\'est un outil indispensable pour tout créatif cherchant à élargir son horizon.',
    avatar: 'SL'
  },
  {
    id: '4',
    name: 'Lucas Martin',
    role: 'Product Manager',
    content: 'Une interface léchée et une expérience utilisateur au top. ColabSwipe facilite vraiment la mise en relation entre professionnels.',
    avatar: 'LM'
  },
  {
    id: '5',
    name: 'Emma Rodriguez',
    role: 'UX Designer',
    content: 'J\'ai lancé trois projets collaboratifs grâce à cette plateforme. Les connexions sont de qualité et les échanges enrichissants.',
    avatar: 'ER'
  },
  {
    id: '6',
    name: 'Thomas Leroy',
    role: 'Développeur Full-stack',
    content: 'Enfin une plateforme qui comprend les besoins des créateurs ! Le système de matching par compétences est révolutionnaire.',
    avatar: 'TL'
  },
  {
    id: '7',
    name: 'Marie Petit',
    role: 'Chef de projet digital',
    content: 'Les outils de collaboration intégrés sont parfaits. J\'ai pu gérer mes projets de A à Z directement sur la plateforme.',
    avatar: 'MP'
  },
  {
    id: '8',
    name: 'Antoine Moreau',
    role: 'Consultant Marketing',
    content: 'La qualité des profils sur ColabSwipe est exceptionnelle. Chaque collaboration a été un succès.',
    avatar: 'AM'
  },
  {
    id: '9',
    name: 'Camille Rousseau',
    role: 'Photographe',
    content: 'Grâce à ColabSwipe, j\'ai diversifié mes projets et rencontré des collaborateurs inspirants dans tous les domaines créatifs.',
    avatar: 'CR'
  },
  {
    id: '10',
    name: 'Pierre Durand',
    role: 'Développeur Mobile',
    content: 'L\'algorithme de matching est impressionnant. Il m\'a connecté avec exactement les bonnes personnes pour mes projets.',
    avatar: 'PD'
  },
  {
    id: '11',
    name: 'Julie Bernard',
    role: 'Rédactrice Web',
    content: 'ColabSwipe m\'a permis de sortir de ma zone de confort et de collaborer sur des projets que je n\'aurais jamais imaginés.',
    avatar: 'JB'
  },
  {
    id: '12',
    name: 'Maxime Girard',
    role: 'Data Scientist',
    content: 'La communauté ColabSwipe est bienveillante et professionnelle. Chaque échange apporte une réelle valeur ajoutée.',
    avatar: 'MG'
  }
];

const TestimonialsSection: React.FC = () => {
  // Split testimonials into 3 columns
  const column1 = testimonialsData.slice(0, 4);
  const column2 = testimonialsData.slice(4, 8);
  const column3 = testimonialsData.slice(8, 12);

  return (
    <section className="py-20 px-4" style={{ backgroundColor: '#F0E4D3' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Découvrez comment ColabSwipe transforme la collaboration créative
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-96 overflow-hidden">
          <TestimonialsColumn
            testimonials={column1}
            duration={15}
            className="h-full"
          />
          <TestimonialsColumn
            testimonials={column2}
            duration={19}
            className="h-full"
          />
          <TestimonialsColumn
            testimonials={column3}
            duration={17}
            className="h-full"
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;