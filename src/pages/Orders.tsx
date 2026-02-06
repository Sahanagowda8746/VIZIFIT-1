import { motion } from 'framer-motion';
import { Package, Sparkles, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';

const Orders = () => {
  const { orders, aiDesigns, user } = useAuth();

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center py-12">
        <div className="text-center">
          <Package className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Please log in</h1>
          <p className="text-muted-foreground mb-6">Sign in to view your orders and designs</p>
          <Link to="/auth">
            <Button variant="gradient">Login / Sign Up</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold">My Orders</h1>
          <p className="text-muted-foreground mt-2">Track your purchases and AI designs</p>
        </motion.div>

        <Tabs defaultValue="orders" className="max-w-4xl">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="designs" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Designs ({aiDesigns.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl shadow-card">
                <Package className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
                <Link to="/shop">
                  <Button variant="gradient">Browse Shop</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-2xl shadow-card p-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold">${order.total.toFixed(2)}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {order.items.map((item) => (
                        <div
                          key={item.product.id}
                          className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0 relative"
                        >
                          <img
                            src={item.customDesign?.image || item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                          {item.customDesign && (
                            <div className="absolute top-1 left-1 p-1 rounded-full gradient-primary">
                              <Sparkles className="w-2 h-2 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="designs">
            {aiDesigns.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl shadow-card">
                <Sparkles className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No AI designs yet</h2>
                <p className="text-muted-foreground mb-4">Create your first AI-powered design</p>
                <Link to="/ai-studio">
                  <Button variant="gradient">Open AI Studio</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {aiDesigns.map((design, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card rounded-xl overflow-hidden shadow-card"
                  >
                    <div className="aspect-square bg-secondary relative">
                      <img
                        src={design.image}
                        alt={design.prompt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-1 rounded-full gradient-primary text-primary-foreground text-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium line-clamp-2">{design.prompt}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(design.date).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Orders;
