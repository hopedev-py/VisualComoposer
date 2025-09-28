import { useState, useRef, useEffect } from 'react'
import { useDraggable } from '@dnd-kit/core'

const ELEMENT_TYPES = {
  TEXT: 'text',
  HEADING: 'heading', 
  BUTTON: 'button',
  IMAGE: 'image',
  CONTAINER: 'container',
  INPUT: 'input',
  TEXTAREA: 'textarea'
}

const DraggableElement = ({ 
  element, 
  isSelected, 
  onSelect, 
  onContextMenu, 
  onUpdate 
}) => {
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState(null)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [startSize, setStartSize] = useState({ width: 0, height: 0 })
  const elementRef = useRef(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: element.id,
    disabled: element.locked || isResizing
  })

  // Estilo do elemento
  const elementStyle = {
    position: 'absolute',
    left: element.position.x,
    top: element.position.y,
    width: element.size.width,
    height: element.size.height === 'auto' ? 'auto' : element.size.height,
    ...element.styles,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: element.locked ? 'not-allowed' : (isDragging ? 'grabbing' : 'grab'),
    opacity: element.hidden ? 0.3 : (isDragging ? 0.8 : element.styles.opacity || 1),
    zIndex: element.styles.zIndex || 1,
    pointerEvents: element.locked ? 'none' : 'auto'
  }

  // Iniciar redimensionamento
  const handleResizeStart = (e, handle) => {
    e.stopPropagation()
    e.preventDefault()
    
    setIsResizing(true)
    setResizeHandle(handle)
    setStartPos({ x: e.clientX, y: e.clientY })
    setStartSize({ 
      width: element.size.width, 
      height: element.size.height === 'auto' ? elementRef.current?.offsetHeight || 100 : element.size.height 
    })

    document.addEventListener('mousemove', handleResizeMove)
    document.addEventListener('mouseup', handleResizeEnd)
  }

  // Redimensionar elemento
  const handleResizeMove = (e) => {
    if (!isResizing || !resizeHandle) return

    const deltaX = e.clientX - startPos.x
    const deltaY = e.clientY - startPos.y

    let newWidth = startSize.width
    let newHeight = startSize.height
    let newX = element.position.x
    let newY = element.position.y

    switch (resizeHandle) {
      case 'se': // Sudeste
        newWidth = Math.max(50, startSize.width + deltaX)
        newHeight = Math.max(20, startSize.height + deltaY)
        break
      case 'sw': // Sudoeste
        newWidth = Math.max(50, startSize.width - deltaX)
        newHeight = Math.max(20, startSize.height + deltaY)
        newX = element.position.x + deltaX
        break
      case 'ne': // Nordeste
        newWidth = Math.max(50, startSize.width + deltaX)
        newHeight = Math.max(20, startSize.height - deltaY)
        newY = element.position.y + deltaY
        break
      case 'nw': // Noroeste
        newWidth = Math.max(50, startSize.width - deltaX)
        newHeight = Math.max(20, startSize.height - deltaY)
        newX = element.position.x + deltaX
        newY = element.position.y + deltaY
        break
      case 'n': // Norte
        newHeight = Math.max(20, startSize.height - deltaY)
        newY = element.position.y + deltaY
        break
      case 's': // Sul
        newHeight = Math.max(20, startSize.height + deltaY)
        break
      case 'w': // Oeste
        newWidth = Math.max(50, startSize.width - deltaX)
        newX = element.position.x + deltaX
        break
      case 'e': // Leste
        newWidth = Math.max(50, startSize.width + deltaX)
        break
    }

    onUpdate(element.id, {
      position: { x: newX, y: newY },
      size: { width: newWidth, height: newHeight }
    })
  }

  // Finalizar redimensionamento
  const handleResizeEnd = () => {
    setIsResizing(false)
    setResizeHandle(null)
    document.removeEventListener('mousemove', handleResizeMove)
    document.removeEventListener('mouseup', handleResizeEnd)
  }

  // Cleanup dos event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove)
      document.removeEventListener('mouseup', handleResizeEnd)
    }
  }, [])

  // Renderizar conteúdo do elemento
  const renderElementContent = () => {
    const contentStyle = {
      width: '100%',
      height: '100%',
      ...element.styles,
      position: 'relative',
      cursor: element.locked ? 'not-allowed' : 'inherit'
    }

    switch (element.type) {
      case ELEMENT_TYPES.TEXT:
        return (
          <div 
            style={contentStyle}
            contentEditable={!element.locked}
            suppressContentEditableWarning={true}
            onBlur={(e) => {
              if (e.target.textContent !== element.content) {
                onUpdate(element.id, { content: e.target.textContent })
              }
            }}
          >
            {element.content}
          </div>
        )

      case ELEMENT_TYPES.HEADING:
        const HeadingTag = element.level || 'h1'
        return (
          <HeadingTag 
            style={contentStyle}
            contentEditable={!element.locked}
            suppressContentEditableWarning={true}
            onBlur={(e) => {
              if (e.target.textContent !== element.content) {
                onUpdate(element.id, { content: e.target.textContent })
              }
            }}
          >
            {element.content}
          </HeadingTag>
        )

      case ELEMENT_TYPES.BUTTON:
        return (
          <button 
            style={contentStyle}
            onClick={(e) => e.preventDefault()}
          >
            {element.content}
          </button>
        )

      case ELEMENT_TYPES.IMAGE:
        return (
          <img 
            src={element.src} 
            alt={element.alt} 
            style={contentStyle}
            draggable={false}
          />
        )

      case ELEMENT_TYPES.CONTAINER:
        return (
          <div style={contentStyle}>
            {element.children && element.children.length > 0 ? (
              element.children.map(child => (
                <div key={child.id}>{child.content}</div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Container vazio
              </div>
            )}
          </div>
        )

      case ELEMENT_TYPES.INPUT:
        return (
          <input 
            type="text" 
            placeholder={element.placeholder}
            style={contentStyle}
            readOnly={element.locked}
          />
        )

      case ELEMENT_TYPES.TEXTAREA:
        return (
          <textarea 
            placeholder={element.placeholder}
            style={contentStyle}
            readOnly={element.locked}
          />
        )

      default:
        return (
          <div style={contentStyle}>
            {element.content || 'Elemento'}
          </div>
        )
    }
  }

  // Renderizar handles de redimensionamento
  const renderResizeHandles = () => {
    if (!isSelected || element.locked) return null

    const handles = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']
    
    return handles.map(handle => (
      <div
        key={handle}
        className={`resize-handle ${handle}`}
        onMouseDown={(e) => handleResizeStart(e, handle)}
        style={{
          position: 'absolute',
          background: '#3b82f6',
          border: '2px solid white',
          borderRadius: '50%',
          width: '12px',
          height: '12px',
          zIndex: 20,
          cursor: `${handle}-resize`,
          ...getHandlePosition(handle)
        }}
      />
    ))
  }

  // Obter posição do handle
  const getHandlePosition = (handle) => {
    const offset = -6
    switch (handle) {
      case 'nw': return { top: offset, left: offset }
      case 'n': return { top: offset, left: '50%', transform: 'translateX(-50%)' }
      case 'ne': return { top: offset, right: offset }
      case 'w': return { top: '50%', left: offset, transform: 'translateY(-50%)' }
      case 'e': return { top: '50%', right: offset, transform: 'translateY(-50%)' }
      case 'sw': return { bottom: offset, left: offset }
      case 's': return { bottom: offset, left: '50%', transform: 'translateX(-50%)' }
      case 'se': return { bottom: offset, right: offset }
      default: return {}
    }
  }

  return (
    <div
      ref={(node) => {
        setNodeRef(node)
        elementRef.current = node
      }}
      style={elementStyle}
      className={`element-wrapper ${isSelected ? 'element-selected' : ''} ${isDragging ? 'element-dragging' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(element.id)
      }}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onContextMenu(element.id, e.clientX, e.clientY)
      }}
      {...attributes}
      {...listeners}
    >
      {renderElementContent()}
      {renderResizeHandles()}
      
      {/* Indicador de elemento bloqueado */}
      {element.locked && (
        <div className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
          🔒
        </div>
      )}
    </div>
  )
}

export default DraggableElement
