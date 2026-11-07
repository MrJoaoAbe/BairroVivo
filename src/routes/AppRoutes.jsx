import { createBrowserRouter } from 'react-router'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import NewBairro from '../pages/NewBairro'
import AddOcorrencia from '../pages/AddOcorrencia'
import ErrorPage from '../pages/ErrorPage'
import Map from '../pages/Map'
import AtualizarUsuario from '../pages/AtualizarUsuario'
import InfoUsuario from '../pages/InfoUsuario'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'entrar', element: <SignIn /> },
      { path: 'cadastro', element: <SignUp /> },
      { path: 'bairros/novo', element: <NewBairro /> },
      { path: 'ocorrencias/nova', element: <AddOcorrencia /> },
      { path: 'mapa/Bairro', element: <Map /> },
      { path: 'info/usuario', element: <InfoUsuario /> },
      { path: 'update/usuario', element: <AtualizarUsuario /> },
    ],
  },
])
