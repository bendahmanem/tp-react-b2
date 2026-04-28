/**
 * Configuration du routeur — EventHub
 *
 * Layout avec Header + contenu + Footer sur toutes les pages.
 */

import { createBrowserRouter, Navigate, Outlet } from 'react-router'
import { UserProvider } from './context/UserContext'
import Header from './components/Header'
import Footer from './components/Footer'
import EventListPage from './pages/EventListPage'
import EventDetailPage from './pages/EventDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MyTicketsPage from './pages/MyTicketsPage'

function AppLayout() {
  return (
    <UserProvider>
      <div className="app-layout">
        <Header />
        <main className="main-content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </UserProvider>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <EventListPage /> },
      { path: 'events/:id', element: <EventDetailPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'my-tickets', element: <MyTicketsPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])