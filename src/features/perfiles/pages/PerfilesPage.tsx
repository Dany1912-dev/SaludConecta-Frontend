import { useNavigate } from 'react-router-dom'
import { HeartPulse, Plus, Loader2, UserRound } from 'lucide-react'
import { useAuthStore } from '../../../store/authStore'
import { usePerfilStore } from '../../../store/perfilStore'
import { usePerfiles } from '../hooks/usePerfiles'
import { PerfilCard } from '../components/PerfilCard'
import { BotonTema } from '../../../shared/components/ui/BotonTema'
import type { PerfilPaciente } from '../../../api/perfilesApi'
import styles from './PerfilesPage.module.css'

const PerfilesPage = () => {
  const navigate = useNavigate()
  const { usuario, logout } = useAuthStore()
  const setPerfilActivo = usePerfilStore((s) => s.setPerfilActivo)
  const { perfiles, cargando, error } = usePerfiles()

  const seleccionarPerfil = (perfil: PerfilPaciente) => {
    setPerfilActivo(perfil)
    navigate('/dashboard', { replace: true })
  }

  const verDetalle = (perfil: PerfilPaciente) => {
    navigate(`/perfiles/${perfil.id}`)
  }

  return (
    <div className={styles.pagina}>

      {/* Encabezado */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <HeartPulse size={22} color="var(--color-primario)" strokeWidth={2.5} />
          <span className={styles.logoTexto}>Salud Conecta</span>
        </div>
        <div className={styles.headerAcciones}>
          <BotonTema />
          <button className={styles.botonSalir} onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Contenido */}
      <main className={styles.contenido}>

        {cargando ? (
          <div className={styles.estadoCentrado}>
            <Loader2 size={36} className={styles.spinner} color="var(--color-primario)" />
            <p className={styles.estadoTexto}>Cargando perfiles...</p>
          </div>

        ) : error ? (
          <div className={styles.estadoCentrado}>
            <p className={styles.estadoError}>{error}</p>
          </div>

        ) : perfiles.length === 0 ? (
          /* Estado vacío */
          <div className={styles.estadoVacio}>
            <div className={styles.iconoVacio}>
              <UserRound size={40} color="var(--color-primario)" strokeWidth={1.5} />
            </div>
            <h2 className={styles.tituloVacio}>Crea tu primer perfil</h2>
            <p className={styles.descripcionVacio}>
              Antes de comenzar, necesitas crear el perfil del paciente principal.
            </p>
            <button
              className={styles.botonCrear}
              onClick={() => navigate('/perfiles/crear')}
            >
              <Plus size={18} />
              Crear perfil
            </button>
          </div>

        ) : (
          /* Selector de perfiles */
          <div className={styles.selector}>
            <div className={styles.selectorEncabezado}>
              <p className={styles.saludo}>Hola, {usuario?.nombre}</p>
              <h1 className={styles.titulo}>¿Quién necesita atención hoy?</h1>
            </div>

            <div className={styles.grilla}>
              {perfiles.map((perfil) => (
                <PerfilCard
                  key={perfil.id}
                  perfil={perfil}
                  onClick={seleccionarPerfil}
                  onDetalle={verDetalle}
                />
              ))}

              {/* Tarjeta para añadir perfil */}
              <button
                className={styles.cardAnadir}
                onClick={() => navigate('/perfiles/crear')}
              >
                <div className={styles.cardAnadirIcono}>
                  <Plus size={28} color="var(--color-primario)" />
                </div>
                <p className={styles.cardAnadirTexto}>Añadir perfil</p>
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default PerfilesPage
