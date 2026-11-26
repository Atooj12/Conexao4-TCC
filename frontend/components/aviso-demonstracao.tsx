import { FlaskConical } from 'lucide-react'
import { toast } from 'sonner'

// Telas do admin que ainda não têm back (estoque, relatórios, configurações).
// Ficam no site para mostrar a ideia, mas avisam que os dados são de exemplo.

export function AvisoDemonstracao({ texto }: { texto: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
      <FlaskConical className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
      <div>
        <p className="font-medium text-amber-800 dark:text-amber-300">Demonstração</p>
        <p className="text-amber-800/80 dark:text-amber-200/80">{texto}</p>
      </div>
    </div>
  )
}

export function avisarDemonstracao() {
  toast.info('Esta tela é uma demonstração: a ação ainda não está ligada ao sistema.')
}
