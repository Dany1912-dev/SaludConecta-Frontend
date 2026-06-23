import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, AlertTriangle, Activity, Brain, Plus,
  Trash2, Heart, Stethoscope, Users,
} from 'lucide-react'
import { obtenerPerfiles } from '../../../api/perfilesApi'
import type { PerfilPaciente } from '../../../api/perfilesApi'
import {
  obtenerAlergias, crearAlergia, desactivarAlergia,
  etiquetaTipoAlergia, colorSeveridad,
} from '../../../api/alergiasApi'
import type { Alergia, TipoAlergia, SeveridadAlergia, CrearAlergiaPayload } from '../../../api/alergiasApi'
import {
  obtenerPersonales, guardarPersonal, eliminarPersonal,
  obtenerHeredofamiliares, crearHeredofamiliar, eliminarHeredofamiliar,
  obtenerPsicologicos, crearPsicologico, desactivarPsicologico,
  obtenerCatalogoCondiciones,
  etiquetaParentescoFamiliar,
} from '../../../api/antecedentesApi'
import type {
  AntecedentePersonal, AntecedenteHeredofamiliar, AntecedentePsicologico,
  CondicionMedica, ParentescoFamiliar,
} from '../../../api/antecedentesApi'
import {
  obtenerEstiloVida, guardarEstiloVida,
} from '../../../api/estiloVidaApi'
import type { EstiloVida, CalidadVida, CalidadAlimentacion, GuardarEstiloVidaPayload } from '../../../api/estiloVidaApi'
import { Input } from '../../../shared/components/ui/Input'
import { Boton } from '../../../shared/components/ui/Boton'
import { etiquetaTipoSangre } from '../../../api/perfilesApi'
import styles from './PerfilDetallePage.module.css'

// ── Constantes ──────────────────────────────────────────────

type TabPrincipal = 'alergias' | 'antecedentes' | 'estilo'
type SubTabAnte = 'personal' | 'heredofamiliar' | 'psicologico'

// ── Componente: Tab Alergias ────────────────────────────────

const TabAlergias = ({ perfilId }: { perfilId: number }) => {
  const [alergias, setAlergias] = useState<Alergia[]>([])
  const [cargando, setCargando] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState<CrearAlergiaPayload>({
    tipoAlergia: 'Alimentaria',
    descripcion: '',
    severidad: 'Moderada',
  })
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    try {
      const { data } = await obtenerAlergias(perfilId)
      setAlergias(data)
    } catch { /* sin alergias */ }
    finally { setCargando(false) }
  }, [perfilId])

  useEffect(() => { cargar() }, [cargar])

  const guardar = async () => {
    if (!form.descripcion.trim()) { setError('La descripción es requerida'); return }
    setGuardando(true); setError(null)
    try {
      const { data } = await crearAlergia(perfilId, form)
      setAlergias(prev => [...prev, data])
      setForm({ tipoAlergia: 'Alimentaria', descripcion: '', severidad: 'Moderada' })
      setMostrarForm(false)
    } catch { setError('Error al guardar la alergia') }
    finally { setGuardando(false) }
  }

  const eliminar = async (id: number) => {
    await desactivarAlergia(perfilId, id)
    setAlergias(prev => prev.filter(a => a.id !== id))
  }

  if (cargando) return <div className={styles.cargando}>Cargando alergias...</div>

  return (
    <div className={styles.panelContenido}>
      <div className={styles.seccionHeader}>
        <h3 className={styles.seccionTitulo}>Alergias</h3>
        <Boton variante="secundario" onClick={() => setMostrarForm(v => !v)}>
          <Plus size={15} /> Añadir
        </Boton>
      </div>

      {mostrarForm && (
        <div className={styles.formulario}>
          <p className={styles.formularioTitulo}>Nueva alergia</p>
          <div className={styles.fila}>
            <div className={styles.campo}>
              <label className={styles.label}>Tipo</label>
              <select className={styles.select} value={form.tipoAlergia}
                onChange={e => setForm(p => ({ ...p, tipoAlergia: e.target.value as TipoAlergia }))}>
                <option value="Alimentaria">Alimentaria</option>
                <option value="Medicamentosa">Medicamentosa</option>
                <option value="Contacto">Contacto</option>
                <option value="Ambiente">Ambiental</option>
              </select>
            </div>
            <div className={styles.campo}>
              <label className={styles.label}>Severidad</label>
              <select className={styles.select} value={form.severidad}
                onChange={e => setForm(p => ({ ...p, severidad: e.target.value as SeveridadAlergia }))}>
                <option value="Leve">Leve</option>
                <option value="Moderada">Moderada</option>
                <option value="Grave">Grave</option>
              </select>
            </div>
          </div>
          <Input
            label="Descripción"
            name="descripcion"
            type="text"
            placeholder="Ej. Penicilina, mariscos, polen..."
            value={form.descripcion}
            onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
          />
          <Input
            label="Fecha de diagnóstico (opcional)"
            name="fechaDiagnostico"
            type="date"
            value={form.fechaDiagnostico ?? ''}
            onChange={e => setForm(p => ({ ...p, fechaDiagnostico: e.target.value || undefined }))}
          />
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.formularioAcciones}>
            <Boton variante="secundario" onClick={() => setMostrarForm(false)}>Cancelar</Boton>
            <Boton cargando={guardando} onClick={guardar}>Guardar</Boton>
          </div>
        </div>
      )}

      {alergias.length === 0 ? (
        <div className={styles.estadoVacio}>
          <div className={styles.estadoVacioIcono}><AlertTriangle size={24} color="var(--color-texto-suave)" /></div>
          <p className={styles.estadoVacioTitulo}>Sin alergias registradas</p>
          <p className={styles.estadoVacioDescripcion}>Añade alergias conocidas del paciente</p>
        </div>
      ) : (
        <div className={styles.listaItems}>
          {alergias.map(a => (
            <div key={a.id} className={styles.itemCard}>
              <div className={styles.itemIcono}>
                <AlertTriangle size={18} color={colorSeveridad[a.severidad]} />
              </div>
              <div className={styles.itemCuerpo}>
                <p className={styles.itemTitulo}>{a.descripcion}</p>
                <p className={styles.itemSubtitulo}>
                  {etiquetaTipoAlergia[a.tipoAlergia]} · Severidad: {a.severidad}
                  {a.fechaDiagnostico && ` · Desde: ${new Date(a.fechaDiagnostico).toLocaleDateString('es-MX')}`}
                </p>
              </div>
              <div className={styles.itemAcciones}>
                <button className={styles.botonIcono} title="Eliminar" onClick={() => eliminar(a.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Componente: Tab Antecedentes ────────────────────────────

const TabAntecedentes = ({ perfilId }: { perfilId: number }) => {
  const [subTab, setSubTab] = useState<SubTabAnte>('personal')
  const [catalogo, setCatalogo] = useState<CondicionMedica[]>([])
  const [personales, setPersonales] = useState<AntecedentePersonal[]>([])
  const [heredo, setHerodo] = useState<AntecedenteHeredofamiliar[]>([])
  const [psic, setPsic] = useState<AntecedentePsicologico[]>([])
  const [cargando, setCargando] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)

  // Form personal
  const [formP, setFormP] = useState({ condicionMedicaId: 0, presente: true, notas: '' })
  // Form heredo-familiar
  const [formH, setFormH] = useState({ condicionMedicaId: 0, parentescoFamiliar: 'Padre' as ParentescoFamiliar, presente: true, notas: '' })
  // Form psicológico
  const [formPsic, setFormPsic] = useState({ nombreCondicion: '', notasTratamiento: '' })
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const [cat, per, her, psi] = await Promise.all([
        obtenerCatalogoCondiciones(),
        obtenerPersonales(perfilId),
        obtenerHeredofamiliares(perfilId),
        obtenerPsicologicos(perfilId),
      ])
      setCatalogo(cat.data)
      setPersonales(per.data)
      setHerodo(her.data)
      setPsic(psi.data)
    } catch { /* silencioso */ }
    finally { setCargando(false) }
  }, [perfilId])

  useEffect(() => { cargar() }, [cargar])

  const guardarPersonal = async () => {
    if (!formP.condicionMedicaId) { setError('Selecciona una condición'); return }
    setGuardando(true); setError(null)
    try {
      const { data } = await guardarPersonal(perfilId, formP)
      setPersonales(prev => {
        const idx = prev.findIndex(p => p.condicionMedica.id === data.condicionMedica.id)
        if (idx >= 0) { const n = [...prev]; n[idx] = data; return n }
        return [...prev, data]
      })
      setFormP({ condicionMedicaId: 0, presente: true, notas: '' })
      setMostrarForm(false)
    } catch { setError('Error al guardar') }
    finally { setGuardando(false) }
  }

  const guardarHeredo = async () => {
    if (!formH.condicionMedicaId) { setError('Selecciona una condición'); return }
    setGuardando(true); setError(null)
    try {
      const { data } = await crearHeredofamiliar(perfilId, formH)
      setHerodo(prev => [...prev, data])
      setFormH({ condicionMedicaId: 0, parentescoFamiliar: 'Padre', presente: true, notas: '' })
      setMostrarForm(false)
    } catch { setError('Error al guardar') }
    finally { setGuardando(false) }
  }

  const guardarPsic = async () => {
    if (!formPsic.nombreCondicion.trim()) { setError('El nombre es requerido'); return }
    setGuardando(true); setError(null)
    try {
      const { data } = await crearPsicologico(perfilId, formPsic)
      setPsic(prev => [...prev, data])
      setFormPsic({ nombreCondicion: '', notasTratamiento: '' })
      setMostrarForm(false)
    } catch { setError('Error al guardar') }
    finally { setGuardando(false) }
  }

  if (cargando) return <div className={styles.cargando}>Cargando antecedentes...</div>

  return (
    <div className={styles.panelContenido}>
      {/* Sub-tabs */}
      <div className={styles.subTabs}>
        {([
          ['personal', 'Personal', personales.length],
          ['heredofamiliar', 'Heredo-familiar', herodo.length],
          ['psicologico', 'Psicológico', psic.length],
        ] as const).map(([id, label, count]) => (
          <button key={id} className={`${styles.subTab} ${subTab === id ? styles.subTabActivo : ''}`}
            onClick={() => { setSubTab(id); setMostrarForm(false); setError(null) }}>
            {label} {count > 0 && <span className={styles.tabBadge}>{count}</span>}
          </button>
        ))}
      </div>

      {/* Personal */}
      {subTab === 'personal' && (
        <>
          <div className={styles.seccionHeader}>
            <h3 className={styles.seccionTitulo}>Antecedentes personales</h3>
            <Boton variante="secundario" onClick={() => setMostrarForm(v => !v)}><Plus size={15} /> Añadir</Boton>
          </div>
          {mostrarForm && (
            <div className={styles.formulario}>
              <p className={styles.formularioTitulo}>Añadir antecedente personal</p>
              <div className={styles.campo}>
                <label className={styles.label}>Condición médica</label>
                <select className={styles.select} value={formP.condicionMedicaId}
                  onChange={e => setFormP(p => ({ ...p, condicionMedicaId: +e.target.value }))}>
                  <option value={0}>— Seleccionar —</option>
                  {catalogo.map(c => (
                    <option key={c.id} value={c.id}>{c.nombreCondicion} ({c.categoria})</option>
                  ))}
                </select>
              </div>
              <div className={styles.campo}>
                <label className={styles.label}>¿Presente?</label>
                <select className={styles.select} value={formP.presente ? 'si' : 'no'}
                  onChange={e => setFormP(p => ({ ...p, presente: e.target.value === 'si' }))}>
                  <option value="si">Sí</option>
                  <option value="no">No / Resuelta</option>
                </select>
              </div>
              <Input label="Notas (opcional)" name="notas" type="text"
                value={formP.notas} onChange={e => setFormP(p => ({ ...p, notas: e.target.value }))} />
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.formularioAcciones}>
                <Boton variante="secundario" onClick={() => setMostrarForm(false)}>Cancelar</Boton>
                <Boton cargando={guardando} onClick={guardarPersonal}>Guardar</Boton>
              </div>
            </div>
          )}
          {personales.length === 0 ? (
            <div className={styles.estadoVacio}>
              <div className={styles.estadoVacioIcono}><Heart size={24} color="var(--color-texto-suave)" /></div>
              <p className={styles.estadoVacioTitulo}>Sin antecedentes personales</p>
              <p className={styles.estadoVacioDescripcion}>Registra condiciones médicas previas o actuales</p>
            </div>
          ) : (
            <div className={styles.listaItems}>
              {personales.map(a => (
                <div key={a.id} className={styles.itemCard}>
                  <div className={styles.itemIcono}><Heart size={18} color="var(--color-primario)" /></div>
                  <div className={styles.itemCuerpo}>
                    <p className={styles.itemTitulo}>{a.condicionMedica.nombreCondicion}</p>
                    <p className={styles.itemSubtitulo}>
                      {a.condicionMedica.categoria} · {a.presente ? 'Presente' : 'Resuelta'}
                      {a.notas && ` · ${a.notas}`}
                    </p>
                  </div>
                  <div className={styles.itemAcciones}>
                    <button className={styles.botonIcono} onClick={async () => {
                      await eliminarPersonal(perfilId, a.id)
                      setPersonales(prev => prev.filter(p => p.id !== a.id))
                    }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Heredo-familiar */}
      {subTab === 'heredofamiliar' && (
        <>
          <div className={styles.seccionHeader}>
            <h3 className={styles.seccionTitulo}>Antecedentes heredo-familiares</h3>
            <Boton variante="secundario" onClick={() => setMostrarForm(v => !v)}><Plus size={15} /> Añadir</Boton>
          </div>
          {mostrarForm && (
            <div className={styles.formulario}>
              <p className={styles.formularioTitulo}>Añadir antecedente familiar</p>
              <div className={styles.fila}>
                <div className={styles.campo}>
                  <label className={styles.label}>Familiar</label>
                  <select className={styles.select} value={formH.parentescoFamiliar}
                    onChange={e => setFormH(p => ({ ...p, parentescoFamiliar: e.target.value as ParentescoFamiliar }))}>
                    {Object.entries(etiquetaParentescoFamiliar).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.campo}>
                  <label className={styles.label}>¿Presente?</label>
                  <select className={styles.select} value={formH.presente ? 'si' : 'no'}
                    onChange={e => setFormH(p => ({ ...p, presente: e.target.value === 'si' }))}>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
              <div className={styles.campo}>
                <label className={styles.label}>Condición médica</label>
                <select className={styles.select} value={formH.condicionMedicaId}
                  onChange={e => setFormH(p => ({ ...p, condicionMedicaId: +e.target.value }))}>
                  <option value={0}>— Seleccionar —</option>
                  {catalogo.map(c => (
                    <option key={c.id} value={c.id}>{c.nombreCondicion} ({c.categoria})</option>
                  ))}
                </select>
              </div>
              <Input label="Notas (opcional)" name="notasH" type="text"
                value={formH.notas} onChange={e => setFormH(p => ({ ...p, notas: e.target.value }))} />
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.formularioAcciones}>
                <Boton variante="secundario" onClick={() => setMostrarForm(false)}>Cancelar</Boton>
                <Boton cargando={guardando} onClick={guardarHeredo}>Guardar</Boton>
              </div>
            </div>
          )}
          {herodo.length === 0 ? (
            <div className={styles.estadoVacio}>
              <div className={styles.estadoVacioIcono}><Users size={24} color="var(--color-texto-suave)" /></div>
              <p className={styles.estadoVacioTitulo}>Sin antecedentes familiares</p>
              <p className={styles.estadoVacioDescripcion}>Registra condiciones médicas de familiares directos</p>
            </div>
          ) : (
            <div className={styles.listaItems}>
              {herodo.map(a => (
                <div key={a.id} className={styles.itemCard}>
                  <div className={styles.itemIcono}><Users size={18} color="var(--color-primario)" /></div>
                  <div className={styles.itemCuerpo}>
                    <p className={styles.itemTitulo}>{a.condicionMedica.nombreCondicion}</p>
                    <p className={styles.itemSubtitulo}>
                      {etiquetaParentescoFamiliar[a.parentescoFamiliar]} · {a.presente ? 'Presente' : 'No aplica'}
                      {a.notas && ` · ${a.notas}`}
                    </p>
                  </div>
                  <div className={styles.itemAcciones}>
                    <button className={styles.botonIcono} onClick={async () => {
                      await eliminarHeredofamiliar(perfilId, a.id)
                      setHerodo(prev => prev.filter(h => h.id !== a.id))
                    }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Psicológico */}
      {subTab === 'psicologico' && (
        <>
          <div className={styles.seccionHeader}>
            <h3 className={styles.seccionTitulo}>Antecedentes psicológicos</h3>
            <Boton variante="secundario" onClick={() => setMostrarForm(v => !v)}><Plus size={15} /> Añadir</Boton>
          </div>
          {mostrarForm && (
            <div className={styles.formulario}>
              <p className={styles.formularioTitulo}>Añadir antecedente psicológico</p>
              <Input label="Condición / diagnóstico" name="nombreCondicion" type="text"
                placeholder="Ej. Depresión, ansiedad, TDAH..."
                value={formPsic.nombreCondicion}
                onChange={e => setFormPsic(p => ({ ...p, nombreCondicion: e.target.value }))} />
              <Input label="Notas de tratamiento (opcional)" name="notasTrat" type="text"
                value={formPsic.notasTratamiento}
                onChange={e => setFormPsic(p => ({ ...p, notasTratamiento: e.target.value }))} />
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.formularioAcciones}>
                <Boton variante="secundario" onClick={() => setMostrarForm(false)}>Cancelar</Boton>
                <Boton cargando={guardando} onClick={guardarPsic}>Guardar</Boton>
              </div>
            </div>
          )}
          {psic.length === 0 ? (
            <div className={styles.estadoVacio}>
              <div className={styles.estadoVacioIcono}><Brain size={24} color="var(--color-texto-suave)" /></div>
              <p className={styles.estadoVacioTitulo}>Sin antecedentes psicológicos</p>
              <p className={styles.estadoVacioDescripcion}>Registra condiciones de salud mental previas o actuales</p>
            </div>
          ) : (
            <div className={styles.listaItems}>
              {psic.map(a => (
                <div key={a.id} className={styles.itemCard}>
                  <div className={styles.itemIcono}><Brain size={18} color="var(--color-primario)" /></div>
                  <div className={styles.itemCuerpo}>
                    <p className={styles.itemTitulo}>{a.nombreCondicion}</p>
                    <p className={styles.itemSubtitulo}>
                      {a.activo ? 'Activo' : 'Resuelto'}
                      {a.notasTratamiento && ` · ${a.notasTratamiento}`}
                    </p>
                  </div>
                  <div className={styles.itemAcciones}>
                    <button className={styles.botonIcono} onClick={async () => {
                      await desactivarPsicologico(perfilId, a.id)
                      setPsic(prev => prev.filter(p => p.id !== a.id))
                    }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Componente: Tab Estilo de Vida ──────────────────────────

const TabEstiloVida = ({ perfilId }: { perfilId: number }) => {
  const [estilo, setEstilo] = useState<EstiloVida | null>(null)
  const [form, setForm] = useState<GuardarEstiloVidaPayload>({})
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)

  useEffect(() => {
    obtenerEstiloVida(perfilId)
      .then(r => {
        setEstilo(r.data)
        setForm({
          calidadVida: r.data.calidadVida,
          horasSueno: r.data.horasSueno,
          calidadAlimentacion: r.data.calidadAlimentacion,
          vasosAguaDiarios: r.data.vasosAguaDiarios,
          actividadFisica: r.data.actividadFisica,
          consumoAlcohol: r.data.consumoAlcohol,
          consumoDrogas: r.data.consumoDrogas,
          tabaquismo: r.data.tabaquismo,
          medicamentosActuales: r.data.medicamentosActuales,
          zoonosis: r.data.zoonosis,
          antecedentesLaborales: r.data.antecedentesLaborales,
        })
      })
      .catch(() => { /* primera vez, estilo null */ })
      .finally(() => setCargando(false))
  }, [perfilId])

  const guardar = async () => {
    setGuardando(true)
    try {
      const { data } = await guardarEstiloVida(perfilId, form)
      setEstilo(data)
      setGuardado(true)
      setTimeout(() => setGuardado(false), 2000)
    } catch { /* error */ }
    finally { setGuardando(false) }
  }

  if (cargando) return <div className={styles.cargando}>Cargando estilo de vida...</div>

  return (
    <div className={styles.panelContenido}>
      <div className={styles.seccionHeader}>
        <h3 className={styles.seccionTitulo}>Estilo de vida</h3>
        <Boton cargando={guardando} onClick={guardar}>
          {guardado ? '¡Guardado!' : 'Guardar cambios'}
        </Boton>
      </div>

      <div className={styles.gridEstilo}>
        {/* Hábitos generales */}
        <div className={styles.grupoEstilo}>
          <p className={styles.grupoEstiloTitulo}>Bienestar general</p>
          <div className={styles.campo}>
            <label className={styles.label}>Calidad de vida</label>
            <select className={styles.select} value={form.calidadVida ?? ''}
              onChange={e => setForm(p => ({ ...p, calidadVida: (e.target.value || undefined) as CalidadVida | undefined }))}>
              <option value="">— Sin definir —</option>
              <option value="Bueno">Buena</option>
              <option value="Regular">Regular</option>
              <option value="Malo">Mala</option>
            </select>
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>Horas de sueño</label>
            <Input name="horasSueno" type="number"
              placeholder="Ej. 7.5"
              value={form.horasSueno?.toString() ?? ''}
              onChange={e => setForm(p => ({ ...p, horasSueno: e.target.value ? +e.target.value : undefined }))} />
          </div>
        </div>

        {/* Alimentación e hidratación */}
        <div className={styles.grupoEstilo}>
          <p className={styles.grupoEstiloTitulo}>Alimentación</p>
          <div className={styles.campo}>
            <label className={styles.label}>Calidad de alimentación</label>
            <select className={styles.select} value={form.calidadAlimentacion ?? ''}
              onChange={e => setForm(p => ({ ...p, calidadAlimentacion: (e.target.value || undefined) as CalidadAlimentacion | undefined }))}>
              <option value="">— Sin definir —</option>
              <option value="Buena">Buena</option>
              <option value="Regular">Regular</option>
              <option value="Mala">Mala</option>
            </select>
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>Vasos de agua al día</label>
            <Input name="vasosAgua" type="number"
              placeholder="Ej. 8"
              value={form.vasosAguaDiarios?.toString() ?? ''}
              onChange={e => setForm(p => ({ ...p, vasosAguaDiarios: e.target.value ? +e.target.value : undefined }))} />
          </div>
        </div>

        {/* Actividad y hábitos */}
        <div className={styles.grupoEstilo}>
          <p className={styles.grupoEstiloTitulo}>Actividad física y hábitos</p>
          <div className={styles.campo}>
            <label className={styles.label}>Actividad física</label>
            <Input name="actividad" type="text"
              placeholder="Ej. Caminata 3 veces/semana, gym..."
              value={form.actividadFisica ?? ''}
              onChange={e => setForm(p => ({ ...p, actividadFisica: e.target.value || undefined }))} />
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>Tabaquismo</label>
            <Input name="tabaquismo" type="text"
              placeholder="Ej. Ninguno, 5 cig/día..."
              value={form.tabaquismo ?? ''}
              onChange={e => setForm(p => ({ ...p, tabaquismo: e.target.value }))} />
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>Consumo de alcohol</label>
            <Input name="alcohol" type="text"
              placeholder="Ej. Ninguno, ocasional..."
              value={form.consumoAlcohol ?? ''}
              onChange={e => setForm(p => ({ ...p, consumoAlcohol: e.target.value }))} />
          </div>
        </div>

        {/* Medicamentos y otros */}
        <div className={styles.grupoEstilo}>
          <p className={styles.grupoEstiloTitulo}>Medicamentos y otros</p>
          <div className={styles.campo}>
            <label className={styles.label}>Medicamentos actuales</label>
            <Input name="medicamentos" type="text"
              placeholder="Ej. Metformina 500mg, Omeprazol..."
              value={form.medicamentosActuales ?? ''}
              onChange={e => setForm(p => ({ ...p, medicamentosActuales: e.target.value }))} />
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>Antecedentes laborales</label>
            <Input name="laborales" type="text"
              placeholder="Ej. Exposición a químicos, trabajo nocturno..."
              value={form.antecedentesLaborales ?? ''}
              onChange={e => setForm(p => ({ ...p, antecedentesLaborales: e.target.value }))} />
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>Zoonosis (contacto con animales)</label>
            <Input name="zoonosis" type="text"
              placeholder="Ej. No, Perro y gato en casa..."
              value={form.zoonosis ?? ''}
              onChange={e => setForm(p => ({ ...p, zoonosis: e.target.value }))} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ─────────────────────────────────────

const PerfilDetallePage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const perfilId = Number(id)
  const [tab, setTab] = useState<TabPrincipal>('alergias')
  const [perfil, setPerfil] = useState<PerfilPaciente | null>(null)
  const [alergiaCount, setAlergiaCount] = useState(0)

  useEffect(() => {
    obtenerPerfiles().then(r => {
      const p = r.data.find(x => x.id === perfilId)
      if (p) setPerfil(p)
      else navigate('/perfiles')
    })
    obtenerAlergias(perfilId).then(r => setAlergiaCount(r.data.length)).catch(() => {})
  }, [perfilId, navigate])

  if (!perfil) {
    return <div className={styles.pagina}><div className={styles.cargando}>Cargando perfil...</div></div>
  }

  const inicial = perfil.nombreCompleto.trim().charAt(0).toUpperCase() || '?'

  return (
    <div className={styles.pagina}>
      <div className={styles.contenedor}>

        {/* Navegación */}
        <div className={styles.navSuperior}>
          <button className={styles.botonVolver} onClick={() => navigate('/perfiles')}>
            <ArrowLeft size={18} /> Perfiles
          </button>
        </div>

        {/* Cabecera del perfil */}
        <div className={styles.cabeceraCard}>
          <div className={styles.avatarGrande} style={{ backgroundColor: perfil.colorAvatar }}>
            <span className={styles.avatarLetra}>{inicial}</span>
          </div>
          <div className={styles.cabeceraInfo}>
            <h2 className={styles.nombrePerfil}>{perfil.nombreCompleto}</h2>
            <div className={styles.badges}>
              <span className={`${styles.badge} ${styles.badgePrimario}`}>
                {perfil.parentesco === 'Yo' ? 'Yo' : perfil.parentesco}
              </span>
              <span className={styles.badge}>
                <Stethoscope size={11} /> {etiquetaTipoSangre[perfil.tipoSangre]}
              </span>
              <span className={styles.badge}>
                {new Date().getFullYear() - new Date(perfil.fechaNacimiento).getFullYear()} años
              </span>
              {alergiaCount > 0 && (
                <span className={`${styles.badge} ${styles.badgeError}`}>
                  <AlertTriangle size={11} /> {alergiaCount} alerg.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {([
            ['alergias', 'Alergias', <AlertTriangle size={14} />, alergiaCount],
            ['antecedentes', 'Antecedentes', <Activity size={14} />, null],
            ['estilo', 'Estilo de vida', <Activity size={14} />, null],
          ] as const).map(([id, label, icon, count]) => (
            <button key={id} className={`${styles.tab} ${tab === id ? styles.tabActivo : ''}`}
              onClick={() => setTab(id)}>
              {icon} {label}
              {typeof count === 'number' && count > 0 && (
                <span className={`${styles.tabBadge} ${tab === id ? styles.tabBadgeActivo : ''}`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Contenido del tab */}
        {tab === 'alergias' && <TabAlergias perfilId={perfilId} />}
        {tab === 'antecedentes' && <TabAntecedentes perfilId={perfilId} />}
        {tab === 'estilo' && <TabEstiloVida perfilId={perfilId} />}

      </div>
    </div>
  )
}

export default PerfilDetallePage
