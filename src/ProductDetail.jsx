import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Plus, Minus, ZoomIn, ZoomOut, ArrowLeft, CreditCard } from 'lucide-react'

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio quality. Perfect for music lovers and professionals alike.",
    specifications: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Bluetooth 5.0 connectivity",
      "Foldable design",
      "Built-in microphone"
    ]
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
    description: "Advanced smartwatch with health monitoring, GPS tracking, and seamless smartphone integration. Track your fitness goals and stay connected on the go.",
    specifications: [
      "Heart rate monitor",
      "GPS tracking",
      "Water resistant (50m)",
      "7-day battery life",
      "AMOLED display"
    ]
  },
  {
    id: 3,
    name: "Laptop Backpack",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop",
    description: "Durable and spacious laptop backpack with multiple compartments, padded laptop sleeve, and ergonomic design. Perfect for daily commute and travel.",
    specifications: [
      "Fits up to 17-inch laptop",
      "Water-resistant material",
      "Multiple compartments",
      "USB charging port",
      "Ergonomic shoulder straps"
    ]
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop",
    description: "Portable Bluetooth speaker with powerful bass, 360-degree sound, and IPX7 water resistance. Take your music anywhere with this rugged speaker.",
    specifications: [
      "20W output power",
      "12-hour battery life",
      "IPX7 water resistant",
      "360-degree sound",
      "Built-in microphone"
    ]
  },
  {
    id: 5,
    name: "Wireless Mouse",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop",
    description: "Ergonomic wireless mouse with precision tracking, customizable buttons, and long-lasting battery. Designed for comfort and productivity.",
    specifications: [
      "16000 DPI sensor",
      "7 programmable buttons",
      "Ergonomic design",
      "70-hour battery life",
      "2.4GHz wireless"
    ]
  },
  {
    id: 6,
    name: "USB-C Hub",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1625723044792-44de16ccb4e8?w=800&h=800&fit=crop",
    description: "Multi-port USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery. Expand your laptop's connectivity with this versatile hub.",
    specifications: [
      "7-in-1 design",
      "4K HDMI output",
      "USB 3.0 ports",
      "SD/TF card reader",
      "100W power delivery"
    ]
  },
  {
    id: 7,
    name: "Phone Stand",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=800&h=800&fit=crop",
    description: "Adjustable phone stand with stable base and multiple viewing angles. Perfect for video calls, watching videos, or charging your phone.",
    specifications: [
      "Adjustable angles",
      "Non-slip base",
      "Fits all phone sizes",
      "Foldable design",
      "Aluminum alloy"
    ]
  },
  {
    id: 8,
    name: "Keyboard",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=800&h=800&fit=crop",
    description: "Mechanical gaming keyboard with RGB backlighting, programmable keys, and tactile switches. Enhance your gaming experience with precision and style.",
    specifications: [
      "Mechanical switches",
      "RGB backlighting",
      "Programmable keys",
      "N-key rollover",
      "Aluminum frame"
    ]
  }
]

function ProductDetail({ cart, setCart, isDarkMode, toggleDarkMode }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [zoom, setZoom] = useState(1)
  const [quantity, setQuantity] = useState(1)
  
  const product = products.find(p => p.id === parseInt(id))

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Product not found</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    )
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 1))
  }

  const handleResetZoom = () => {
    setZoom(1)
  }

  const addToCart = () => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prevCart, { ...product, quantity }]
    })
    navigate('/')
  }

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Product Details</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <span className="text-xl">☀️</span> : <span className="text-xl">🌙</span>}
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in cart
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
            <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-contain transition-transform duration-300 ease-in-out"
                style={{ transform: `scale(${zoom})` }}
              />
            </div>
            
            {/* Zoom Controls */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 1}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4">{product.name}</h1>
            <p className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mb-6">${product.price.toFixed(2)}</p>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Description</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Specifications</h2>
              <ul className="space-y-2">
                {product.specifications.map((spec, index) => (
                  <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></span>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Quantity</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-semibold text-gray-800 dark:text-white min-w-[50px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800 dark:text-white">Subtotal:</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">${(product.price * quantity).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={addToCart}
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 text-lg"
            >
              <ShoppingCart className="w-6 h-6" />
              Add to Cart
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full mt-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProductDetail
