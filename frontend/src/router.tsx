/**
 * Configuration du routeur — EventHub
 *
 * Utilise React Router v7 avec layout hydrate de Header.
 * UserProvider est包裹 au niveau du layout pour que toutes les
 * pages puissent accedre au context utilisateur.
 */

import { createBrowserRouter, Navigate, Outlet } from 'react-router'
import { UserProvider } from './context/UserContext'
import Header from './components/Header'
import EventListPage from './pages/EventListPage'
import EventDetailPage from './pages/EventDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MyTicketsPage from './pages/MyTicketsPage'

function AppLayout() {
  return (
    <UserProvider>
      <HeaderWithAuth />
    </UserProvider>
  )
}

function HeaderWithAuth() {
  // Header reads token from localStorage directly
  // to avoid context complexity in layout components
  return (
    <>
      <Header />
      <Outlet />
    </>
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