import { 
  Copy, 
  Trash2, 
  Edit3, 
  Move, 
  RotateCcw, 
  RotateCw,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Palette,
  Type,
  Square,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react'

const ELEMENT_TYPES = {
  TEXT: 'text',
  HEADING: 'heading', 
  BUTTON: 'button',
  IMAGE: 'image',
  CONTAINER: 'container',
  INPUT: 'input',
  TEXTAREA: 'textarea'
}

const ContextMenu = ({ 
  visible, 
  x, 
  y, 
  element, 
  onAction, 
  onClose 
}) => {
  if (!visible || !element) return null

  // Ações básicas disponíveis para todos os elementos
  const basicActions = [
    {
      id: 'edit',
      label: 'Editar',
      icon: Edit3,
      action: () => onAction('edit', element.id)
    },
    {
      id: 'duplicate',
      label: 'Duplicar',
      icon: Copy,
      action: () => onAction('duplicate', element.id)
    },
    {
      id: 'delete',
      label: 'Excluir',
      icon: Trash2,
      action: () => onAction('delete', element.id),
      className: 'text-red-600 hover:bg-red-50'
    }
  ]

  // Ações de camada/posicionamento
  const layerActions = [
    {
      id: 'bring-to-front',
      label: 'Trazer para Frente',
      icon: ChevronsUp,
      action: () => onAction('bringToFront', element.id)
    },
    {
      id: 'send-to-back',
      label: 'Enviar para Trás',
      icon: ChevronsDown,
      action: () => onAction('sendToBack', element.id)
    },
    {
      id: 'bring-forward',
      label: 'Avançar',
      icon: ArrowUp,
      action: () => onAction('bringForward', element.id)
    },
    {
      id: 'send-backward',
      label: 'Recuar',
      icon: ArrowDown,
      action: () => onAction('sendBackward', element.id)
    }
  ]

  // Ações de visibilidade e bloqueio
  const visibilityActions = [
    {
      id: 'toggle-lock',
      label: element.locked ? 'Desbloquear' : 'Bloquear',
      icon: element.locked ? Unlock : Lock,
      action: () => onAction('toggleLock', element.id)
    },
    {
      id: 'toggle-visibility',
      label: element.hidden ? 'Mostrar' : 'Ocultar',
      icon: element.hidden ? Eye : EyeOff,
      action: () => onAction('toggleVisibility', element.id)
    }
  ]

  // Ações específicas por tipo de elemento
  const getTypeSpecificActions = () => {
    switch (element.type) {
      case ELEMENT_TYPES.TEXT:
      case ELEMENT_TYPES.HEADING:
        return [
          {
            id: 'text-style',
            label: 'Estilo do Texto',
            icon: Type,
            submenu: [
              {
                id: 'align-left',
                label: 'Alinhar à Esquerda',
                icon: AlignLeft,
                action: () => onAction('textAlign', element.id, 'left')
              },
              {
                id: 'align-center',
                label: 'Centralizar',
                icon: AlignCenter,
                action: () => onAction('textAlign', element.id, 'center')
              },
              {
                id: 'align-right',
                label: 'Alinhar à Direita',
                icon: AlignRight,
                action: () => onAction('textAlign', element.id, 'right')
              },
              {
                id: 'align-justify',
                label: 'Justificar',
                icon: AlignJustify,
                action: () => onAction('textAlign', element.id, 'justify')
              }
            ]
          }
        ]

      case ELEMENT_TYPES.BUTTON:
        return [
          {
            id: 'button-style',
            label: 'Estilo do Botão',
            icon: Square,
            submenu: [
              {
                id: 'primary',
                label: 'Primário',
                action: () => onAction('buttonStyle', element.id, 'primary')
              },
              {
                id: 'secondary',
                label: 'Secundário',
                action: () => onAction('buttonStyle', element.id, 'secondary')
              },
              {
                id: 'outline',
                label: 'Contorno',
                action: () => onAction('buttonStyle', element.id, 'outline')
              }
            ]
          }
        ]

      case ELEMENT_TYPES.IMAGE:
        return [
          {
            id: 'change-image',
            label: 'Alterar Imagem',
            icon: Edit3,
            action: () => onAction('changeImage', element.id)
          },
          {
            id: 'image-effects',
            label: 'Efeitos',
            icon: Palette,
            submenu: [
              {
                id: 'grayscale',
                label: 'Escala de Cinza',
                action: () => onAction('imageFilter', element.id, 'grayscale')
              },
              {
                id: 'sepia',
                label: 'Sépia',
                action: () => onAction('imageFilter', element.id, 'sepia')
              },
              {
                id: 'blur',
                label: 'Desfoque',
                action: () => onAction('imageFilter', element.id, 'blur')
              },
              {
                id: 'reset',
                label: 'Remover Filtros',
                action: () => onAction('imageFilter', element.id, 'none')
              }
            ]
          }
        ]

      case ELEMENT_TYPES.CONTAINER:
        return [
          {
            id: 'container-layout',
            label: 'Layout',
            icon: Square,
            submenu: [
              {
                id: 'flex-row',
                label: 'Linha (Flex)',
                action: () => onAction('containerLayout', element.id, 'flex-row')
              },
              {
                id: 'flex-column',
                label: 'Coluna (Flex)',
                action: () => onAction('containerLayout', element.id, 'flex-column')
              },
              {
                id: 'grid',
                label: 'Grade (Grid)',
                action: () => onAction('containerLayout', element.id, 'grid')
              }
            ]
          }
        ]

      default:
        return []
    }
  }

  const typeSpecificActions = getTypeSpecificActions()

  // Renderizar item do menu
  const renderMenuItem = (item, isSubmenu = false) => {
    const IconComponent = item.icon
    const hasSubmenu = item.submenu && item.submenu.length > 0

    return (
      <div key={item.id} className="relative group">
        <button
          className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
            item.className || ''
          } ${isSubmenu ? 'pl-6' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            if (!hasSubmenu && item.action) {
              item.action()
              onClose()
            }
          }}
        >
          {IconComponent && <IconComponent className="w-4 h-4" />}
          <span className="flex-1">{item.label}</span>
          {hasSubmenu && <span className="text-gray-400">›</span>}
        </button>
        
        {hasSubmenu && (
          <div className="absolute left-full top-0 ml-1 bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            {item.submenu.map(subItem => renderMenuItem(subItem, true))}
          </div>
        )}
      </div>
    )
  }

  // Renderizar separador
  const renderSeparator = () => (
    <div className="h-px bg-gray-200 my-1" />
  )

  return (
    <div
      className="fixed bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 min-w-48 context-menu"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Ações básicas */}
      {basicActions.map(renderMenuItem)}
      
      {renderSeparator()}
      
      {/* Ações específicas do tipo */}
      {typeSpecificActions.length > 0 && (
        <>
          {typeSpecificActions.map(renderMenuItem)}
          {renderSeparator()}
        </>
      )}
      
      {/* Ações de camada */}
      {layerActions.map(renderMenuItem)}
      
      {renderSeparator()}
      
      {/* Ações de visibilidade */}
      {visibilityActions.map(renderMenuItem)}
    </div>
  )
}

export default ContextMenu
