import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  HeartPulse, ArrowRight, CalendarDays,
  FlaskConical, FileImage, Pill,
  ChevronDown, Sun, Moon
} from 'lucide-react'
import { useTemaStore } from '../../store/temaStore'
import styles from './LandingPage.module.css'

// ── Hook: activa animaciones al hacer scroll ─────────
const useScrollAnimacion = () => {
  useEffect(() => {
    const elementos = document.querySelectorAll(`.${styles.animScroll}`)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible)
          }
        })
      },
      { threshold: 0.12 }
    )
    elementos.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// ── Datos ─────────────────────────────────────────────
const problemas = [
  {
    cita: '¿Cuál era el nombre de ese medicamento que me recetaron?',
    detalle: 'Recordar dosis, frecuencia y duración de tratamientos pasados es casi imposible sin un registro.',
  },
  {
    cita: '¿Con qué doctor fui la última vez y en qué consultorio?',
    detalle: 'Los teléfonos y direcciones se pierden. Los nombres se olvidan. La información médica se fragmenta.',
  },
  {
    cita: '¿Dónde guardé esos resultados de laboratorio?',
    detalle: 'Cajones, fotos del celular, correos sin leer — los exámenes clínicos siempre aparecen cuando ya no se necesitan.',
  },
]

const funcionalidades = [
  {
    icono: <CalendarDays size={24} color="var(--color-primario)" />,
    titulo: 'Historial de citas',
    descripcion: 'Registra cada consulta con el nombre del médico, especialidad, consultorio, fecha y diagnóstico. Todo en un solo lugar.',
  },
  {
    icono: <FlaskConical size={24} color="var(--color-primario)" />,
    titulo: 'Exámenes clínicos',
    descripcion: 'Guarda tus resultados de sangre, orina y más. Lleva un historial completo de tus análisis clínicos a lo largo del tiempo.',
  },
  {
    icono: <FileImage size={24} color="var(--color-primario)" />,
    titulo: 'Recetas médicas',
    descripcion: 'Sube una foto de tu receta y guarda el nombre del doctor, su especialidad y el consultorio donde te atendió.',
  },
  {
    icono: <Pill size={24} color="var(--color-primario)" />,
    titulo: 'Medicamentos',
    descripcion: 'Registra los medicamentos que tomas o tomaste, con su dosis, frecuencia y el motivo del tratamiento.',
  },
]

const perfilesFamiliares = [
  { iniciales: 'RM', nombre: 'Roberto M.', rol: 'Administrador', color: '#4569AD', badge: 'Tú', badgeColor: 'rgba(69,105,173,0.2)', badgeTexto: 'var(--color-primario)' },
  { iniciales: 'LM', nombre: 'Laura M.', rol: 'Pareja', color: '#2d5a9e', badge: '3 medicamentos', badgeColor: 'rgba(74,222,128,0.15)', badgeTexto: '#4ADE80' },
  { iniciales: 'SM', nombre: 'Sofía M.', rol: 'Hija · 8 años', color: '#8e6ab5', badge: 'Cita pendiente', badgeColor: 'rgba(251,176,64,0.15)', badgeTexto: '#FBB040' },
  { iniciales: 'JM', nombre: 'Jorge M.', rol: 'Padre · 68 años', color: '#2d7a6e', badge: '5 medicamentos', badgeColor: 'rgba(74,222,128,0.15)', badgeTexto: '#4ADE80' },
]

// ── Componente ────────────────────────────────────────
const LandingPage = () => {
  const { tema, toggleTema } = useTemaStore()
  useScrollAnimacion()

  return (
    <div className={styles.pagina}>

      {/* ── Navbar ─────────────────────────────────── */}
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <HeartPulse size={22} color="#fff" strokeWidth={2.5} />
          <span className={styles.navLogoTexto}>Salud Conecta</span>
        </div>
        <div className={styles.navAcciones}>
          <button className={styles.navBotonTema} onClick={toggleTema}
            aria-label="Cambiar tema">
            {tema === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>
          <Link to="/login" className={styles.navLogin}>Iniciar sesión</Link>
          <Link to="/registro" className={styles.navRegistro}>Crear cuenta</Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroFondo} />
        <div className={styles.heroOrbe1} />
        <div className={styles.heroOrbe2} />
        <div className={styles.heroOrbe3} />

        <div className={styles.heroContenido}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgePulso} />
            <span className={styles.heroBadgeTexto}>Tu historial médico, siempre disponible</span>
          </div>

          <h1 className={styles.heroTitulo}>
            En una emergencia,<br />
            <em className={styles.heroTituloAcento}>cada segundo cuenta.</em>
          </h1>

          <p className={styles.heroSubtitulo}>
            ¿Tienes tu historial a la mano? Salud Conecta centraliza las consultas, exámenes, recetas y medicamentos de toda tu familia para que tu médico sepa exactamente cómo tratarte.
          </p>

          <div className={styles.heroBotones}>
            <Link to="/registro" className={styles.heroCTA}>
              Crear cuenta gratis <ArrowRight size={18} />
            </Link>
            <Link to="/login" className={styles.heroSecundario}>
              Iniciar sesión
            </Link>
          </div>
        </div>

        <div className={styles.heroFlecha}>
          <div className={styles.heroFlechaLinea} />
          <ChevronDown size={16} color="rgba(183,195,232,0.5)" />
        </div>
      </section>

      {/* ── El problema ────────────────────────────── */}
      <section className={`${styles.seccion} ${styles.seccionCentrada} ${styles.problemaFondo}`}>
        <div className={styles.contenedor}>
          <div className={`${styles.animScroll}`}>
            <span className={styles.etiqueta}>¿Te suena familiar?</span>
            <h2 className={styles.tituloSeccion}>
              La información médica vive<br />en demasiados lugares a la vez
            </h2>
            <p className={styles.subtituloSeccion}>
              Recetas en cajones, resultados en fotos del celular, nombres de médicos en notas perdidas. Cuando más los necesitas, nunca están.
            </p>
          </div>

          <div className={styles.problemaTarjetas}>
            {problemas.map((p, i) => (
              <div key={i}
                className={`${styles.problemaTarjeta} ${styles.animScroll} ${
                  i === 0 ? styles.animScrollDelay1 :
                  i === 1 ? styles.animScrollDelay2 :
                  styles.animScrollDelay3
                }`}>
                <div className={styles.problemaComillas}>"</div>
                <p className={styles.problemaCita}>{p.cita}</p>
                <p className={styles.problemaDetalle}>{p.detalle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Funcionalidades ────────────────────────── */}
      <section className={`${styles.seccion} ${styles.seccionCentrada}`}>
        <div className={styles.contenedor}>
          <div className={`${styles.animScroll}`}>
            <span className={styles.etiqueta}>Qué puedes guardar</span>
            <h2 className={styles.tituloSeccion}>
              Todo tu historial médico,<br />organizado y accesible
            </h2>
            <p className={styles.subtituloSeccion}>
              Desde una cita de rutina hasta una emergencia — siempre tendrás la información correcta en el momento correcto.
            </p>
          </div>

          <div className={styles.funcionalidadesGrid}>
            {funcionalidades.map((f, i) => (
              <div key={i}
                className={`${styles.funcTarjeta} ${styles.animScroll} ${
                  i === 0 ? styles.animScrollDelay1 :
                  i === 1 ? styles.animScrollDelay2 :
                  i === 2 ? styles.animScrollDelay3 :
                  styles.animScrollDelay4
                }`}>
                <div className={styles.funcIconoWrapper}>{f.icono}</div>
                <h3 className={styles.funcTitulo}>{f.titulo}</h3>
                <p className={styles.funcDescripcion}>{f.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modo familiar ──────────────────────────── */}
      <section className={`${styles.seccion} ${styles.familiarFondo}`}>
        <div className={styles.contenedor}>
          <div className={styles.familiarContenido}>

            <div className={`${styles.animScroll}`}>
              <span className={styles.familiarEtiqueta}>Modo familiar</span>
              <h2 className={styles.familiarTitulo}>
                No solo para ti,<br />
                <em className={styles.familiarTituloAcento}>para toda tu familia.</em>
              </h2>
              <p className={styles.familiarDescripcion}>
                Administra el historial médico de tus hijos, pareja y adultos mayores desde una sola cuenta. Cada perfil tiene su propio espacio, tú tienes el control.
              </p>
              <div className={styles.familiarLista}>
                {[
                  'Un perfil independiente por cada familiar',
                  'Historial, recetas y medicamentos por separado',
                  'Tú decides quién es parte de tu círculo familiar',
                  'Cambia de perfil en segundos',
                ].map((item) => (
                  <div key={item} className={styles.familiarItem}>
                    <div className={styles.familiarCheck}>✓</div>
                    <span className={styles.familiarItemTexto}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${styles.familiarPerfiles} ${styles.animScroll} ${styles.animScrollDelay2}`}>
              {perfilesFamiliares.map((p) => (
                <div key={p.nombre} className={styles.familiarPerfilCard}>
                  <div className={styles.familiarAvatar} style={{ background: p.color }}>
                    {p.iniciales}
                  </div>
                  <div className={styles.familiarPerfilInfo}>
                    <div className={styles.familiarPerfilNombre}>{p.nombre}</div>
                    <div className={styles.familiarPerfilRol}>{p.rol}</div>
                  </div>
                  <span className={styles.familiarPerfilBadge}
                    style={{ background: p.badgeColor, color: p.badgeTexto }}>
                    {p.badge}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA final ──────────────────────────────── */}
      <section className={`${styles.seccion} ${styles.ctaFondo}`}>
        <div className={styles.contenedor}>
          <div className={`${styles.animScroll}`}>
            <h2 className={styles.ctaTitulo}>
              Empieza hoy.<br />Es gratis.
            </h2>
            <p className={styles.ctaSubtitulo}>
              Crea tu cuenta en segundos y ten el historial médico de tu familia listo para cuando más lo necesites.
            </p>
            <Link to="/registro" className={styles.ctaBoton}>
              Crear mi cuenta <ArrowRight size={20} />
            </Link>
            <p className={styles.ctaNota}>Sin tarjeta de crédito · Sin compromisos</p>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>
          <HeartPulse size={18} color="rgba(183,195,232,0.6)" strokeWidth={2.5} />
          <span className={styles.footerLogoTexto}>Salud Conecta</span>
        </div>
        <span className={styles.footerCopy}>© {new Date().getFullYear()} Salud Conecta. Todos los derechos reservados.</span>
      </footer>

    </div>
  )
}

export default LandingPage