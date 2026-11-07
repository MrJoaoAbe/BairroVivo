import MapaLocalizacao from "../components/MapaLocalizacao"
import { NavLink } from "react-router"

export default function Map() {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

            <div>
                <MapaLocalizacao />
            </div>

            <div className="mt-4 flex items-center justify-center text-slate-600">
                <div className="columns-1">
                    <p className="p-2">Precisa relatar um problema?</p>
                    <NavLink to="/ocorrencias/nova" className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition">
                        Nova ocorrência
                    </NavLink>
                </div>
            </div>

        </section>
    )
}
