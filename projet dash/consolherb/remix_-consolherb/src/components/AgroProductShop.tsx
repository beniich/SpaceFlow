import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Check, 
  Tag, 
  Search, 
  Sparkles, 
  Store,
  Printer,
  ChevronRight
} from 'lucide-react';

interface HerbProduct {
  id: string;
  name: string;
  scientificName: string;
  category: 'Organic Herbs' | 'Essential Oils' | 'Seedlings' | 'Extracts';
  priceCoins: number;
  image: string;
  stock: number;
  spec: string;
}

interface CartItem {
  product: HerbProduct;
  quantity: number;
}

interface AgroProductShopProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

export default function AgroProductShop({ onAddLog }: AgroProductShopProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userCoins, setUserCoins] = useState(12450); // AgroCoins
  const [discountCode, setDiscountCode] = useState('');
  const [activeDiscount, setActiveDiscount] = useState<number>(0); // percentage
  const [checkoutStep, setCheckoutStep] = useState<'shopping' | 'invoice'>('shopping');
  const [latestInvoice, setLatestInvoice] = useState<any | null>(null);

  // Products aligned with Premium Botanicals / Herbal Farm style
  const products: HerbProduct[] = [
    {
      id: 'p1',
      name: 'Organic Sweet Basil',
      scientificName: 'Ocimum basilicum',
      category: 'Organic Herbs',
      priceCoins: 350,
      image: '🌿',
      stock: 45,
      spec: '98.5% Purity Grade A'
    },
    {
      id: 'p2',
      name: 'Peppermint Seedlings',
      scientificName: 'Mentha piperita',
      category: 'Seedlings',
      priceCoins: 210,
      image: '🌱',
      stock: 62,
      spec: 'Root-bound hydro plugs'
    },
    {
      id: 'p3',
      name: 'Pure Lavender Extract Oil',
      scientificName: 'Lavandula angustifolia',
      category: 'Essential Oils',
      priceCoins: 1200,
      image: '🧪',
      stock: 15,
      spec: '100% steam-distilled pure extract'
    },
    {
      id: 'p4',
      name: 'Gold Matricaria Chamomile',
      scientificName: 'Matricaria chamomilla',
      category: 'Organic Herbs',
      priceCoins: 480,
      image: '🌼',
      stock: 28,
      spec: 'Sun-dried floral heads'
    },
    {
      id: 'p5',
      name: 'Rosemary Stem Plug-ins',
      scientificName: 'Salvia rosmarinus',
      category: 'Seedlings',
      priceCoins: 260,
      image: '🌲',
      stock: 35,
      spec: 'Mycorrhizae reinforced'
    },
    {
      id: 'p6',
      name: 'Eucalyptus Concentrated Drops',
      scientificName: 'Eucalyptus globulus',
      category: 'Essential Oils',
      priceCoins: 950,
      image: '💧',
      stock: 18,
      spec: 'Supercritical CO₂ extraction'
    },
  ];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAddToCart = (product: HerbProduct) => {
    if (product.stock <= 0) {
      onAddLog('error', `SHOP: "${product.name}" est en rupture de stock !`);
      return;
    }
    
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          onAddLog('warn', `SHOP: Limite de stock atteinte pour "${product.name}".`);
          return prev;
        }
        onAddLog('success', `SHOP: Quantité augmentée pour "${product.name}" dans le panier.`);
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      onAddLog('success', `SHOP: "${product.name}" ajouté au panier avec succès.`);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.product.stock) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleApplyPromo = () => {
    const code = discountCode.trim().toUpperCase();
    if (code === 'HERBOAGRO') {
      setActiveDiscount(15);
      onAddLog('success', 'SHOP: Code PROMO "HERBOAGRO" appliqué ! Remise de 15% validée.');
    } else if (code === 'HERBOFARME') {
      setActiveDiscount(25);
      onAddLog('success', 'SHOP: Code PROMO "HERBOFARME" appliqué ! Remise de 25% validée.');
    } else {
      onAddLog('error', 'SHOP: Code PROMO invalide ou expiré.');
    }
  };

  const getSubtotal = () => cart.reduce((sum, item) => sum + (item.product.priceCoins * item.quantity), 0);
  const getDiscountAmount = () => Math.round(getSubtotal() * (activeDiscount / 100));
  const getTotal = () => Math.max(0, getSubtotal() - getDiscountAmount());

  const handleCheckout = () => {
    const totalCost = getTotal();
    if (cart.length === 0) {
      onAddLog('error', 'SHOP: Votre panier est vide.');
      return;
    }
    if (userCoins < totalCost) {
      onAddLog('error', `SHOP: Solde insuffisant ! Requis: ${totalCost} 🪙, Disponible: ${userCoins} 🪙`);
      return;
    }

    // Deduct coins & simulate success
    setUserCoins(prev => prev - totalCost);
    const invoiceNumber = 'INV-' + Math.floor(Math.random() * 90000 + 10000);
    const mockInvoice = {
      id: invoiceNumber,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
      items: [...cart],
      subtotal: getSubtotal(),
      discount: getDiscountAmount(),
      discountRate: activeDiscount,
      total: totalCost,
      status: 'Paid'
    };

    setLatestInvoice(mockInvoice);
    setCheckoutStep('invoice');
    setCart([]);
    onAddLog('success', `SHOP: Paiement de ${totalCost} 🪙 approuvé ! Facture ${invoiceNumber} générée.`);
  };

  return (
    <div className="bg-[#FAF9F5] text-stone-800 p-6 rounded-[28px] border border-[#e1d5c1] font-sans shadow-md" id="agro-product-shop">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e1d5c1] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#4A5D4E] to-[#1D291F] rounded-xl flex items-center justify-center text-white text-lg font-bold">
            <Store className="w-5 h-5 text-[#FAF9F5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold text-[#1a3a22]">AgroMaître Herb & Seedlings Store</span>
              <span className="text-[9px] bg-emerald-50 text-[#1a3a22] border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-tight">Active Store</span>
            </div>
            <p className="text-xs text-stone-500 font-mono uppercase">Premium Botanicals, Organic Extracted Powders & Plugs</p>
          </div>
        </div>

        {/* Coins Counter */}
        <div className="bg-[#EFF2EE] border border-[#d1dec9] px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xs">
          <span className="text-base">🪙</span>
          <div className="text-left">
            <div className="text-[9px] font-mono text-stone-500 uppercase leading-none">Your Balances</div>
            <div className="text-sm font-bold text-[#1a3a22] font-mono">{userCoins.toLocaleString()} AgroCoins</div>
          </div>
        </div>
      </header>

      {checkoutStep === 'invoice' && latestInvoice ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-2 border-dashed border-[#1a3a22]/30 p-8 rounded-[24px] max-w-xl mx-auto my-6 shadow-sm"
        >
          <div className="text-center mb-6">
            <span className="text-4xl">🛒</span>
            <h2 className="text-xl font-serif font-bold text-[#1a3a22] mt-2">AgroMaître (Herboferme) Invoice</h2>
            <p className="text-xs text-stone-400 font-mono">Invoice Ref: {latestInvoice.id} • {latestInvoice.date}</p>
          </div>

          <div className="border-t border-b border-stone-100 py-4 my-4 space-y-2">
            {latestInvoice.items.map((cartItem: CartItem) => (
              <div key={cartItem.product.id} className="flex justify-between items-center text-xs font-mono">
                <div>
                  <span className="font-bold text-stone-800">{cartItem.product.name}</span>
                  <span className="text-stone-400 ml-1">x{cartItem.quantity}</span>
                </div>
                <span className="text-[#1a3a22] font-bold">{(cartItem.product.priceCoins * cartItem.quantity).toLocaleString()} 🪙</span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 text-xs text-stone-600 font-mono pt-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{latestInvoice.subtotal.toLocaleString()} 🪙</span>
            </div>
            {latestInvoice.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount ({latestInvoice.discountRate}%):</span>
                <span>-{latestInvoice.discount.toLocaleString()} 🪙</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-[#1a3a22] border-t border-stone-200 pt-3">
              <span>Paid Total:</span>
              <span>{latestInvoice.total.toLocaleString()} AgroCoins</span>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => {
                setCheckoutStep('shopping');
                onAddLog('info', 'SHOP: Retour à la boutique de graines & herbes.');
              }}
              className="flex-1 py-3 bg-[#1a3a22] hover:bg-[#2e5238] text-white rounded-xl text-xs font-mono font-bold uppercase transition active:scale-95 cursor-pointer"
            >
              Order More Items
            </button>
            <button
              onClick={() => {
                window.print();
                onAddLog('success', 'SHOP: Impression de la facture envoyée à l\'imprimante.');
              }}
              className="px-4 py-3 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-xl text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Shop Products Grid */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Nav Subbar Search & Filter bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#FAF9F5] border border-[#e1d5c1]/60 p-3 rounded-2xl">
              <div className="relative w-full sm:w-64">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search botanical plugs & extract..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#e1d5c1] text-xs py-2 pl-9 pr-4 rounded-xl outline-none focus:ring-1 focus:ring-[#1a3a22] focus:border-[#1a3a22]"
                />
              </div>

              {/* Categorization tabs */}
              <div className="flex flex-wrap gap-1">
                {['All', 'Organic Herbs', 'Essential Oils', 'Seedlings'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[10px] font-mono px-3 py-1.5 rounded-xl border transition active:scale-95 cursor-pointer ${
                      selectedCategory === cat 
                        ? 'bg-[#1a3a22] text-white border-[#1a3a22]' 
                        : 'bg-white border-[#e1d5c1] text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List Cards Grid with Image representation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map(p => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white border border-[#e1d5c1] hover:border-[#1a3a22] rounded-[24px] p-4 flex gap-4 transition-all duration-300 shadow-xs relative overflow-hidden group"
                  >
                    {/* Floating Stock Indicator */}
                    <span className="absolute top-2.5 right-2.5 text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-stone-50 border border-stone-200 text-stone-500 font-semibold uppercase">
                      Stock: {p.stock}
                    </span>

                    {/* Emoji Illustration */}
                    <div className="w-16 h-16 bg-[#F6F8F5] border border-[#d1dec9] rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform duration-300">
                      {p.image}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[9px] font-mono text-emerald-700 uppercase tracking-wide mb-0.5">{p.category}</div>
                        <h4 className="text-xs font-serif font-bold text-stone-900 leading-tight">{p.name}</h4>
                        <div className="text-[10px] text-stone-400 italic mb-1">{p.scientificName}</div>
                        <div className="text-[9px] text-stone-400 font-mono truncate">{p.spec}</div>
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-stone-50">
                        <span className="text-xs font-mono font-bold text-[#1a3a22]">{p.priceCoins.toLocaleString()} 🪙</span>
                        <button
                          onClick={() => handleAddToCart(p)}
                          className="px-3 py-1.5 bg-[#FAF9F5] hover:bg-[#1a3a22] border border-[#1a3a22]/30 hover:border-[#1a3a22] text-[#1a3a22] hover:text-white rounded-xl text-[10px] font-mono font-bold uppercase transition active:scale-95 cursor-pointer inline-flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Buy Plug</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>

          {/* Shopping Cart Drawer sidebar */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-white border border-[#e1d5c1] rounded-[24px] p-5 shadow-xs sticky top-4">
              <h3 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider mb-4 flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="flex items-center gap-1.5">
                  <ShoppingCart className="w-4 h-4 text-[#1a3a22]" /> Your Cart
                </span>
                <span className="bg-[#1a3a22] text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono shrink-0">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)} Plugs
                </span>
              </h3>

              {cart.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-xs italic">
                  Your agricultural cart is empty.<br />Add seed plugs and organic essential extracts.
                </div>
              ) : (
                <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex gap-3 justify-between items-center border-b border-stone-50 pb-3">
                      <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-xl shrink-0">{item.product.image}</div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-[11px] font-bold text-stone-800 leading-tight truncate">{item.product.name}</h4>
                        <div className="text-[10px] text-stone-400 font-mono">{item.product.priceCoins} 🪙</div>
                      </div>

                      {/* Quantity counters */}
                      <div className="flex items-center gap-1 border border-stone-200 rounded-lg p-0.5 scale-90 shrink-0 select-none">
                        <button
                          onClick={() => handleUpdateQty(item.product.id, -1)}
                          className="w-5 h-5 flex items-center justify-center bg-stone-50 hover:bg-stone-100 rounded text-stone-600 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs text-stone-800 w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQty(item.product.id, 1)}
                          className="w-5 h-5 flex items-center justify-center bg-stone-50 hover:bg-stone-100 rounded text-stone-600 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Trash action */}
                      <button
                        onClick={() => {
                          setCart(prev => prev.filter(i => i.product.id !== item.product.id));
                          onAddLog('warn', `SHOP: "${item.product.name}" retiré de votre panier.`);
                        }}
                        className="text-stone-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 scale-90 transition shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Promo code entry */}
              <div className="mt-6 pt-4 border-t border-stone-100 space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-stone-400">
                      <Tag className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      placeholder="PROMO CODE"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-stone-200 text-[10px] py-2 pl-8 pr-2 rounded-xl outline-none focus:border-[#1a3a22] font-mono"
                    />
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    className="px-3 bg-[#FAF9F5] hover:bg-stone-100 border border-stone-200 text-stone-600 rounded-xl text-[10px] font-mono font-bold uppercase transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                <div className="text-[8px] text-stone-400 font-mono tracking-tight text-center">
                  Try "HERBOAGRO" (15% off) or "HERBOFARME" (25% off)
                </div>
              </div>

              {/* Shopping summary pricing */}
              <div className="mt-6 pt-4 border-t border-stone-100 space-y-1.5 text-xs text-stone-600 font-mono">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{getSubtotal().toLocaleString()} 🪙</span>
                </div>
                {activeDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount:</span>
                    <span>-{getDiscountAmount().toLocaleString()} 🪙</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-stone-800 border-t border-stone-100 pt-3">
                  <span>Order Total:</span>
                  <span>{getTotal().toLocaleString()} 🪙</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className={`w-full mt-6 py-3.5 text-white text-xs font-mono font-bold uppercase tracking-wide rounded-xl shadow-xs transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  cart.length === 0 
                    ? 'bg-stone-200 border border-stone-300 text-stone-400 cursor-not-allowed' 
                    : 'bg-[#1a3a22] hover:bg-[#2e5238] border border-[#1a3a22]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Confirm Purchase</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
