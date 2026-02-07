import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import FeaturedCollections from '@/components/FeaturedCollections';
import { motion } from 'framer-motion';
import { Sparkles, Palette, Truck, Shield } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Design',
    description: 'Describe your vision in words, and watch AI create stunning designs instantly.',
  },
  {
    icon: Palette,
    title: 'Unlimited Creativity',
    description: 'From minimalist to maximalist, cyberpunk to vintage — any style you can imagine.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Your custom designs printed and shipped within 3-5 business days.',
  },
  {
    icon: Shield,
    title: 'Quality Guarantee',
    description: 'Premium materials and printing techniques for designs that last.',
  },
];

const Index = () => {
  return (
    <main>
      <Hero />
      <FeaturedCollections />
      <FeaturedProducts />

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm uppercase tracking-wider text-primary font-medium"
            >
              Why VIZIFIT
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mt-2"
            >
              Fashion Meets Innovation
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 gradient-dark">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6"
          >
            Ready to Create Something
            <br />
            <span className="text-gradient-hero">Extraordinary?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-primary-foreground/70 mb-8 max-w-xl mx-auto"
          >
            Join thousands of fashion enthusiasts who have already discovered the future of custom clothing.
          </motion.p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-2xl font-bold text-gradient">VIZIFIT</span>
            <p className="text-sm text-muted-foreground">
              © 2024 VIZIFIT. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
