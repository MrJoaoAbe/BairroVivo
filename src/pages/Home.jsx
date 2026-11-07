import { Link } from 'react-router'

export default function Home() {

  const idUsuario = localStorage.getItem("idUsuario")

  return (
    <section className="grid min-h-[60vh] items-center gap-10 md:grid-cols-2">
      <div>
        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
          Sua comunidade, mais participativa
        </span>
        <h1 className="mt-5 max-w-xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
          Um bairro melhor começa com a sua voz.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
          Registre problemas urbanos, acompanhe ocorrências e ajude a comunidade
          a dar visibilidade ao que precisa de atenção.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">

          {idUsuario ? (
            <Link to="/ocorrencias/nova" className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-800">
              Registrar ocorrência
            </Link>
          ) : (

            <Link to="/cadastro" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100">
              Participar da comunidade
            </Link>
          )}

        </div>
      </div>

      <div className="rounded-3xl bg-emerald-900 p-8 text-white shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
          BairroVivo
        </p>
        <h2 className="mt-4 text-2xl font-bold">Problemas identificados. Comunidades ouvidas.</h2>
        <p className="mt-3 leading-7 text-emerald-100">
          Um espaço para compartilhar situações do bairro, confirmar relatos
          de outros moradores e acompanhar os pontos que merecem prioridade.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-2xl font-bold">01</p>
            <p className="mt-1 text-sm text-emerald-100">Relate um problema</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-2xl font-bold">02</p>
            <p className="mt-1 text-sm text-emerald-100">Mobilize seu bairro</p>
          </div>
        </div>
      </div>
    </section>
  )
}
