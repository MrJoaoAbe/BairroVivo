import { NavLink, Outlet } from 'react-router'
import { useState, useEffect } from 'react'
import { buscar } from '../services/api'

const linkClass = ({ isActive }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium transition ${isActive
    ? 'bg-emerald-100 text-emerald-800'
    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
  }`

export default function MainLayout() {

  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [menuAberto, setMenuAberto] = useState(false)

  const idUsuario = localStorage.getItem('idUsuario')

  const [usuarioLogado, setUsuarioLogado] = useState(
    !!localStorage.getItem("idUsuario")
  );

  useEffect(() => {
    function atualizarNavbar() {
      setUsuarioLogado(!!localStorage.getItem("idUsuario"));
    }

    window.addEventListener("usuarioAtualizado", atualizarNavbar);

    return () => {
      window.removeEventListener("usuarioAtualizado", atualizarNavbar);
    };
  }, []);

  useEffect(() => {
    async function carregarUsuario() {

      if (!idUsuario) {
        setCarregando(false)
        return
      }

      try {
        const dados = await buscar(`/usuario/${idUsuario}`)
        setUsuario(dados)

      } catch (error) {
        console.error("Erro ao buscar usuário:", error)

      } finally {
        setCarregando(false)
      }
    }

    carregarUsuario()
  }, [idUsuario])

  // Fecha o menu ao selecionar uma opção
  function fecharMenu() {
    setMenuAberto(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <NavLink
            to="/"
            onClick={fecharMenu}
            className="text-xl font-extrabold tracking-tight text-emerald-700"
          >
            BairroVivo
          </NavLink>

          {/* Menu para computadores */}
          <nav
            className="hidden items-center gap-2 md:flex"
            aria-label="Navegação principal"
          >
            <NavLink to="/" end className={linkClass}>
              Início
            </NavLink>

            <NavLink to="/mapa/Bairro" className={linkClass}>
              Mapa
            </NavLink>

            <NavLink to="/ocorrencias/nova" className={linkClass}>
              Nova ocorrência
            </NavLink>

            {!idUsuario ? (
              <>
                <NavLink to="/entrar" className={linkClass}>
                  Entrar
                </NavLink>

                <NavLink to="/cadastro" className={linkClass}>
                  Cadastrar
                </NavLink>
              </>
            ) : (
              <NavLink to="/info/usuario" className={linkClass}>
                {carregando
                  ? 'Carregando...'
                  : usuario
                    ? usuario.nome
                    : 'Minha conta'}
              </NavLink>
            )}
          </nav>

          {/* Botão hambúrguer para celulares */}
          <button
            type="button"
            onClick={() => setMenuAberto(!menuAberto)}
            className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
          >
            {menuAberto ? (
              // Ícone X
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-7 w-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Ícone hambúrguer
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-7 w-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>

        </div>

        {/* Menu responsivo */}
        {menuAberto && (
          <nav
            className="border-t border-slate-200 bg-white px-6 py-4 md:hidden"
            aria-label="Menu mobile"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2">

              <NavLink
                to="/"
                end
                className={linkClass}
                onClick={fecharMenu}
              >
                Início
              </NavLink>

              <NavLink
                to="/mapa/Bairro"
                className={linkClass}
                onClick={fecharMenu}
              >
                Mapa
              </NavLink>

              <NavLink
                to="/ocorrencias/nova"
                className={linkClass}
                onClick={fecharMenu}
              >
                Nova ocorrência
              </NavLink>

              {!idUsuario ? (
                <>
                  <NavLink
                    to="/entrar"
                    className={linkClass}
                    onClick={fecharMenu}
                  >
                    Entrar
                  </NavLink>

                  <NavLink
                    to="/cadastro"
                    className={linkClass}
                    onClick={fecharMenu}
                  >
                    Cadastrar
                  </NavLink>
                </>
              ) : (
                <NavLink
                  to="/info/usuario"
                  className={linkClass}
                  onClick={fecharMenu}
                >
                  {carregando
                    ? 'Carregando...'
                    : usuario
                      ? usuario.nome
                      : 'Minha conta'}
                </NavLink>
              )}

            </div>
          </nav>
        )}

      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <Outlet />
      </main>

      {/* <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5 text-sm text-slate-500">
          BairroVivo — juntos por bairros melhores.
        </div>
      </footer> */}

      <div>
        <div className="bg-[#21212A] p-10 text-gray-500 flex items-center justify-center">
          <div className="gap-x-30">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold mb-2">BairroVivo — juntos por bairros melhores.</h3>
              <h3 className="text-lg font-semibold mb-2">Contatos</h3>
              <p>11987654321</p>
              <p>São Paulo SP</p>
              <p>HelpDesk@synergy.com</p>
            </div>
            <div className="flex flex-col gap-2">
            </div>
          </div>
        </div>

        <div className="bg-[#21212A] p-10 text-gray-500 flex justify-center">
          <h1 className="font-extralight text-2xl">BAIRROVIVO</h1>
          <h1 className="font-extralight text-2xl pl-5">©</h1>
          <h1 className="font-extralight text-2xl pl-5">2026</h1>
        </div>
      </div>

    </div>
  )
}