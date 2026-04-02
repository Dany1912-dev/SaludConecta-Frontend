import { Sun, Moon } from 'lucide-react'
import { useTemaStore } from '../../../store/temaStore'
import styles from './BotonTema.module.css'

export const BotonTema = () => {
  const { tema, toggleTema } = useTemaStore()

  return (
    <button
      className={styles.boton}
      onClick={toggleTema}
      aria-label={tema === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
      title={tema === 'light' ? 'Modo oscuro' : 'Modo claro'}
    >
      {tema === 'light'
        ? <Moon size={16} strokeWidth={2} />
        : <Sun size={16} strokeWidth={2} />
      }
    </button>
  )
}