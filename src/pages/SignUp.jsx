
import { Link, useNavigate } from 'react-router'
import { useState } from 'react'
import { cadastrar } from '../services/api'

export default function SignUp() {

  const [statusUsuario, setStatusUsuario] = useState('Ativa')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const senha = formData.get('senha')
    const confirmarSenha = formData.get('confirmarSenha')

    // Verificar se as senhas são iguais
    if (senha !== confirmarSenha) {
      alert('As senhas precisam ser iguais!')
      return
    }

    // Gerar a data atual no formato YYYY-MM-DD
    const hoje = new Date()

    const dia = String(hoje.getDate()).padStart(2, '0')
    const mes = String(hoje.getMonth() + 1).padStart(2, '0')
    const ano = hoje.getFullYear()

    const dataAtual = `${ano}-${mes}-${dia}`

    // Preparar os dados para enviar à API
    const dadosUsuario = {
      nome: formData.get('nome'),
      email: formData.get('email'),
      senha: senha,
      dataCadastro: dataAtual,
      statusConta: statusUsuario
    }

    try {
      setCarregando(true);

      const novoUsuario = await cadastrar('/usuario', dadosUsuario);

      console.log('Usuário retornado pela API:', novoUsuario);

      localStorage.setItem('idUsuario', novoUsuario.idUsuario);

      alert('Usuário cadastrado com sucesso!');

      navigate('/');

    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error)
      alert('Não foi possível cadastrar o usuário.')

    } finally {
      setCarregando(false)
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <h1 className="text-2xl font-bold">
        Criar uma conta
      </h1>

      <form className="space-y-5" onSubmit={handleSubmit}>

        <div className="py-5">

          <label htmlFor="nome" className="mb-5 block font-medium text-slate-700">
            Nome
          </label>

          <input
            id="nome"
            name="nome"
            type="text"
            placeholder="Nome"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <label htmlFor="email" className="mb-5 block font-medium text-slate-700">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email@gmail.com.br"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <label htmlFor="senha" className="mb-5 block font-medium text-slate-700">
            Senha
          </label>

          <input
            id="senha"
            name="senha"
            type="password"
            placeholder="Senha"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <label htmlFor="confirmarSenha" className="mb-5 block font-medium text-slate-700">
            Confirmar Senha
          </label>

          <input
            id="confirmarSenha"
            name="confirmarSenha"
            type="password"
            placeholder="Confirmar Senha"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

        <button
          type="submit"
          disabled={carregando}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {carregando ? 'Cadastrando...' : 'Criar'}
        </button>

      </form>

      <Link
        to="/entrar"
        className="mt-5 inline-block font-semibold text-emerald-700 hover:underline"
      >
        Já tem conta? Entre
      </Link>

    </section>
  )
}
