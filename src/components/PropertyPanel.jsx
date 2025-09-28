import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Settings,
  Type,
  Palette,
  Square,
  Move,
  Eye,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react'

const FONT_FAMILIES = [
  'Arial, sans-serif',
  'Helvetica, sans-serif',
  'Georgia, serif',
  'Times New Roman, serif',
  'Courier New, monospace',
  'Verdana, sans-serif',
  'Trebuchet MS, sans-serif',
  'Impact, sans-serif',
  'Comic Sans MS, cursive'
]

const FONT_WEIGHTS = [
  { value: '100', label: 'Thin' },
  { value: '200', label: 'Extra Light' },
  { value: '300', label: 'Light' },
  { value: '400', label: 'Normal' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi Bold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
  { value: '900', label: 'Black' }
]

const BORDER_STYLES = [
  'none',
  'solid',
  'dashed',
  'dotted',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset'
]

const PropertyPanel = ({ selectedElement, onUpdateElement }) => {
  const [activeTab, setActiveTab] = useState('layout')

  if (!selectedElement) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Propriedades
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-gray-500 text-center">
            Selecione um elemento para editar suas propriedades
          </p>
        </div>
      </div>
    )
  }

  const updateProperty = (property, value) => {
    onUpdateElement(selectedElement.id, { [property]: value })
  }

  const updateStyle = (styleProperty, value) => {
    onUpdateElement(selectedElement.id, {
      styles: {
        ...selectedElement.styles,
        [styleProperty]: value
      }
    })
  }

  const updatePosition = (axis, value) => {
    onUpdateElement(selectedElement.id, {
      position: {
        ...selectedElement.position,
        [axis]: parseInt(value) || 0
      }
    })
  }

  const updateSize = (dimension, value) => {
    onUpdateElement(selectedElement.id, {
      size: {
        ...selectedElement.size,
        [dimension]: value === 'auto' ? 'auto' : (parseInt(value) || 0)
      }
    })
  }

  // Componente para seletor de cor
  const ColorPicker = ({ label, value, onChange }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
        />
        <Input
          type="text"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-xs"
          placeholder="#000000"
        />
      </div>
    </div>
  )

  // Componente para controle de espaçamento
  const SpacingControl = ({ label, value, onChange, sides = ['top', 'right', 'bottom', 'left'] }) => {
    const [isLinked, setIsLinked] = useState(true)
    const [values, setValues] = useState(() => {
      if (typeof value === 'string') {
        const parts = value.split(' ')
        return {
          top: parts[0] || '0',
          right: parts[1] || parts[0] || '0',
          bottom: parts[2] || parts[0] || '0',
          left: parts[3] || parts[1] || parts[0] || '0'
        }
      }
      return { top: '0', right: '0', bottom: '0', left: '0' }
    })

    const updateValue = (side, newValue) => {
      const newValues = isLinked 
        ? { top: newValue, right: newValue, bottom: newValue, left: newValue }
        : { ...values, [side]: newValue }
      
      setValues(newValues)
      
      if (isLinked) {
        onChange(`${newValue}px`)
      } else {
        onChange(`${newValues.top}px ${newValues.right}px ${newValues.bottom}px ${newValues.left}px`)
      }
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">{label}</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLinked(!isLinked)}
            className="h-6 w-6 p-0"
          >
            {isLinked ? '🔗' : '🔓'}
          </Button>
        </div>
        
        {isLinked ? (
          <Input
            type="number"
            value={parseInt(values.top) || 0}
            onChange={(e) => updateValue('top', e.target.value)}
            className="text-sm"
            placeholder="0"
          />
        ) : (
          <div className="grid grid-cols-2 gap-1 text-xs">
            <Input
              type="number"
              value={parseInt(values.top) || 0}
              onChange={(e) => updateValue('top', e.target.value)}
              placeholder="Top"
            />
            <Input
              type="number"
              value={parseInt(values.right) || 0}
              onChange={(e) => updateValue('right', e.target.value)}
              placeholder="Right"
            />
            <Input
              type="number"
              value={parseInt(values.bottom) || 0}
              onChange={(e) => updateValue('bottom', e.target.value)}
              placeholder="Bottom"
            />
            <Input
              type="number"
              value={parseInt(values.left) || 0}
              onChange={(e) => updateValue('left', e.target.value)}
              placeholder="Left"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Propriedades
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {selectedElement.type} - {selectedElement.id.split('_')[0]}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 m-2">
            <TabsTrigger value="layout" className="text-xs">
              <Move className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs">
              <Palette className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="typography" className="text-xs">
              <Type className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs">
              <Settings className="w-3 h-3" />
            </TabsTrigger>
          </TabsList>

          {/* Aba Layout */}
          <TabsContent value="layout" className="p-4 space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-700">Posição</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">X</Label>
                  <Input
                    type="number"
                    value={selectedElement.position.x}
                    onChange={(e) => updatePosition('x', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Y</Label>
                  <Input
                    type="number"
                    value={selectedElement.position.y}
                    onChange={(e) => updatePosition('y', e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-700">Tamanho</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Largura</Label>
                  <Input
                    type="number"
                    value={selectedElement.size.width}
                    onChange={(e) => updateSize('width', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Altura</Label>
                  <Input
                    type="text"
                    value={selectedElement.size.height}
                    onChange={(e) => updateSize('height', e.target.value)}
                    className="text-sm"
                    placeholder="auto"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <SpacingControl
              label="Padding"
              value={selectedElement.styles.padding}
              onChange={(value) => updateStyle('padding', value)}
            />

            <SpacingControl
              label="Margin"
              value={selectedElement.styles.margin}
              onChange={(value) => updateStyle('margin', value)}
            />
          </TabsContent>

          {/* Aba Estilo */}
          <TabsContent value="style" className="p-4 space-y-4">
            <ColorPicker
              label="Cor de Fundo"
              value={selectedElement.styles.backgroundColor}
              onChange={(value) => updateStyle('backgroundColor', value)}
            />

            <ColorPicker
              label="Cor do Texto"
              value={selectedElement.styles.color}
              onChange={(value) => updateStyle('color', value)}
            />

            <Separator />

            <div className="space-y-2">
              <Label className="text-sm font-medium">Estilo da Borda</Label>
              <Select
                value={selectedElement.styles.borderStyle || 'none'}
                onValueChange={(value) => updateStyle('borderStyle', value)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BORDER_STYLES.map(style => (
                    <SelectItem key={style} value={style}>
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Largura da Borda</Label>
              <Input
                type="number"
                value={parseInt(selectedElement.styles.borderWidth) || 0}
                onChange={(e) => updateStyle('borderWidth', `${e.target.value}px`)}
                className="text-sm"
                min="0"
              />
            </div>

            <ColorPicker
              label="Cor da Borda"
              value={selectedElement.styles.borderColor}
              onChange={(value) => updateStyle('borderColor', value)}
            />

            <div className="space-y-2">
              <Label className="text-sm font-medium">Raio da Borda</Label>
              <Input
                type="number"
                value={parseInt(selectedElement.styles.borderRadius) || 0}
                onChange={(e) => updateStyle('borderRadius', `${e.target.value}px`)}
                className="text-sm"
                min="0"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-sm font-medium">Opacidade</Label>
              <Slider
                value={[parseFloat(selectedElement.styles.opacity || 1) * 100]}
                onValueChange={([value]) => updateStyle('opacity', value / 100)}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-center">
                {Math.round(parseFloat(selectedElement.styles.opacity || 1) * 100)}%
              </div>
            </div>
          </TabsContent>

          {/* Aba Tipografia */}
          <TabsContent value="typography" className="p-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Família da Fonte</Label>
              <Select
                value={selectedElement.styles.fontFamily || 'Arial, sans-serif'}
                onValueChange={(value) => updateStyle('fontFamily', value)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map(font => (
                    <SelectItem key={font} value={font}>
                      <span style={{ fontFamily: font }}>{font.split(',')[0]}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Tamanho da Fonte</Label>
              <Input
                type="number"
                value={parseInt(selectedElement.styles.fontSize) || 16}
                onChange={(e) => updateStyle('fontSize', `${e.target.value}px`)}
                className="text-sm"
                min="8"
                max="72"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Peso da Fonte</Label>
              <Select
                value={selectedElement.styles.fontWeight || '400'}
                onValueChange={(value) => updateStyle('fontWeight', value)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_WEIGHTS.map(weight => (
                    <SelectItem key={weight.value} value={weight.value}>
                      {weight.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Estilo do Texto</Label>
              <div className="flex gap-1">
                <Button
                  variant={selectedElement.styles.fontWeight === 'bold' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateStyle('fontWeight', 
                    selectedElement.styles.fontWeight === 'bold' ? 'normal' : 'bold'
                  )}
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  variant={selectedElement.styles.fontStyle === 'italic' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateStyle('fontStyle', 
                    selectedElement.styles.fontStyle === 'italic' ? 'normal' : 'italic'
                  )}
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  variant={selectedElement.styles.textDecoration === 'underline' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateStyle('textDecoration', 
                    selectedElement.styles.textDecoration === 'underline' ? 'none' : 'underline'
                  )}
                >
                  <Underline className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Alinhamento</Label>
              <div className="flex gap-1">
                {[
                  { value: 'left', icon: AlignLeft },
                  { value: 'center', icon: AlignCenter },
                  { value: 'right', icon: AlignRight },
                  { value: 'justify', icon: AlignJustify }
                ].map(({ value, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={selectedElement.styles.textAlign === value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateStyle('textAlign', value)}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Altura da Linha</Label>
              <Input
                type="number"
                value={parseFloat(selectedElement.styles.lineHeight) || 1.4}
                onChange={(e) => updateStyle('lineHeight', e.target.value)}
                className="text-sm"
                min="0.5"
                max="3"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Espaçamento entre Letras</Label>
              <Input
                type="number"
                value={parseInt(selectedElement.styles.letterSpacing) || 0}
                onChange={(e) => updateStyle('letterSpacing', `${e.target.value}px`)}
                className="text-sm"
                min="-5"
                max="10"
              />
            </div>
          </TabsContent>

          {/* Aba Avançado */}
          <TabsContent value="advanced" className="p-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Z-Index</Label>
              <Input
                type="number"
                value={selectedElement.styles.zIndex || 1}
                onChange={(e) => updateStyle('zIndex', parseInt(e.target.value) || 1)}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Transformação</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Rotação (deg)</Label>
                  <Input
                    type="number"
                    value={0}
                    onChange={(e) => updateStyle('transform', `rotate(${e.target.value}deg)`)}
                    className="text-sm"
                    min="-360"
                    max="360"
                  />
                </div>
                <div>
                  <Label className="text-xs">Escala</Label>
                  <Input
                    type="number"
                    value={1}
                    onChange={(e) => updateStyle('transform', `scale(${e.target.value})`)}
                    className="text-sm"
                    min="0.1"
                    max="3"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Sombra</Label>
              <Input
                type="text"
                value={selectedElement.styles.boxShadow || ''}
                onChange={(e) => updateStyle('boxShadow', e.target.value)}
                className="text-sm"
                placeholder="0 2px 4px rgba(0,0,0,0.1)"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-sm font-medium">Ações</Label>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => updateProperty('locked', !selectedElement.locked)}
                >
                  {selectedElement.locked ? 'Desbloquear' : 'Bloquear'} Elemento
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => updateProperty('hidden', !selectedElement.hidden)}
                >
                  {selectedElement.hidden ? 'Mostrar' : 'Ocultar'} Elemento
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default PropertyPanel
