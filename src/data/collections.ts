export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  productCategories: string[];
}

export const collections: Collection[] = [
  {
    id: 'mens',
    name: "Men's Collection",
    description: 'Discover our curated selection of premium menswear, from casual essentials to statement pieces.',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format',
    category: 'gender',
    productCategories: ['hoodie', 'tshirt', 'jacket', 'pants'],
  },
  {
    id: 'womens',
    name: "Women's Collection",
    description: 'Elegant and contemporary designs crafted for the modern woman.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format',
    category: 'gender',
    productCategories: ['dress', 'tshirt', 'jacket'],
  },
  {
    id: 'trending',
    name: 'Trending Now',
    description: "This season's hottest styles that everyone is talking about.",
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&auto=format',
    category: 'featured',
    productCategories: ['hoodie', 'jacket'],
  },
  {
    id: 'new-arrivals',
    name: 'New Arrivals',
    description: 'Fresh drops and latest additions to our exclusive catalog.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format',
    category: 'featured',
    productCategories: ['tshirt', 'dress'],
  },
  {
    id: 'sportswear',
    name: 'Sports & Gym Wear',
    description: 'Performance-driven apparel for your active lifestyle.',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format',
    category: 'lifestyle',
    productCategories: ['tshirt', 'pants'],
  },
  {
    id: 'premium',
    name: 'Premium Collection',
    description: 'Luxury pieces crafted from the finest materials for discerning tastes.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format',
    category: 'featured',
    productCategories: ['jacket', 'dress'],
  },
  {
    id: 'casual',
    name: 'Casual Wear',
    description: 'Effortless everyday style that combines comfort with sophistication.',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format',
    category: 'lifestyle',
    productCategories: ['tshirt', 'hoodie', 'pants'],
  },
  {
    id: 'formal',
    name: 'Formal Wear',
    description: 'Sharp and refined pieces for professional settings and special occasions.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format',
    category: 'lifestyle',
    productCategories: ['jacket', 'pants'],
  },
];
