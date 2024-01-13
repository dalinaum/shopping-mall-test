import GlobalLayout from "./pages/_layout"
import Index from './pages/index'
import ProductIndex from './pages/products/index'
import ProductsId from './pages/products/[id]'
import CartIndex from './pages/cart/index'
import PaymentIndex from "./pages/payment/index"

export const routes = [
    {
        path: '/',
        element: <GlobalLayout />,
        children: [
            { path: '/', element: <Index />, index: true },
            { path: '/products', element: <ProductIndex />, index: true },
            { path: '/products/:id', element: <ProductsId /> },
            { path: '/cart', element: <CartIndex />, index: true },
            { path: '/payment', element: <PaymentIndex />, index: true },
        ],
    }
]

export const pages = [
    { route: '/' },
    { route: '/products' },
    { route: '/products/:id' },
    { route: '/cart' },
    { route: '/payment' },
]