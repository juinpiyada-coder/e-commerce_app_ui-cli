import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, X, Plus, Minus, CreditCard, Receipt, Download, Moon, Sun, Menu, ChevronRight } from 'lucide-react'
import jsPDF from 'jspdf'
import ProductDetail from './ProductDetail'

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Laptop Backpack",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop"
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop"
  },
  {
    id: 5,
    name: "Wireless Mouse",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop"
  },
  {
    id: 6,
    name: "USB-C Hub",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1625723044792-44de16ccb4e8?w=300&h=300&fit=crop"
  },
  {
    id: 7,
    name: "Phone Stand",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=300&h=300&fit=crop"
  },
  {
    id: 8,
    name: "Keyboard",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=300&h=300&fit=crop"
  }
]

function App() {
  const [cart, setCart] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [orderDetails, setOrderDetails] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    email: '',
    address: ''
  })

  useEffect(() => {
    // Check for saved preference or system preference
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode !== null) {
      setIsDarkMode(savedMode === 'true')
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(prefersDark)
    }
  }, [])

  useEffect(() => {
    // Apply dark mode to document and save preference
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  const handleProceedToPayment = () => {
    if (cart.length === 0) return
    setShowPaymentForm(true)
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      const orderId = 'ORD-' + Date.now()
      const paymentId = 'PAY-' + Math.random().toString(36).substr(2, 9).toUpperCase()

      setOrderDetails({
        orderId,
        paymentId,
        date: new Date().toLocaleString(),
        items: [...cart],
        total: cartTotal,
        customer: {
          email: paymentForm.email,
          address: paymentForm.address,
          cardName: paymentForm.cardName
        }
      })

      setCart([])
      setShowPaymentForm(false)
      setShowReceipt(true)
      setIsProcessing(false)
    }, 2000)
  }

  const handleDownloadReceipt = () => {
    if (!orderDetails) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let y = margin

    // Header
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('E-COMMERCE SHOP', pageWidth / 2, y, { align: 'center' })
    y += 10

    doc.setFontSize(16)
    doc.setFont('helvetica', 'normal')
    doc.text('PAYMENT RECEIPT', pageWidth / 2, y, { align: 'center' })
    y += 15

    // Divider
    doc.setDrawColor(200)
    doc.line(margin, y, pageWidth - margin, y)
    y += 10

    // Order Details
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Order Information', margin, y)
    y += 8

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Order ID: ${orderDetails.orderId}`, margin, y)
    y += 6
    doc.text(`Payment ID: ${orderDetails.paymentId}`, margin, y)
    y += 6
    doc.text(`Date: ${orderDetails.date}`, margin, y)
    y += 12

    // Customer Details
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Customer Details', margin, y)
    y += 8

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Name: ${orderDetails.customer.cardName}`, margin, y)
    y += 6
    doc.text(`Email: ${orderDetails.customer.email}`, margin, y)
    y += 6
    doc.text(`Address: ${orderDetails.customer.address}`, margin, y)
    y += 12

    // Items
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Items Purchased', margin, y)
    y += 8

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    orderDetails.items.forEach((item) => {
      const itemText = `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
      doc.text(itemText, margin, y)
      y += 6
    })
    y += 8

    // Divider
    doc.setDrawColor(200)
    doc.line(margin, y, pageWidth - margin, y)
    y += 10

    // Total
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text(`Total Amount: $${orderDetails.total.toFixed(2)}`, margin, y)
    y += 15

    // Thank you message
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
    doc.text('Thank you for your purchase!', pageWidth / 2, y, { align: 'center' })

    // Save PDF
    doc.save(`receipt-${orderDetails.orderId}.pdf`)
  }

  const handleNewOrder = () => {
    setShowReceipt(false)
    setOrderDetails(null)
    setPaymentForm({
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      email: '',
      address: ''
    })
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col transition-colors duration-200">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Toggle menu"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Shop</h1>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <button
                    onClick={() => setIsCartOpen(!isCartOpen)}
                    className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative"
                    aria-label="Toggle cart"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Toggle dark mode"
                  >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <span className="hidden lg:inline text-sm text-gray-600 dark:text-gray-300">
                    {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in cart
                  </span>
                </div>
              </div>
              
              {/* Mobile Menu */}
              {isMobileMenuOpen && (
                <div className="lg:hidden border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="px-4 py-3 space-y-2">
                    <Link
                      to="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2 rounded-lg text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Home
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        setIsCartOpen(true)
                      }}
                      className="w-full text-left px-4 py-2 rounded-lg text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cart ({cartItemCount})
                    </button>
                  </div>
                </div>
              )}
            </header>

            <div className="flex flex-1 max-w-7xl mx-auto w-full relative">
              {/* Product Grid */}
              <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{product.name}</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
                          <div className="flex gap-2">
                            <Link
                              to={`/product/${product.id}`}
                              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                            >
                              View Details
                            </Link>
                            <button
                              onClick={() => addToCart(product)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </main>

              {/* Cart Sidebar - Responsive */}
              <aside className={`fixed lg:static inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 shadow-lg border-l dark:border-gray-700 transform transition-transform duration-300 ease-in-out z-40 ${isCartOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Shopping Cart
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full">
                        {cartItemCount} items
                      </span>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        aria-label="Close cart"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        <ShoppingCart className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
                        <p className="text-center">Your cart is empty</p>
                        <p className="text-sm text-center mt-2">Add items to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-800 dark:text-white text-sm truncate">{item.name}</h3>
                              <p className="text-gray-600 dark:text-gray-300 text-sm">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-medium text-sm dark:text-white">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-gray-800 dark:text-white">Total:</span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">${cartTotal.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={handleProceedToPayment}
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-5 h-5" />
                        Proceed to Payment
                      </button>
                    </div>
                  )}
                </div>
              </aside>
              
              {/* Mobile Cart Backdrop */}
              {isCartOpen && (
                <div
                  onClick={() => setIsCartOpen(false)}
                  className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Payment Form Modal */}
            {showPaymentForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Payment Details</h2>
                    <button
                      onClick={() => setShowPaymentForm(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                      <input
                        type="text"
                        required
                        placeholder="1234 5678 9012 3456"
                        value={paymentForm.cardNumber}
                        onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        maxLength="19"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={paymentForm.cardName}
                        onChange={(e) => setPaymentForm({...paymentForm, cardName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={paymentForm.expiryDate}
                          onChange={(e) => setPaymentForm({...paymentForm, expiryDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          maxLength="5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV</label>
                        <input
                          type="text"
                          required
                          placeholder="123"
                          value={paymentForm.cvv}
                          onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          maxLength="3"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={paymentForm.email}
                        onChange={(e) => setPaymentForm({...paymentForm, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery Address</label>
                      <textarea
                        required
                        placeholder="Enter your delivery address"
                        value={paymentForm.address}
                        onChange={(e) => setPaymentForm({...paymentForm, address: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        rows="3"
                      />
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-800 dark:text-white">Total Amount:</span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">${cartTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <CreditCard className="w-5 h-5" />
                      {isProcessing ? 'Processing Payment...' : `Pay $${cartTotal.toFixed(2)}`}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Receipt Modal */}
            {showReceipt && orderDetails && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                      <Receipt className="w-6 h-6" />
                      Payment Receipt
                    </h2>
                    <button
                      onClick={handleNewOrder}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                      <p className="text-green-800 dark:text-green-300 font-semibold text-center">Payment Successful!</p>
                    </div>

                    <div className="space-y-4">
                      <div className="border-b dark:border-gray-700 pb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Order ID</p>
                        <p className="font-semibold text-gray-800 dark:text-white">{orderDetails.orderId}</p>
                      </div>

                      <div className="border-b dark:border-gray-700 pb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Payment ID</p>
                        <p className="font-semibold text-gray-800 dark:text-white">{orderDetails.paymentId}</p>
                      </div>

                      <div className="border-b dark:border-gray-700 pb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                        <p className="font-semibold text-gray-800 dark:text-white">{orderDetails.date}</p>
                      </div>

                      <div className="border-b dark:border-gray-700 pb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Customer Details</p>
                        <p className="font-semibold text-gray-800 dark:text-white">{orderDetails.customer.cardName}</p>
                        <p className="text-gray-600 dark:text-gray-300">{orderDetails.customer.email}</p>
                        <p className="text-gray-600 dark:text-gray-300">{orderDetails.customer.address}</p>
                      </div>

                      <div className="border-b dark:border-gray-700 pb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Items Purchased</p>
                        {orderDetails.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-gray-800 dark:text-white">
                            <span>{item.name} x{item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-800 dark:text-white">Total Paid</span>
                          <span className="text-2xl font-bold text-green-600 dark:text-green-400">${orderDetails.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <button
                        onClick={handleDownloadReceipt}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <Download className="w-5 h-5" />
                        Download Receipt
                      </button>
                      <button
                        onClick={handleNewOrder}
                        className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        } />
        <Route path="/product/:id" element={
          <ProductDetail 
            cart={cart} 
            setCart={setCart} 
            isDarkMode={isDarkMode} 
            toggleDarkMode={toggleDarkMode} 
          />
        } />
      </Routes>
    </Router>
  )
}

export default App
