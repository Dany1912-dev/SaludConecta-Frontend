import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, Activity, Brain, ChevronRight,
  Droplets, Users, Settings, LogOut, Heart,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { usePerfilStore } from '../../store/perfilStore'
import { obtenerAlergias } from '../../api/alergiasApi'
import { obtenerEstiloVida } from '../../api/estiloVidaApi'
import { obtenerPersonales, obtenerPsicologicos } from '../../api/antecedentesApi'
import { etiquetaTipoSangre } from '../../api/perfilesApi'
import { Boton } from '../../shared/components/ui/Boton'
import styles from './DashboardPage.module.css'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { usuario, logout } = useAuthStore()
  const { perfilActivo } = usePerfilStore()

  const [alergiaCount, setAlergiaCount] = useState<number | null>(null)
  const [antPersonalCount, setAntPersonalCount] = useState<number | null>(null)
  const [antPsicCount, setAntPsicCount] = useState<number | null>(null)
  const [tieneEstilo, setTieneEstilo] = useState<boolean | null>(null)

  useEffect(() => {
    if (!perfilActivo) return
    const id = perfilActivo.id

    Promise.all([
      obtenerAlergias(id).then(r => setAlergiaCount(r.data.length)).catch(() => setAlergiaCount(0)),
      obtenerPersonales(id).then(r => setAntPersonalCount(r.data.length)).catch(() => setAntPersonalCount(0)),
      obtenerPsicologicos(id).then(r => setAntPsicCount(r.data.length)).catch(() => setAntPsicCount(0)),
      obtenerEstiloVida(id).then(() => setTieneEstilo(true)).catch(() => setTieneEstilo(false)),
    ])
  }, [perfilActivo])

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  if (!perfilActivo) {
    return (
      <div className={styles.pagina}>
        <div className={styles.sinPerfil}>
          <p>No hay un perfil activo.</p>
          <Boton onClick={() => navigate('/perfiles')}>Ir a perfiles</Boton>
        </div>
      </div>
    )
  }

  const inicial = perfilActivo.nombreCompleto.trim().charAt(0).toUpperCase() || '?'
  const edad = new Date().getFullYear() - new Date(perfilActivo.fechaNacimiento).getFullYear()
  const ahora = new Date()
  const hora = ahora.getHours()
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className={styles.pagina}>
      <div className={styles.contenedor}>

        {/* Barra superior */}
        <div className={styles.barraSuperior}>
          <div className={styles.bienvenida}>
            <p className={styles.saludo}>{saludo}, {usuario?.nombre ?? 'usuario'} 👋</p>
            <h1 className={styles.tituloPrincipal}>Resumen de salud</h1>
          </div>
          <div className={styles.accionesSuperior}>
            <Boton variante="secundario" onClick={() => navigate('/perfiles')}>
              Cambiar perfil
            </Boton>
            <Boton variante="secundario" onClick={handleLogout}>
              <LogOut size={15} /> Salir
            </Boton>
          </div>
        </div>

        {/* Perfil activo */}
        <div className={styles.perfilActivoCard} onClick={() => navigate(`/perfiles/${perfilActivo.id}`)}>
          <div className={styles.avatarMediano} style={{ backgroundColor: perfilActivo.colorAvatar }}>
            <span className={styles.avatarLetra}>{inicial}</span>
          </div>
          <div className={styles.perfilActivoInfo}>
            <h2 className={styles.perfilActivoNombre}>{perfilActivo.nombreCompleto}</h2>
            <div className={styles.perfilActivoMeta}>
              <span className={styles.metaItem}><Droplets size={13} /> {etiquetaTipoSangre[perfilActivo.tipoSangre]}</span>
              <span className={styles.metaItem}>{edad} años · {perfilActivo.genero}</span>
              {perfilActivo.ocupacion && <span className={styles.metaItem}>{perfilActivo.ocupacion}</span>}
            </div>
          </div>
          <ChevronRight size={20} className={styles.perfilActivoFlecha} />
        </div>

        {/* Grid de resumen */}
        <div className={styles.gridResumen}>

          <div className={styles.tarjetaResumen} onClick={() => navigate(`/perfiles/${perfilActivo.id}?tab=alergias`)}>
            <div className={styles.tarjetaIcono} style={{ background: 'var(--color-error-fondo)' }}>
              <AlertTriangle size={20} color="var(--color-error)" />
            </div>
            <p className={styles.tarjetaEtiqueta}>Alergias</p>
            <p className={styles.tarjetaValor}>{alergiaCount ?? '—'}</p>
            <p className={styles.tarjetaDescripcion}>
              {alergiaCount === 0 ? 'Sin alergias registradas' : `${alergiaCount} activa${alergiaCount !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className={styles.tarjetaResumen} onClick={() => navigate(`/perfiles/${perfilActivo.id}?tab=antecedentes`)}>
            <div className={styles.tarjetaIcono} style={{ background: 'var(--color-primario-claro)' }}>
              <Heart size={20} color="var(--color-primario)" />
            </div>
            <p className={styles.tarjetaEtiqueta}>Antecedentes personales</p>
            <p className={styles.tarjetaValor}>{antPersonalCount ?? '—'}</p>
            <p className={styles.tarjetaDescripcion}>
              {antPersonalCount === 0 ? 'Sin registros' : `${antPersonalCount} condición${antPersonalCount !== 1 ? 'es' : ''}`}
            </p>
          </div>

          <div className={styles.tarjetaResumen} onClick={() => navigate(`/perfiles/${perfilActivo.id}?tab=antecedentes`)}>
            <div className={styles.tarjetaIcono} style={{ background: '#f0fdf4' }}>
              <Brain size={20} color="#16a34a" />
            </div>
            <p className={styles.tarjetaEtiqueta}>Salud mental</p>
            <p className={styles.tarjetaValor}>{antPsicCount ?? '—'}</p>
            <p className={styles.tarjetaDescripcion}>
              {antPsicCount === 0 ? 'Sin antecedentes' : `${antPsicCount} antecedente${antPsicCount !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className={styles.tarjetaResumen} onClick={() => navigate(`/perfiles/${perfilActivo.id}?tab=estilo`)}>
            <div className={styles.tarjetaIcono} style={{ background: '#fefce8' }}>
              <Activity size={20} color="#ca8a04" />
            </div>
            <p className={styles.tarjetaEtiqueta}>Estilo de vida</p>
            <p className={styles.tarjetaValor}>{tieneEstilo === null ? '—' : tieneEstilo ? '✓' : 'N/A'}</p>
            <p className={styles.tarjetaDescripcion}>
              {tieneEstilo ? 'Información disponible' : 'Sin información registrada'}
            </p>
          </div>

        </div>

        {/* Acciones rápidas */}
        <div className={styles.seccionAcciones}>
          <h3 className={styles.seccionTitulo}>Acciones rápidas</h3>
          <div className={styles.gridAcciones}>
            <button className={styles.accionCard} onClick={() => navigate(`/perfiles/${perfilActivo.id}`)}>
              <div className={styles.accionIcono} style={{ background: 'var(--color-primario-claro)' }}>
                <Settings size={18} color="var(--color-primario)" />
              </div>
              Ver detalle del perfil
            </button>
            <button className={styles.accionCard} onClick={() => navigate('/perfiles')}>
              <div className={styles.accionIcono} style={{ background: 'var(--color-fondo-secundario)' }}>
                <Users size={18} color="var(--color-texto-secundario)" />
              </div>
              Gestionar perfiles
            </button>
            <button className={styles.accionCard} onClick={() => navigate('/linea-de-vida')}>
              <div className={styles.accionIcono} style={{ background: '#fef3c7' }}>
                <Activity size={18} color="#d97706" />
              </div>
              Línea de vida
            </button>
            <button className={styles.accionCard} onClick={() => navigate('/medicamentos')}>
              <div className={styles.accionIcono} style={{ background: '#f0fdf4' }}>
                <Heart size={18} color="#16a34a" />
              </div>
              Medicamentos
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DashboardPage
