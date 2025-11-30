import React, { useState } from 'react';
import { ChevronDown, Twitter, Instagram, Github, MessageCircle } from 'lucide-react';

const faqs = [
  {
    q: 'How does the matching algorithm work?',
    a: 'We combine profile signals (skills, interests, project goals) with engagement data to surface high-compatibility matches. No cold outreach required.'
  },
  { q: 'Is it for freelancers or co-founders?', a: 'Both. You can join as a co-founder, contributor, or freelancer and be matched to the right opportunities.' },
  { q: 'Is it really 100% free?', a: 'Yes. Matching and messaging are free. Optional premium tools are available for power users.' },
  { q: 'How do you verify real humans?', a: 'We use a combination of profile checks, activity signals, and periodic verifications to keep bots and fakes out.' },
  { q: 'Can I join an existing project?', a: 'Absolutely. Discover active projects by skill, industry, or role and request to join instantly.' },
];

const FooterSection: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="font-sans">
      {/* FAQ - white background */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-32">
          <h2 className="text-3xl font-semibold text-gray-900 mb-12">Frequently asked questions</h2>
          <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
            {faqs.map((item, i) => (
              <div key={i} className="">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left"
                >
                  <span className="text-gray-900">{item.q}</span>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${open === i ? 'rotate-180' : ''}`} />
                </button>
                {open === i && (
                  <div className="pb-5 -mt-2 text-gray-600">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA + Footer - soft gradient background */}
      <div className="bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
          {/* Final CTA */}
          <div className="mt-32">
            <h3 className="text-4xl font-medium text-gray-900">Your future co-founder is one swipe away.</h3>
            <p className="mt-4 text-xl text-gray-500">Stop building alone. Join thousands of verified professionals today.</p>
            <button className="mt-8 inline-flex items-center rounded-lg bg-gray-900 text-white px-8 py-3 shadow-lg hover:shadow-xl">
              Join CollabSwipe
            </button>
          </div>

          {/* Footer link grid */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-4">Explore</div>
              <ul className="space-y-3 text-sm">
                <li><a className="text-gray-500 hover:text-gray-900" href="#">Find Co-founders</a></li>
                <li><a className="text-gray-500 hover:text-gray-900" href="#">Join Projects</a></li>
                <li><a className="text-gray-500 hover:text-gray-900" href="#">Hire Talent</a></li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-4">Community</div>
              <ul className="space-y-3 text-sm">
                <li><a className="text-gray-500 hover:text-gray-900" href="#">Success Stories</a></li>
                <li><a className="text-gray-500 hover:text-gray-900" href="#">Events</a></li>
                <li><a className="text-gray-500 hover:text-gray-900" href="#">Manifesto</a></li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-4">Resources</div>
              <ul className="space-y-3 text-sm">
                <li><a className="text-gray-500 hover:text-gray-900" href="#">Blog</a></li>
                <li><a className="text-gray-500 hover:text-gray-900" href="#">Startup Guide</a></li>
                <li><a className="text-gray-500 hover:text-gray-900" href="#">Pitch Deck Templates</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom status bar */}
          <div className="mt-24 flex flex-col md:flex-row md:items-end md:justify-between gap-6 text-gray-500">
            <div className="inline-flex items-center gap-2 bg-gray-200/50 rounded-full px-3 py-1 w-fit">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-gray-700">All systems operational</span>
            </div>
            <div className="text-xs">© 2025 CollabSwipe. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-gray-900"><Twitter className="h-5 w-5" /></a>
              <a href="#" aria-label="Discord" className="text-gray-500 hover:text-gray-900"><MessageCircle className="h-5 w-5" /></a>
              <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-gray-900"><Instagram className="h-5 w-5" /></a>
              <a href="#" aria-label="Github" className="text-gray-500 hover:text-gray-900"><Github className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterSection;
