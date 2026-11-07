import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { buscar, cadastrar } from "../services/api";

export default function AddOcorrencia() {
  const navigate = useNavigate();

  const idUsuarioAtual = localStorage.getItem("idUsuario");

  const [usuario, setUsuario] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [bairros, setBairros] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [fotoUrl, setFotoUrl] = useState("");

  // Busca usuário, categorias e bairros
  useEffect(() => {
    async function carregarDados() {
      if (!idUsuarioAtual) {
        navigate("/entrar");
        return;
      }

      try {
        const [dadosUsuario, dadosCategorias, dadosBairros] =
          await Promise.all([
            buscar(`/usuario/${idUsuarioAtual}`),
            buscar("/categoria"),
            buscar("/bairro")
          ]);

        setUsuario(dadosUsuario);
        setCategorias(dadosCategorias);
        setBairros(dadosBairros);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Não foi possível carregar os dados necessários.");

      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [idUsuarioAtual, navigate]);

  // Obtém a data atual no formato YYYY-MM-DD
  function obterDataAtual() {
    const hoje = new Date();

    const dia = String(hoje.getDate()).padStart(2, "0");
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const ano = hoje.getFullYear();

    return `${ano}-${mes}-${dia}`;
  }

  // Obtém a localização do navegador
  function obterLocalizacao() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Seu navegador não suporta geolocalização."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!usuario) {
      alert("Não foi possível identificar o usuário.");
      return;
    }

    const formData = new FormData(event.currentTarget);

    // Recupera os IDs selecionados
    const idCategoria = formData.get("categoria");
    const idBairro = formData.get("bairro");

    // Localiza os objetos completos nas listas carregadas
    const categoriaSelecionada = categorias.find(
      (item) => String(item.idCategoria) === String(idCategoria)
    );

    const bairroSelecionado = bairros.find(
      (item) => String(item.idBairro) === String(idBairro)
    );

    if (!categoriaSelecionada || !bairroSelecionado) {
      alert("Selecione uma categoria e um bairro válidos.");
      return;
    }

    try {
      setEnviando(true);

      // Obtém latitude e longitude antes de montar o JSON
      const coordenadas = await obterLocalizacao();

      const dadosOcorrencia = {
        usuario: usuario,

        localizacao: {
          latitude: coordenadas.latitude,
          longitude: coordenadas.longitude,
          numero: formData.get("numero"),
          rua: formData.get("rua"),
          pontoReferencia: formData.get("pontoReferencia"),
          complemento: formData.get("complemento") || null,
          bairro: bairroSelecionado
        },

        categoria: categoriaSelecionada,

        titulo: formData.get("titulo"),
        descricao: formData.get("descricao"),
        status: "Pendente",
        dataCriacao: obterDataAtual(),
        dataResolucao: null
      };

      console.log("JSON enviado:", dadosOcorrencia);

      await cadastrar("/ocorrencia", dadosOcorrencia);

      alert("Ocorrência registrada com sucesso!");
      navigate("/");

    } catch (error) {
      console.error("Erro ao cadastrar ocorrência:", error);
      alert("Não foi possível registrar a ocorrência: " + error.message);

    } finally {
      setEnviando(false);
    }
  }

  // Pré-visualização da foto
  function handleFoto(event) {
    const foto = event.target.files[0];

    if (foto) {
      setFotoUrl(URL.createObjectURL(foto));
    } else {
      setFotoUrl("");
    }
  }

  if (carregando) {
    return <p>Carregando informações...</p>;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Registrar ocorrência
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Informe os detalhes do problema encontrado em seu bairro.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Título */}
        <div>
          <label htmlFor="titulo" className="mb-2 block font-medium text-slate-700">
            Título
          </label>

          <input
            id="titulo"
            name="titulo"
            type="text"
            placeholder="Ex: Buraco na rua"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="descricao" className="mb-2 block font-medium text-slate-700">
            Descrição
          </label>

          <textarea
            id="descricao"
            name="descricao"
            rows="4"
            placeholder="Descreva o problema encontrado..."
            required
            className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3"
          />
        </div>

        {/* Categoria */}
        <div>
          <label htmlFor="categoria" className="mb-2 block font-medium text-slate-700">
            Categoria
          </label>

          <select
            id="categoria"
            name="categoria"
            required
            defaultValue=""
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3"
          >
            <option value="" disabled>
              Selecione uma categoria
            </option>

            {categorias.map((categoria) => (
              <option
                key={categoria.idCategoria}
                value={categoria.idCategoria}
              >
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Bairro */}
        <div>
          <label htmlFor="bairro" className="mb-2 block font-medium text-slate-700">
            Bairro
          </label>

          <select
            id="bairro"
            name="bairro"
            required
            defaultValue=""
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3"
          >
            <option value="" disabled>
              Selecione um bairro
            </option>

            {bairros.map((bairro) => (
              <option
                key={bairro.idBairro}
                value={bairro.idBairro}
              >
                {bairro.nome} - {bairro.cidade}/{bairro.uf}
              </option>
            ))}
          </select>
        </div>

        {/* Endereço */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <div>
            <label htmlFor="rua" className="mb-2 block font-medium text-slate-700">
              Rua
            </label>

            <input
              id="rua"
              name="rua"
              type="text"
              placeholder="Nome da rua"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="numero" className="mb-2 block font-medium text-slate-700">
              Número
            </label>

            <input
              id="numero"
              name="numero"
              type="text"
              placeholder="Número"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="complemento" className="mb-2 block font-medium text-slate-700">
              Complemento
            </label>

            <input
              id="complemento"
              name="complemento"
              type="text"
              placeholder="Apartamento, bloco..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            />
          </div>
        </div>

        {/* Ponto de referência */}
        <div>
          <label htmlFor="pontoReferencia" className="mb-2 block font-medium text-slate-700">
            Ponto de referência
          </label>

          <input
            id="pontoReferencia"
            name="pontoReferencia"
            type="text"
            placeholder="Ex: Próximo à escola municipal"
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />
        </div>

        {/* Foto */}
        <div>
          <label htmlFor="foto" className="mb-2 block font-medium text-slate-700">
            Foto da ocorrência
          </label>

          <input
            id="foto"
            name="foto"
            type="file"
            accept="image/*"
            onChange={handleFoto}
            className="w-full rounded-lg border border-slate-300 p-3"
          />

          {fotoUrl && (
            <img
              src={fotoUrl}
              alt="Pré-visualização da ocorrência"
              className="mt-3 max-h-64 rounded-lg"
            />
          )}
        </div>

        {/* Botão */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={enviando}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {enviando ? "Registrando..." : "Registrar ocorrência"}
          </button>
        </div>

      </form>
    </section>
  );
}