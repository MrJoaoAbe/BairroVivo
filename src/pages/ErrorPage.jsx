import { Link, useRouteError } from 'react-router'

export default function ErrorPage() {
  const error = useRouteError()

  return (
    <section className="mx-auto max-w-xl py-20 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">Ops!</p>
      <h1 className="mt-3 text-3xl font-extrabold">Não foi possível abrir esta página.</h1>
      <p className="mt-3 text-slate-600">
        {error?.statusText || error?.message || 'Ocorreu um erro inesperado.'}
      </p>
      <Link to="/" className="mt-6 inline-block rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800">
        Voltar ao início
      </Link>
    </section>
  )
}
