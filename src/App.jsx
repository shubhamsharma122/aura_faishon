import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { InlinePageLoader } from './components/ui/Async'
import { CartProvider, SettingsProvider } from './context/AppContext'
import { ConfirmProvider } from './components/ui/ConfirmDialog'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'

/* Route-level code splitting. Each page chunk is fetched only when needed. */
const Home = lazy(() => import('./pages/Home'))
const Shop = lazy(() => import('./pages/Shop'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Customize = lazy(() => import('./pages/Customize'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderConfirmed = lazy(() => import('./pages/OrderConfirmed'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const Admin = lazy(() => import('./pages/Admin'))
const About = lazy(() => import('./pages/About'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <SettingsProvider>
          <CartProvider>
            <ConfirmProvider>
              <Suspense fallback={<InlinePageLoader />}>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:slug" element={<ProductDetail />} />
                    <Route path="/customize" element={<Customize />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order/:no" element={<OrderConfirmed />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<Admin />} />
                  </Route>
                </Routes>
              </Suspense>
            </ConfirmProvider>
          </CartProvider>
        </SettingsProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
