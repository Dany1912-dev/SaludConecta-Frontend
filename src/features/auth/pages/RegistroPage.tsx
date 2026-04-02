import { Link } from 'react-router-dom'
import { Mail, Lock, User, Phone, HeartPulse, ArrowRight } from 'lucide-react'
import { useRegistro } from '../hooks/useRegistro'
import { Input } from '../../../shared/components/ui/Input'
import { Boton } from '../../../shared/components/ui/Boton'
import styles from './RegistroPage.module.css'
import { BotonTema } from '../../../shared/components/ui/BotonTema'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
    <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

const beneficios = [
  'Historial clínico centralizado',
  'Gestión inteligente de medicamentos',
  'Evolución biométrica con gráficas',
  'Modo familiar — toda la familia en un lugar',
]

const RegistroPage = () => {
  const { form, errores, errorGeneral, cargando, handleChange, handleSubmit } = useRegistro()

  return (
    <div className={styles.pagina}>

      {/* ── Branding IZQUIERDA ────────────────────── */}
      <div className={styles.branding}>
        <div className={styles.brandingFondo} />
        <div className={styles.orbe1} />
        <div className={styles.orbe2} />

        <div className={styles.brandingContenido}>
          <div className={styles.logo}>
            <HeartPulse size={26} color="#fff" strokeWidth={2.5} />
            <span className={styles.logoTexto}>Salud Conecta</span>
          </div>

          <div className={styles.brandingCopy}>
            <div className={styles.badge}>
              <span className={styles.badgeTexto}>Empieza hoy, es gratis</span>
            </div>
            <h1 className={styles.titulo}>
              Empieza a cuidar<br />
              <em className={styles.tituloItalico}>a los tuyos hoy.</em>
            </h1>
            <div className={styles.beneficios}>
              {beneficios.map((b) => (
                <div key={b} className={styles.beneficioItem}>
                  <div className={styles.beneficioIcono}>✓</div>
                  <span className={styles.beneficioTexto}>{b}</span>
                </div>
              ))}
            </div>
          </div>

          <p className={styles.nota}>
            Tus datos están protegidos y nunca serán compartidos con terceros.
          </p>
        </div>
      </div>

      {/* ── Formulario DERECHA ────────────────────── */}
      <div className={styles.formularioPanel}>
        <div className={styles.formularioContenedor}>

          <div className={styles.logoMovil}>
            <HeartPulse size={24} color="var(--color-primario)" strokeWidth={2.5} />
            <span className={styles.logoMovilTexto}>Salud Conecta</span>
            <BotonTema />
          </div>

          <div className={styles.encabezado}>
            <h2 className={styles.tituloPagina}>Crea tu cuenta</h2>
            <p className={styles.subtitulo}>Completa los datos para comenzar</p>
          </div>

          <button
            type="button"
            className={styles.botonGoogle}
            onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}
          >
            <GoogleIcon />
            Continuar con Google
          </button>

          <div className={styles.divisor}>
            <div className={styles.divisorLinea} />
            <span className={styles.divisorTexto}>o con correo electrónico</span>
            <div className={styles.divisorLinea} />
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.campo}>
              <Input label="Nombre completo" name="nombre" type="text"
                placeholder="Juan Pérez" value={form.nombre} onChange={handleChange}
                icono={<User size={15} />} error={errores.nombre} autoComplete="name" />
            </div>

            <div className={styles.campo}>
              <Input label="Correo electrónico" name="correo" type="email"
                placeholder="tu@correo.com" value={form.correo} onChange={handleChange}
                icono={<Mail size={15} />} error={errores.correo} autoComplete="email" />
            </div>

            <div className={styles.campo}>
              <Input label="Contraseña" name="contrasena" type="password"
                placeholder="Mínimo 8 caracteres" value={form.contrasena} onChange={handleChange}
                icono={<Lock size={15} />} error={errores.contrasena} autoComplete="new-password" />
            </div>

            <div className={styles.campo}>
              <Input label="Teléfono (opcional)" name="telefono" type="tel"
                placeholder="+52 55 1234 5678" value={form.telefono} onChange={handleChange}
                icono={<Phone size={15} />} autoComplete="tel" />
            </div>

            {errorGeneral && (
              <div className={styles.errorGeneral}>{errorGeneral}</div>
            )}

            <div className={styles.botonSubmit}>
              <Boton type="submit" fullWidth cargando={cargando} style={{ padding: '12px' }}>
                Crear cuenta
                {!cargando && <ArrowRight size={16} />}
              </Boton>
            </div>
          </form>

          <p className={styles.pie}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className={styles.pieLinkTexto}>
              Inicia sesión
            </Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default RegistroPage