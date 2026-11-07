
import { Link, useNavigate } from "react-router";
import { buscar, atualizar } from "../services/api";
import { useEffect, useState } from "react";

export default function AtualizarUsuario() {

    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const navigate = useNavigate();

    const idUsuarioAtual = localStorage.getItem('idUsuario');

    function LeaveAcount() {
        localStorage.clear();
        navigate('/');
    }

    useEffect(() => {
        async function carregarUsuario() {
            if (!idUsuarioAtual) {
                navigate('/entrar');
                return;
            }

            try {
                const dados = await buscar(`/usuario/${idUsuarioAtual}`);
                setUsuario(dados);

            } catch (error) {
                console.error("Erro ao buscar usuário:", error);
                alert("Não foi possível carregar os dados do usuário.");

            } finally {
                setCarregando(false);
            }
        }

        carregarUsuario();

    }, [idUsuarioAtual, navigate]);

    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const dadosUsuario = {
            nome: formData.get('nome'),
            email: formData.get('email'),
            senha: formData.get('senha'),
            data: usuario.dataCadastro,
            statusConta: usuario.statusConta
        };

        // Se a senha estiver vazia, mantém a senha atual
        if (!dadosUsuario.senha) {
            delete dadosUsuario.senha;
        }

        try {
            await atualizar(`/usuario/${idUsuarioAtual}`, dadosUsuario);

            alert("Conta atualizada com sucesso!");
            navigate('/info/usuario');

        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            alert("Não foi possível atualizar sua conta.");
        }
    }

    if (carregando) {
        return <p>Carregando usuário...</p>;
    }

    if (!usuario) {
        return <p>Não foi possível carregar os dados do usuário.</p>;
    }

    return (

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">
                    Atualizar Conta
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Atualize os dados da sua conta.
                </p>
            </div>

            <form onSubmit={handleSubmit}>

                <div className="mb-2 block font-medium text-slate-700">

                    <div className="mb-4">
                        <label htmlFor="nome" className="opacity-50">
                            Nome
                        </label>

                        <input
                            id="nome"
                            name="nome"
                            type="text"
                            defaultValue={usuario.nome}
                            required
                            className="my-2 w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="opacity-50">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={usuario.email}
                            required
                            className="my-2 w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="senha" className="opacity-50">
                            Senha
                        </label>

                        <input
                            id="senha"
                            name="senha"
                            type="password"
                            placeholder="Digite uma nova senha (opcional)"
                            className="my-2 w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="flex items-center justify-center mb-15">
                        <button
                            type="submit"
                            className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white transition hover:bg-green-700"
                        >
                            Salvar
                        </button>
                    </div>

                </div>

            </form>

            <div className="mt-5">
                <Link
                    to="/info/usuario"
                    className="mt-5 rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white transition hover:bg-blue-700"
                >
                    Voltar
                </Link>
            </div>

            <div>
                <button
                    type="button"
                    className="mt-5 rounded-lg bg-red-600 px-3 py-2 font-semibold text-white transition hover:bg-red-700"
                >
                    Excluir Conta
                </button>
            </div>

            <div>
                <button
                    type="button"
                    onClick={LeaveAcount}
                    className="mt-3 px-3 py-2 font-semibold text-red-600 transition"
                >
                    Sair
                </button>
            </div>

        </section>

    );
}
