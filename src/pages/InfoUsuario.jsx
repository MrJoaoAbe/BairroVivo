
import { Link, useNavigate } from "react-router";
import { buscar, atualizar } from "../services/api";
import { useEffect, useState } from "react";

export default function InfoUsuario() {

    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const navigate = useNavigate()
    const idUsuarioAtual = localStorage.getItem('idUsuario')

    function LeaveAcount() {
        localStorage.clear();

        navigate('/')
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

    // Formata a data para dd/mm/aaaa
    function formatarData(data) {
        if (!data) return "Não informada";

        const [ano, mes, dia] = data.split("T")[0].split("-");

        return `${dia}/${mes}/${ano}`;
    }

    if (carregando) {
        return <p>Carregando usuário...</p>;
    }

    if (erro) {
        return <p className="text-red-600">{erro}</p>;
    }

    async function desativarConta() {

        const confirmar = window.confirm(
            "Tem certeza de que deseja desativar sua conta?"
        );

        if (!confirmar) return;

        const dadosUsuario = {
            nome: usuario.nome,
            email: usuario.email,
            senha: usuario.senha,
            dataCadastro: usuario.dataCadastro,
            statusConta: 'Inativa'
        };

        try {
            await atualizar(`/usuario/${idUsuarioAtual}`, dadosUsuario);

            alert("Conta desativada com sucesso!");

            localStorage.clear();
            navigate('/');

        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            alert("Não foi possível desativar a conta.");
        }
    }

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">
                    Olá, {usuario.nome}!
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Dados da sua conta.
                </p>
            </div>

            <div className="mb-2 block font-medium text-slate-700">

                <div className="flex items-center">
                    <label className="opacity-50">
                        Nome
                    </label>

                    <p className="my-2 pl-5">
                        {usuario.nome}
                    </p>
                </div>

                <div className="flex items-center">
                    <label className="opacity-50">
                        Email
                    </label>

                    <p className="my-2 pl-5">
                        {usuario.email}
                    </p>
                </div>

                <div className="flex items-center">
                    <label className="opacity-50">
                        Senha
                    </label>

                    <p className="my-2 pl-5">
                        ********
                    </p>
                </div>

                <div className="flex items-center">
                    <label className="opacity-50">
                        Data de Criação
                    </label>

                    <p className="my-2 pl-5">
                        {formatarData(usuario.dataCadastro)}
                    </p>
                </div>

            </div>

            <div className="mt-20">
                <Link
                    to="/update/usuario"
                    className="mt-5 rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white transition hover:bg-blue-700"
                >
                    Atualizar Conta
                </Link>
            </div>

            <div>
                <button onClick={desativarConta} className="mt-5 rounded-lg bg-red-600 px-3 py-2 font-semibold text-white transition hover:bg-red-700">
                    Excluir Conta
                </button>

            </div>

            <div>
                <button onClick={LeaveAcount} className="mt-3 px-3 py-2 font-semibold text-red-600 transition">
                    Sair
                </button>
            </div>

        </section>
    );
}
