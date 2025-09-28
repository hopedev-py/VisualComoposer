import { useState, useRef } from 'react'
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button.jsx'
import { Card } from '@/components/ui/card.jsx'
import { 
  Type, 
  Square, 
  Image, 
  MousePointer, 
  Palette, 
  Settings,
  Download,
  Save,
  Eye,
  Plus,
  Undo,
  Redo,
  Menu,
  X
} from 'lucide-react'
import DraggableElement from './components/DraggableElement'
import ContextMenu from './components/ContextMenu'
import PropertyPanel from './components/PropertyPanel'
import './App.css'

// Tipos de elementos disponíveis
const ELEMENT_TYPES = {
  TEXT: 'text',
  HEADING: 'heading', 
  BUTTON: 'button',
  IMAGE: 'image',
  CONTAINER: 'container',
  INPUT: 'input',
  TEXTAREA: 'textarea'
}

// Elementos da sidebar
const SIDEBAR_ELEMENTS = [
  {
    type: ELEMENT_TYPES.TEXT,
    icon: Type,
    label: 'Texto',
    category: 'Básico'
  },
  {
    type: ELEMENT_TYPES.HEADING,
    icon: Type,
    label: 'Título',
    category: 'Básico'
  },
  {
    type: ELEMENT_TYPES.BUTTON,
    icon: MousePointer,
    label: 'Botão',
    category: 'Básico'
  },
  {
    type: ELEMENT_TYPES.IMAGE,
    icon: Image,
    label: 'Imagem',
    category: 'Mídia'
  },
  {
    type: ELEMENT_TYPES.CONTAINER,
    icon: Square,
    label: 'Container',
    category: 'Layout'
  },
  {
    type: ELEMENT_TYPES.INPUT,
    icon: Type,
    label: 'Campo de Texto',
    category: 'Formulário'
  },
  {
    type: ELEMENT_TYPES.TEXTAREA,
    icon: Type,
    label: 'Área de Texto',
    category: 'Formulário'
  }
]

// Função para criar elemento padrão
const createDefaultElement = (type, position = { x: 100, y: 100 }) => {
  const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const baseElement = {
    id,
    type,
    position,
    size: { width: 200, height: 'auto' },
    locked: false,
    hidden: false,
    styles: {
      backgroundColor: 'transparent',
      color: '#000000',
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'left',
      lineHeight: '1.4',
      letterSpacing: '0px',
      padding: '8px',
      margin: '0px',
      border: 'none',
      borderStyle: 'none',
      borderWidth: '0px',
      borderColor: '#000000',
      borderRadius: '0px',
      opacity: 1,
      zIndex: 1,
      boxShadow: 'none'
    }
  }

  switch (type) {
    case ELEMENT_TYPES.TEXT:
      return {
        ...baseElement,
        content: 'Texto de exemplo',
        size: { width: 200, height: 'auto' }
      }
    case ELEMENT_TYPES.HEADING:
      return {
        ...baseElement,
        content: 'Título Principal',
        level: 'h1',
        size: { width: 300, height: 'auto' },
        styles: {
          ...baseElement.styles,
          fontSize: '32px',
          fontWeight: 'bold'
        }
      }
    case ELEMENT_TYPES.BUTTON:
      return {
        ...baseElement,
        content: 'Clique aqui',
        size: { width: 150, height: 40 },
        styles: {
          ...baseElement.styles,
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          textAlign: 'center',
          cursor: 'pointer',
          padding: '8px 16px'
        }
      }
    case ELEMENT_TYPES.IMAGE:
      return {
        ...baseElement,
        src: 'https://via.placeholder.com/200x150/3b82f6/ffffff?text=Imagem',
        alt: 'Imagem de exemplo',
        size: { width: 200, height: 150 }
      }
    case ELEMENT_TYPES.CONTAINER:
      return {
        ...baseElement,
        size: { width: 300, height: 200 },
        styles: {
          ...baseElement.styles,
          backgroundColor: '#f3f4f6',
          border: '2px dashed #d1d5db',
          borderStyle: 'dashed',
          borderWidth: '2px',
          borderColor: '#d1d5db',
          borderRadius: '8px'
        }
      }
    case ELEMENT_TYPES.INPUT:
      return {
        ...baseElement,
        placeholder: 'Digite aqui...',
        size: { width: 200, height: 40 },
        styles: {
          ...baseElement.styles,
          border: '1px solid #d1d5db',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderColor: '#d1d5db',
          borderRadius: '4px',
          backgroundColor: '#ffffff'
        }
      }
    case ELEMENT_TYPES.TEXTAREA:
      return {
        ...baseElement,
        placeholder: 'Digite seu texto aqui...',
        size: { width: 300, height: 100 },
        styles: {
          ...baseElement.styles,
          border: '1px solid #d1d5db',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderColor: '#d1d5db',
          borderRadius: '4px',
          backgroundColor: '#ffffff',
          resize: 'both'
        }
      }
    default:
      return baseElement
  }
}

function App() {
  const [elements, setElements] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  const [draggedElement, setDraggedElement] = useState(null)
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, elementId: null })
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [propertyPanelOpen, setPropertyPanelOpen] = useState(true)
  const canvasRef = useRef(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Função para salvar estado no histórico
  const saveToHistory = (newElements) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(JSON.parse(JSON.stringify(newElements)))
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Função para desfazer
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setElements(history[historyIndex - 1])
      setSelectedElement(null)
    }
  }

  // Função para refazer
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setElements(history[historyIndex + 1])
      setSelectedElement(null)
    }
  }

  // Função para lidar com o início do drag
  const handleDragStart = (event) => {
    const { active } = event
    
    if (active.id.startsWith('sidebar_')) {
      const elementType = active.id.replace('sidebar_', '')
      setDraggedElement({ type: elementType, isFromSidebar: true })
    } else {
      const element = elements.find(el => el.id === active.id)
      setDraggedElement(element)
    }
  }

  // Função para lidar com o fim do drag
  const handleDragEnd = (event) => {
    const { active, over, delta } = event
    
    if (!over) {
      setDraggedElement(null)
      return
    }

    if (active.id.startsWith('sidebar_') && over.id === 'canvas') {
      const elementType = active.id.replace('sidebar_', '')
      const canvasRect = canvasRef.current.getBoundingClientRect()
      const position = {
        x: Math.max(0, event.activatorEvent.clientX - canvasRect.left - 100),
        y: Math.max(0, event.activatorEvent.clientY - canvasRect.top - 20)
      }
      
      const newElement = createDefaultElement(elementType, position)
      const newElements = [...elements, newElement]
      setElements(newElements)
      setSelectedElement(newElement.id)
      saveToHistory(newElements)
    } else if (!active.id.startsWith('sidebar_') && over.id === 'canvas') {
      const newElements = elements.map(el => 
        el.id === active.id 
          ? { ...el, position: { x: el.position.x + delta.x, y: el.position.y + delta.y } }
          : el
      )
      setElements(newElements)
      saveToHistory(newElements)
    }

    setDraggedElement(null)
  }

  // Função para selecionar elemento
  const handleElementSelect = (elementId) => {
    setSelectedElement(elementId)
    setContextMenu({ visible: false, x: 0, y: 0, elementId: null })
  }

  // Função para mostrar menu de contexto
  const handleElementContextMenu = (elementId, x, y) => {
    setContextMenu({
      visible: true,
      x,
      y,
      elementId
    })
  }

  // Função para fechar menu de contexto
  const handleCanvasClick = () => {
    setSelectedElement(null)
    setContextMenu({ visible: false, x: 0, y: 0, elementId: null })
  }

  // Função para atualizar elemento
  const updateElement = (elementId, updates) => {
    const newElements = elements.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    )
    setElements(newElements)
    saveToHistory(newElements)
  }

  // Função para lidar com ações do menu de contexto
  const handleContextMenuAction = (action, elementId, value) => {
    const element = elements.find(el => el.id === elementId)
    if (!element) return

    switch (action) {
      case 'duplicate':
        const newElement = {
          ...element,
          id: `${element.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          position: { x: element.position.x + 20, y: element.position.y + 20 }
        }
        const newElements = [...elements, newElement]
        setElements(newElements)
        setSelectedElement(newElement.id)
        saveToHistory(newElements)
        break

      case 'delete':
        const filteredElements = elements.filter(el => el.id !== elementId)
        setElements(filteredElements)
        setSelectedElement(null)
        saveToHistory(filteredElements)
        break

      case 'bringToFront':
        updateElement(elementId, { 
          styles: { ...element.styles, zIndex: Math.max(...elements.map(el => el.styles.zIndex || 1)) + 1 }
        })
        break

      case 'sendToBack':
        updateElement(elementId, { 
          styles: { ...element.styles, zIndex: Math.min(...elements.map(el => el.styles.zIndex || 1)) - 1 }
        })
        break

      case 'toggleLock':
        updateElement(elementId, { locked: !element.locked })
        break

      case 'toggleVisibility':
        updateElement(elementId, { hidden: !element.hidden })
        break

      case 'textAlign':
        updateElement(elementId, {
          styles: { ...element.styles, textAlign: value }
        })
        break

      case 'buttonStyle':
        let buttonStyles = { ...element.styles }
        switch (value) {
          case 'primary':
            buttonStyles = { ...buttonStyles, backgroundColor: '#3b82f6', color: '#ffffff' }
            break
          case 'secondary':
            buttonStyles = { ...buttonStyles, backgroundColor: '#6b7280', color: '#ffffff' }
            break
          case 'outline':
            buttonStyles = { ...buttonStyles, backgroundColor: 'transparent', color: '#3b82f6', border: '1px solid #3b82f6' }
            break
        }
        updateElement(elementId, { styles: buttonStyles })
        break

      case 'imageFilter':
        let filter = 'none'
        switch (value) {
          case 'grayscale':
            filter = 'grayscale(100%)'
            break
          case 'sepia':
            filter = 'sepia(100%)'
            break
          case 'blur':
            filter = 'blur(2px)'
            break
        }
        updateElement(elementId, {
          styles: { ...element.styles, filter }
        })
        break
    }

    setContextMenu({ visible: false, x: 0, y: 0, elementId: null })
  }

  // Agrupar elementos por categoria
  const groupedElements = SIDEBAR_ELEMENTS.reduce((acc, element) => {
    if (!acc[element.category]) {
      acc[element.category] = []
    }
    acc[element.category].push(element)
    return acc
  }, {})

  const selectedElementData = selectedElement ? elements.find(el => el.id === selectedElement) : null

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col overflow-hidden`}>
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Visual Composer
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {Object.entries(groupedElements).map(([category, categoryElements]) => (
              <div key={category} className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">{category}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categoryElements.map((element) => {
                    const IconComponent = element.icon
                    return (
                      <Card
                        key={element.type}
                        id={`sidebar_${element.type}`}
                        className="p-3 cursor-grab hover:bg-gray-50 transition-colors border-dashed sidebar-element"
                        draggable
                      >
                        <div className="flex flex-col items-center gap-2 text-center">
                          <IconComponent className="w-6 h-6 text-gray-600" />
                          <span className="text-xs text-gray-700">{element.label}</span>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Área principal */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <Menu className="w-4 h-4" />
                </Button>
                <h1 className="text-xl font-semibold text-gray-900">Editor Visual</h1>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                >
                  <Undo className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                >
                  <Redo className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar
                </Button>
                <Button variant="outline" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPropertyPanelOpen(!propertyPanelOpen)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-auto bg-gray-100 p-8">
            <div
              ref={canvasRef}
              id="canvas"
              className="relative bg-white rounded-lg shadow-sm min-h-[600px] w-full canvas-grid"
              onClick={handleCanvasClick}
            >
              {elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                  <div className="text-center">
                    <Plus className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-lg font-medium">Arraste elementos aqui</p>
                    <p className="text-sm">Comece arrastando elementos da barra lateral</p>
                  </div>
                </div>
              )}
              
              {elements.map(element => (
                <DraggableElement
                  key={element.id}
                  element={element}
                  isSelected={selectedElement === element.id}
                  onSelect={handleElementSelect}
                  onContextMenu={handleElementContextMenu}
                  onUpdate={updateElement}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Painel de propriedades */}
        {propertyPanelOpen && (
          <PropertyPanel
            selectedElement={selectedElementData}
            onUpdateElement={updateElement}
          />
        )}

        {/* Menu de contexto */}
        <ContextMenu
          visible={contextMenu.visible}
          x={contextMenu.x}
          y={contextMenu.y}
          element={elements.find(el => el.id === contextMenu.elementId)}
          onAction={handleContextMenuAction}
          onClose={() => setContextMenu({ visible: false, x: 0, y: 0, elementId: null })}
        />
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {draggedElement && (
          <div className="bg-blue-100 border-2 border-blue-300 rounded p-2 opacity-80">
            {draggedElement.isFromSidebar ? (
              <span className="text-sm font-medium">
                {SIDEBAR_ELEMENTS.find(el => el.type === draggedElement.type)?.label}
              </span>
            ) : (
              <span className="text-sm font-medium">{draggedElement.type}</span>
            )}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

export default App
