import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AIDesignPreview from '@/components/AIDesignPreview';
import { products } from '@/data/products';
import { Product, DesignComplexity, DESIGN_FEES } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const examplePrompts = [
  "Red oversized hoodie with white flames and cyberpunk style",
  "Minimalist Japanese wave pattern in navy blue",
  "Retro 80s sunset with palm trees and neon colors",
  "Abstract geometric shapes in pastel colors",
  "Vintage botanical flower illustration",
];

const AIStudio = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product');
  const { addAIDesign } = useAuth();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [prompt, setPrompt] = useState('');
  const [complexity, setComplexity] = useState<DesignComplexity>('simple');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product) setSelectedProduct(product);
    }
  }, [productId]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe your design first');
      return;
    }

    if (!selectedProduct) {
      toast.error('Please select a product to customize');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation with a placeholder image
    // In a real app, this would call the AI image generation API
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Using a placeholder that represents a "generated" design
    const placeholderImages = [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format',
    ];

    const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    setGeneratedImage(randomImage);
    addAIDesign(prompt, randomImage);
    setIsGenerating(false);
    toast.success('Design generated successfully!');
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <main className="min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold"
          >
            AI Design Studio
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mt-3 max-w-lg mx-auto"
          >
            Describe your dream outfit and watch AI bring it to life on premium clothing
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Design Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Product Selection */}
            <div className="space-y-2">
              <Label>Select Product</Label>
              <Select
                value={selectedProduct?.id || ''}
                onValueChange={(value) => {
                  const product = products.find((p) => p.id === value);
                  setSelectedProduct(product || null);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a product to customize" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - ${product.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Design Prompt */}
            <div className="space-y-2">
              <Label>Describe your outfit</Label>
              <Textarea
                placeholder="Example: Red oversized hoodie with white flames and cyberpunk style"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Example Prompts */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Try these examples:</Label>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example) => (
                  <button
                    key={example}
                    onClick={() => handleExampleClick(example)}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
                  >
                    {example.slice(0, 30)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Design Complexity */}
            <div className="space-y-3">
              <Label>Design Complexity</Label>
              <RadioGroup
                value={complexity}
                onValueChange={(value) => setComplexity(value as DesignComplexity)}
                className="grid grid-cols-3 gap-3"
              >
                {(['simple', 'detailed', 'complex'] as const).map((level) => (
                  <div key={level}>
                    <RadioGroupItem
                      value={level}
                      id={level}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={level}
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-colors"
                    >
                      <span className="capitalize font-medium">{level}</span>
                      <span className="text-primary font-bold">+${DESIGN_FEES[level]}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Complexity Info */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50 text-sm">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  {complexity === 'simple' && 'Basic patterns and minimal details'}
                  {complexity === 'detailed' && 'Intricate patterns with multiple elements'}
                  {complexity === 'complex' && 'Full artwork with textures, gradients, and effects'}
                </p>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              variant="hero"
              size="xl"
              className="w-full"
              onClick={handleGenerate}
              disabled={isGenerating || !selectedProduct || !prompt.trim()}
            >
              <Wand2 className="w-5 h-5 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Outfit with AI'}
            </Button>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <AIDesignPreview
              baseProduct={selectedProduct}
              designImage={generatedImage}
              prompt={prompt}
              complexity={complexity}
              isGenerating={isGenerating}
            />
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default AIStudio;
