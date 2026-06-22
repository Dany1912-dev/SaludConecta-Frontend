import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, ClipboardList,
  Droplets, Phone, Mail, Stethoscope, User, Check,
} from 'lucide-react'
import { useCrearPerfil } from '../hooks/useCrearPerfil'
import { Input } from '../../../shared/components/ui/Input'
import { Boton } from '../../../shared/components/ui/Boton'
import type { Genero, TipoSangre, Parentesco } from '../../../api/perfilesApi'
import styles from './CrearPerfilPage.module.css'

// ── Constantes ──────────────────────────────────────────────

const COLORES_AVATAR = [
  '#6366F1', '#8B5CF6', '#EC4899', '#EF4444',
  '#F97316', '#EAB308', '#22C55E', '#06B6D4',
  '#3B82F6', '#64748B',
]

const PASOS = [
  { numero: 1, etiqueta: 'Personal' },
  { numero: 2, etiqueta: 'Contacto' },
  { numero: 3, etiqueta: 'Salud' },
]

// ── Sub-componente: Indicador de pasos ──────────────────────

const IndicadorPasos = ({ pasoActual }: { pasoActual: number }) => (
  <div className={styles.indicador}>
    {PASOS.map((paso, i) => {
      const completado = pasoActual > paso.numero
      const activo = pasoActual === paso.numero
      return (
        <div key={paso.numero} className={styles.indicadorItem}>
          {/* Línea izquierda */}
          {i > 0 && (
            <div className={`${styles.lineaConector} ${completado || activo ? styles.lineaActiva : ''}`} />
          )}
          {/* Círculo */}
          <div className={`${styles.indicadorCirculo} ${activo ? styles.circuloActivo : ''} ${completado ? styles.circuloCompletado : ''}`}>
            {completado ? <Check size={14} strokeWidth={3} /> : paso.numero}
          </div>
          {/* Etiqueta */}
          <span className={`${styles.indicadorEtiqueta} ${activo ? styles.etiquetaActiva : ''}`}>
            {paso.etiqueta}
          </span>
          {/* Línea derecha */}
          {i < PASOS.length - 1 && (
            <div className={`${styles.lineaConector} ${completado ? styles.lineaActiva : ''}`} />
          )}
        </div>
      )
    })}
  </div>
)

// ── Sub-componente: Pantalla de intro ───────────────────────

const PantallaIntro = ({
  onComenzar,
  onVolver,
}: {
  onComenzar: () => void
  onVolver: () => void
}) => (
  <div className={styles.intro}>
    <button className={styles.botonVolver} onClick={onVolver}>
      <ArrowLeft size={18} /> Volver a perfiles
    </button>

    <div className={styles.introIcono}>
      <ClipboardList size={36} color="var(--color-primario)" strokeWidth={1.5} />
    </div>

    <h1 className={styles.introTitulo}>Antes de empezar</h1>
    <p className={styles.introSubtitulo}>
      Para completar el perfil del paciente te recomendamos tener a la mano:
    </p>

    <ul className={styles.introLista}>
      <li className={styles.introItem}>
        <div className={styles.introItemIcono}><Droplets size={16} color="var(--color-primario)" /></div>
        <span>Tipo de sangre del paciente</span>
      </li>
      <li className={styles.introItem}>
        <div className={styles.introItemIcono}><Phone size={16} color="var(--color-primario)" /></div>
        <span>Teléfono personal y de emergencia</span>
      </li>
      <li className={styles.introItem}>
        <div className={styles.introItemIcono}><Mail size={16} color="var(--color-primario)" /></div>
        <span>Correo electrónico de contacto</span>
      </li>
      <li className={styles.introItem}>
        <div className={styles.introItemIcono}><Stethoscope size={16} color="var(--color-primario)" /></div>
        <span>Alergias o condiciones médicas conocidas</span>
      </li>
    </ul>

    <p className={styles.introNota}>
      No te preocupes si no tienes todo — puedes completar la información después.
    </p>

    <Boton onClick={onComenzar} style={{ paddingInline: '2rem' }}>
      Comenzar <ArrowRight size={16} />
    </Boton>
  </div>
)

// ── Componente principal ─────────────────────────────────────

const CrearPerfilPage = () => {
  const navigate = useNavigate()
  const [paso, setPaso] = useState(0)
  const [errorPaso, setErrorPaso] = useState<string | null>(null)

  const {
    form, cargando, error,
    handleChange, setGenero, setTipoSangre, setParentesco, setColorAvatar,
    validarPaso, guardarPerfil,
  } = useCrearPerfil()

  const siguiente = () => {
    setErrorPaso(null)
    if (paso === 0) { setPaso(1); return }
    const err = validarPaso(paso)
    if (err) { setErrorPaso(err); return }
    setPaso((p) => p + 1)
  }

  const anterior = () => {
    setErrorPaso(null)
    setPaso((p) => p - 1)
  }

  const inicial = form.nombreCompleto.trim().charAt(0).toUpperCase() || '?'

  // ── Pantalla de intro ──
  if (paso === 0) {
    return (
      <div className={styles.pagina}>
        <PantallaIntro onComenzar={() => setPaso(1)} onVolver={() => navigate('/perfiles')} />
      </div>
    )
  }

  // ── Wizard ──
  return (
    <div className={styles.pagina}>
      <div className={styles.wizardContenedor}>

        <IndicadorPasos pasoActual={paso} />

        <div className={styles.wizardTarjeta}>

          {/* ── PASO 1: Información personal ── */}
          {paso === 1 && (
            <div className={styles.paso}>
              <div className={styles.pasoEncabezado}>
                <h2 className={styles.pasoTitulo}>Información personal</h2>
                <p className={styles.pasoDescripcion}>Datos de identificación del paciente</p>
              </div>

              {/* Avatar preview + color */}
              <div className={styles.avatarSeccion}>
                <div className={styles.avatarCirculo} style={{ backgroundColor: form.colorAvatar }}>
                  {form.nombreCompleto.trim()
                    ? <span className={styles.avatarLetra}>{inicial}</span>
                    : <User size={28} color="rgba(255,255,255,0.7)" />
                  }
                </div>
                <div className={styles.colores}>
                  {COLORES_AVATAR.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`${styles.colorSwatch} ${form.colorAvatar === color ? styles.colorSeleccionado : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setColorAvatar(color)}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.campos}>
                <Input
                  label="Nombre completo"
                  name="nombreCompleto"
                  type="text"
                  placeholder="Ej. Juan Carlos García"
                  value={form.nombreCompleto}
                  onChange={(e) => handleChange('nombreCompleto', e.target.value)}
                />

                <Input
                  label="Fecha de nacimiento"
                  name="fechaNacimiento"
                  type="date"
                  value={form.fechaNacimiento}
                  onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
                />

                <div className={styles.fila}>
                  <div className={styles.campo}>
                    <label className={styles.label}>Género</label>
                    <select className={styles.select} value={form.genero}
                      onChange={(e) => setGenero(e.target.value as Genero)}>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div className={styles.campo}>
                    <label className={styles.label}>Parentesco</label>
                    <select className={styles.select} value={form.parentesco}
                      onChange={(e) => setParentesco(e.target.value as Parentesco)}>
                      <option value="Yo">Yo</option>
                      <option value="Pareja">Pareja</option>
                      <option value="Hijo">Hijo/a</option>
                      <option value="Padre">Padre</option>
                      <option value="Madre">Madre</option>
                      <option value="Hermano">Hermano/a</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Lugar de nacimiento"
                  name="lugarNacimiento"
                  type="text"
                  placeholder="Ciudad, País"
                  value={form.lugarNacimiento ?? ''}
                  onChange={(e) => handleChange('lugarNacimiento', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ── PASO 2: Datos de contacto ── */}
          {paso === 2 && (
            <div className={styles.paso}>
              <div className={styles.pasoEncabezado}>
                <h2 className={styles.pasoTitulo}>Datos de contacto</h2>
                <p className={styles.pasoDescripcion}>Información para comunicarse con o sobre el paciente</p>
              </div>

              <div className={styles.campos}>
                <div className={styles.fila}>
                  <Input
                    label="Teléfono personal"
                    name="telefono"
                    type="tel"
                    placeholder="+52 555 123 4567"
                    value={form.telefono ?? ''}
                    onChange={(e) => handleChange('telefono', e.target.value)}
                  />
                  <Input
                    label="Teléfono de emergencia"
                    name="telefonoEmergencia"
                    type="tel"
                    placeholder="+52 555 987 6543"
                    value={form.telefonoEmergencia ?? ''}
                    onChange={(e) => handleChange('telefonoEmergencia', e.target.value)}
                  />
                </div>

                <Input
                  label="Correo de contacto"
                  name="correoContacto"
                  type="email"
                  placeholder="contacto@correo.com"
                  value={form.correoContacto ?? ''}
                  onChange={(e) => handleChange('correoContacto', e.target.value)}
                />

                <Input
                  label="Ocupación"
                  name="ocupacion"
                  type="text"
                  placeholder="Ej. Ingeniero, Estudiante, Médico..."
                  value={form.ocupacion ?? ''}
                  onChange={(e) => handleChange('ocupacion', e.target.value)}
                />

                <Input
                  label="Dirección"
                  name="direccion"
                  type="text"
                  placeholder="Calle, número, colonia, ciudad"
                  value={form.direccion ?? ''}
                  onChange={(e) => handleChange('direccion', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ── PASO 3: Salud básica ── */}
          {paso === 3 && (
            <div className={styles.paso}>
              <div className={styles.pasoEncabezado}>
                <h2 className={styles.pasoTitulo}>Salud básica</h2>
                <p className={styles.pasoDescripcion}>Información médica esencial del paciente</p>
              </div>

              <div className={styles.campos}>
                <div className={styles.campo}>
                  <label className={styles.label}>Tipo de sangre</label>
                  <select className={styles.select} value={form.tipoSangre}
                    onChange={(e) => setTipoSangre(e.target.value as TipoSangre)}>
                    <option value="Desconocido">No lo sé</option>
                    <option value="APositivo">A+</option>
                    <option value="ANegativo">A-</option>
                    <option value="BPositivo">B+</option>
                    <option value="BNegativo">B-</option>
                    <option value="ABPositivo">AB+</option>
                    <option value="ABNegativo">AB-</option>
                    <option value="OPositivo">O+</option>
                    <option value="ONegativo">O-</option>
                  </select>
                </div>

                <div className={styles.notaFinal}>
                  <Stethoscope size={18} color="var(--color-primario)" />
                  <p>
                    Una vez creado el perfil podrás agregar <strong>alergias</strong>,
                    <strong> antecedentes médicos</strong>, <strong>estilo de vida</strong>
                    y más desde el detalle del perfil.
                  </p>
                </div>
              </div>

              {(error) && (
                <div className={styles.error}>{error}</div>
              )}
            </div>
          )}

          {/* ── Error de validación de paso ── */}
          {errorPaso && (
            <div className={styles.error}>{errorPaso}</div>
          )}

          {/* ── Navegación ── */}
          <div className={styles.navegacion}>
            <Boton type="button" variante="secundario" onClick={anterior}>
              <ArrowLeft size={16} /> Anterior
            </Boton>
            {paso < 3
              ? (
                <Boton type="button" onClick={siguiente}>
                  Siguiente <ArrowRight size={16} />
                </Boton>
              ) : (
                <Boton type="button" cargando={cargando} onClick={guardarPerfil}>
                  Guardar perfil
                </Boton>
              )
            }
          </div>

        </div>
      </div>
    </div>
  )
}

export default CrearPerfilPage
