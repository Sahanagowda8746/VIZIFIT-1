import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Collection } from '@/data/collections';

interface CollectionCardProps {
  collection: Collection;
  index?: number;
}

const CollectionCard = ({ collection, index = 0 }: CollectionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl bg-card shadow-soft hover:shadow-glow transition-all duration-500"
    >
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={collection.image}
          alt={collection.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-xl md:text-2xl font-bold mb-2">{collection.name}</h3>
        <p className="text-sm text-white/80 mb-4 line-clamp-2">{collection.description}</p>
        <Link to={`/collections/${collection.id}`}>
          <Button 
            variant="outline" 
            className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            Explore Collection
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default CollectionCard;
