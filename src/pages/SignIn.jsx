import { Link, useNavigate } from 'react-router'
import { buscar } from '../services/api'
import { useEffect, useState } from 'react'

export default function SignIn() {

  const [usuarios, setUsuarios] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const dados = await buscar("/usuario");

        setUsuarios(dados)

      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        setErro("Não foi possível carregar os dados do usuário.");
      } finally {
        setCarregando(false);
      }
    }
    carregarUsuario();
  }, []);

  function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const email = formData.get('email')
    const senha = formData.get('senha')

    const usuarioEncontrado = usuarios.find(usuario =>
      usuario.email === email &&
      usuario.senha === senha
    )

    if (!usuarioEncontrado) {
      alert('Email ou senha incorretos!')
      return
    }

    localStorage.setItem('idUsuario', usuarioEncontrado.idUsuario)

    alert(`Bem-vindo de volta, ${usuarioEncontrado.nome}!`)

    navigate('/')
  }

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold">Entrar no BairroVivo</h1>
      <form className="space-y-5" onSubmit={handleSubmit}>

        <div className='pt-5'>
          <label htmlFor="email" className="mb-2 block font-medium text-slate-700">
            Email
          </label>

          <input id="email" name="email" type="email" placeholder="email@gmail.com.br" required className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label htmlFor="senha" className="mb-2 block font-medium text-slate-700">
            Senha
          </label>

          <input id="senha" name="senha" type="password" placeholder="senha" required className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button type='submit' onSubmit={handleSubmit} className="mt-5 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50">
          Entrar
        </button>

      </form>
      <Link to="/cadastro" className="mt-10 inline-block font-semibold text-emerald-700 hover:underline">
        Ainda não tem conta? Cadastre-se
      </Link>
    </section>
  )
}
