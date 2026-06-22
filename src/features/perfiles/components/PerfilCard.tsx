import type { PerfilPaciente } from '../../../api/perfilesApi'
import { etiquetaParentesco } from '../../../api/perfilesApi'
import styles from './PerfilCard.module.css'

interface Props {
  perfil: PerfilPaciente
  onClick: (perfil: PerfilPaciente) => void
}

export const PerfilCard = ({ perfil, onClick }: Props) => {
  const inicial = perfil.nombreCompleto.charAt(0).toUpperCase()

  return (
    <button className={styles.card} onClick={() => onClick(perfil)}>
      <div className={styles.avatar} style={{ backgroundColor: perfil.colorAvatar }}>
        <span className={styles.avatarLetra}>{inicial}</span>
      </div>
      <p className={styles.nombre}>{perfil.nombreCompleto}</p>
      <span className={styles.parentesco}>
        {etiquetaParentesco[perfil.parentesco] ?? perfil.parentesco}
      </span>
    </button>
  )
}
