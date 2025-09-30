import React from 'react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

interface TestimonialsColumnProps {
  testimonials: Testimonial[];
  duration: number;
  className?: string;
}

const TestimonialsColumn: React.FC<TestimonialsColumnProps> = ({
  testimonials,
  duration,
  className = ''
}) => {
  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        animate={{
          y: [0, -50 * testimonials.length + '%']
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear'
        }}
        className="flex flex-col"
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <div
            key={`${testimonial.id}-${index}`}
            className="mb-6 p-6 rounded-2xl shadow-sm border"
            style={{
              backgroundColor: 'white',
              borderColor: '#F0E4D3'
            }}
          >
            <p className="text-neutral-700 mb-4 italic leading-relaxed">
              "{testimonial.content}"
            </p>
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm"
                style={{ backgroundColor: '#DCC5B2' }}
              >
                {testimonial.avatar}
              </div>
              <div>
                <p className="font-medium text-neutral-900">{testimonial.name}</p>
                <p className="text-sm text-neutral-600">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default TestimonialsColumn;