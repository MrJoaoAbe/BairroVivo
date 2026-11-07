
import { useEffect, useState } from 'react'
import L from 'leaflet'

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Circle,
    useMap,
} from 'react-leaflet'

import { buscar, atualizar } from '../services/api'

const POSICAO_INICIAL = [-23.5505, -46.6333]

const STATUS_ATIVOS = ['Pendente', 'Em analise']

const STATUS_DISPONIVEIS = [
    'Pendente',
    'Em analise',
    'Resolvido',
    'Cancelado'
]

// Ícone vermelho para as ocorrências
const iconeOcorrencia = L.divIcon({
    className: '',
    html: `
        <div style="
            width: 20px;
            height: 20px;
            background-color: #dc2626;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
})

function CentralizarMapa({ position }) {
    const map = useMap()

    useEffect(() => {
        if (position) {
            map.flyTo(position, 16, {
                duration: 1.5,
            })
        }
    }, [position, map])

    return null
}

export default function MapaLocalizacao() {
    const [position, setPosition] = useState(null)
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(false)

    const [ocorrencias, setOcorrencias] = useState([])
    const [carregandoOcorrencias, setCarregandoOcorrencias] = useState(true)
    const [atualizandoId, setAtualizandoId] = useState(null)
    const [mensagem, setMensagem] = useState('')

    // Buscar ocorrências no backend
    useEffect(() => {
        async function carregarOcorrencias() {
            try {
                const dados = await buscar('/ocorrencia')
                setOcorrencias(dados)
            } catch (error) {
                console.error(error)
                setErro('Não foi possível carregar as ocorrências.')
            } finally {
                setCarregandoOcorrencias(false)
            }
        }

        carregarOcorrencias()
    }, [])

    // Atualizar somente o status da ocorrência
    async function alterarStatus(id, novoStatus) {
        try {
            setAtualizandoId(id)
            setMensagem('')
            setErro('')

            await atualizar(`/ocorrencia/${id}/status`, {
                status: novoStatus
            })

            setOcorrencias((anteriores) =>
                anteriores.map((ocorrencia) =>
                    ocorrencia.idOcorrencia === id
                        ? {
                            ...ocorrencia,
                            status: novoStatus,
                            dataResolucao:
                                novoStatus === 'Resolvido'
                                    ? new Date().toISOString().split('T')[0]
                                    : null
                        }
                        : ocorrencia
                )
            )

            setMensagem('Status atualizado com sucesso!')

        } catch (error) {
            console.error(error)
            setErro('Não foi possível atualizar o status.')
        } finally {
            setAtualizandoId(null)
        }
    }

    function buscarLocalizacao() {
        if (!navigator.geolocation) {
            setErro('Seu navegador não suporta geolocalização.')
            return
        }

        setCarregando(true)
        setErro('')

        navigator.geolocation.getCurrentPosition(
            (posicao) => {
                const novaPosicao = [
                    posicao.coords.latitude,
                    posicao.coords.longitude,
                ]

                setPosition(novaPosicao)
                setCarregando(false)
            },
            (error) => {
                setCarregando(false)

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setErro('Você precisa permitir o acesso à localização.')
                        break
                    case error.POSITION_UNAVAILABLE:
                        setErro('Não foi possível identificar sua localização.')
                        break
                    case error.TIMEOUT:
                        setErro('O tempo para localizar você terminou.')
                        break
                    default:
                        setErro('Ocorreu um erro ao buscar sua localização.')
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        )
    }

    // Mostrar somente ocorrências pendentes ou em análise
    const ocorrenciasAtivas = ocorrencias.filter(
        (ocorrencia) =>
            STATUS_ATIVOS.includes(ocorrencia.status) &&
            ocorrencia.localizacao?.latitude != null &&
            ocorrencia.localizacao?.longitude != null
    )

    return (
        <div className="w-full space-y-3">

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">
                        Mapa de ocorrências
                    </h2>

                    <p className="text-sm text-gray-500">
                        Explore sua região e encontre problemas próximos.
                    </p>
                </div>

                <button
                    onClick={buscarLocalizacao}
                    disabled={carregando}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {carregando ? 'Localizando...' : 'Minha localização'}
                </button>
            </div>

            {carregandoOcorrencias && (
                <p className="text-sm text-gray-500">
                    Carregando ocorrências...
                </p>
            )}

            {erro && (
                <p className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
                    {erro}
                </p>
            )}

            {mensagem && (
                <p className="rounded-lg bg-green-100 p-3 text-sm text-green-700">
                    {mensagem}
                </p>
            )}

            <div className="h-[500px] w-full overflow-hidden rounded-xl border border-gray-300">

                <MapContainer
                    center={POSICAO_INICIAL}
                    zoom={13}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Localização do usuário */}
                    {position && (
                        <>
                            <CentralizarMapa position={position} />

                            <Circle
                                center={position}
                                radius={50}
                                pathOptions={{
                                    color: '#2563eb',
                                    fillColor: '#3b82f6',
                                    fillOpacity: 0.2,
                                }}
                            />

                            <Marker position={position}>
                                <Popup>
                                    Você está aqui!
                                </Popup>
                            </Marker>
                        </>
                    )}

                    {/* Marcadores das ocorrências */}
                    {ocorrenciasAtivas.map((ocorrencia) => {
                        const localizacao = ocorrencia.localizacao

                        const coordenadas = [
                            Number(localizacao.latitude),
                            Number(localizacao.longitude)
                        ]

                        return (
                            <Marker
                                key={ocorrencia.idOcorrencia}
                                position={coordenadas}
                                icon={iconeOcorrencia}
                            >
                                <Popup maxWidth={220} minWidth={160} className="popup-ocorrencia">
                                    <div className="w-44 sm:w-56 space-y-1.5">

                                        <h3 className="text-base font-bold text-gray-800">
                                            {ocorrencia.titulo}
                                        </h3>

                                        <p className="text-sm text-gray-600">
                                            {ocorrencia.descricao}
                                        </p>

                                        <div className="text-sm">
                                            <p>
                                                <strong>Categoria:</strong>{' '}
                                                {ocorrencia.categoria?.nome}
                                            </p>

                                            <p>
                                                <strong>Endereço:</strong>{' '}
                                                {localizacao.rua}, {localizacao.numero}
                                            </p>

                                            <p>
                                                <strong>Bairro:</strong>{' '}
                                                {localizacao.bairro?.nome}
                                            </p>

                                            <p>
                                                <strong>Data:</strong>{' '}
                                                {ocorrencia.dataCriacao}
                                            </p>

                                            <p>
                                                <strong>Status atual:</strong>{' '}
                                                {ocorrencia.status}
                                            </p>
                                        </div>

                                        <div className="border-t pt-2">
                                            <label className="mb-1 block text-sm font-semibold">
                                                Atualizar status
                                            </label>

                                            <select
                                                value={ocorrencia.status}
                                                disabled={atualizandoId === ocorrencia.idOcorrencia}
                                                onChange={(e) =>
                                                    alterarStatus(
                                                        ocorrencia.idOcorrencia,
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                                            >
                                                {STATUS_DISPONIVEIS.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>

                                            {atualizandoId === ocorrencia.idOcorrencia && (
                                                <p className="mt-1 text-xs text-blue-600">
                                                    Atualizando...
                                                </p>
                                            )}
                                        </div>

                                    </div>
                                </Popup>
                            </Marker>
                        )
                    })}

                </MapContainer>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-600"></span>
                    Ocorrências abertas ({ocorrenciasAtivas.length})
                </div>

                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-blue-600"></span>
                    Sua localização
                </div>
            </div>

        </div>
    )
}
