# Visual Composer - Editor de Design Visual

Uma ferramenta avançada de design visual similar ao Elementor, desenvolvida em React com funcionalidades completas de arrastar e soltar, menu de contexto inteligente e controles de propriedades visuais.

## 🚀 Funcionalidades Principais

### ✨ Arrastar e Soltar Avançado
- **Posicionamento livre** de elementos no canvas
- **Redimensionamento visual** com handles interativos
- **Snap e alinhamento** automático
- **Feedback visual** durante o arraste
- **Histórico de ações** com undo/redo

### 🎨 Elementos Disponíveis
- **Texto** - Texto editável com formatação completa
- **Título** - Cabeçalhos H1-H6 personalizáveis
- **Botão** - Botões interativos com estilos variados
- **Imagem** - Imagens com filtros e efeitos
- **Container** - Containers para layout e agrupamento
- **Campo de Texto** - Inputs para formulários
- **Área de Texto** - Textareas para textos longos

### 🖱️ Menu de Contexto Inteligente
- **Específico por tipo** de elemento
- **Ações básicas**: editar, duplicar, excluir
- **Controles de camada**: trazer para frente, enviar para trás
- **Visibilidade**: mostrar/ocultar, bloquear/desbloquear
- **Estilos rápidos**: alinhamento de texto, estilos de botão, filtros de imagem

### 🎛️ Painel de Propriedades Completo

#### Layout
- **Posição**: coordenadas X e Y precisas
- **Tamanho**: largura e altura personalizáveis
- **Espaçamento**: padding e margin com controle individual ou unificado

#### Estilo Visual
- **Cores**: texto, fundo e bordas com seletor de cor
- **Bordas**: estilo, largura, cor e raio personalizáveis
- **Opacidade**: controle deslizante de transparência
- **Sombras**: box-shadow personalizável

#### Tipografia Avançada
- **Família da fonte**: seleção entre fontes populares
- **Tamanho**: controle preciso em pixels
- **Peso**: thin a black (100-900)
- **Estilo**: negrito, itálico, sublinhado
- **Alinhamento**: esquerda, centro, direita, justificado
- **Altura da linha**: espaçamento entre linhas
- **Espaçamento entre letras**: kerning personalizado

#### Controles Avançados
- **Z-Index**: controle de camadas
- **Transformações**: rotação e escala
- **Efeitos**: sombras e filtros
- **Bloqueio**: proteção contra edição acidental
- **Visibilidade**: mostrar/ocultar elementos

## 🛠️ Tecnologias Utilizadas

- **React 19** - Framework principal
- **@dnd-kit** - Sistema de drag and drop
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes de interface
- **Lucide React** - Ícones modernos
- **Vite** - Build tool e desenvolvimento

## 📦 Instalação e Uso

### Pré-requisitos
- Node.js 18+ 
- pnpm (recomendado) ou npm

### Instalação
```bash
# Clonar o repositório
git clone [url-do-repositorio]
cd visual-composer

# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm run dev

# Build para produção
pnpm run build
```

### Desenvolvimento
```bash
# Servidor de desenvolvimento com hot reload
pnpm run dev --host

# Build e preview
pnpm run build
pnpm run preview

# Linting
pnpm run lint
```

## 🎯 Como Usar

### 1. Adicionando Elementos
- Arraste elementos da **sidebar esquerda** para o **canvas central**
- Os elementos são posicionados onde você soltar
- Cada elemento tem propriedades padrão otimizadas

### 2. Editando Elementos
- **Clique** em um elemento para selecioná-lo
- Use o **painel de propriedades** à direita para editar
- **Clique duplo** em textos para edição inline
- **Arraste** elementos para reposicionar

### 3. Redimensionamento
- Selecione um elemento para ver os **handles de redimensionamento**
- Arraste os handles para redimensionar
- Use **Shift** para manter proporção (futuro)

### 4. Menu de Contexto
- **Clique direito** em qualquer elemento
- Acesse ações específicas do tipo de elemento
- Use atalhos para ações comuns

### 5. Controles de Propriedades
- **Layout**: posição, tamanho, espaçamento
- **Estilo**: cores, bordas, opacidade
- **Tipografia**: fonte, tamanho, alinhamento
- **Avançado**: transformações, efeitos

## 🔧 Arquitetura do Código

### Estrutura de Pastas
```
src/
├── components/
│   ├── ui/              # Componentes shadcn/ui
│   ├── ContextMenu.jsx  # Menu de contexto inteligente
│   ├── DraggableElement.jsx  # Elemento arrastável
│   └── PropertyPanel.jsx     # Painel de propriedades
├── App.jsx              # Componente principal
├── App.css              # Estilos globais
└── main.jsx             # Ponto de entrada
```

### Componentes Principais

#### `App.jsx`
- Gerenciamento de estado global
- Coordenação do drag and drop
- Histórico de ações
- Interface principal

#### `DraggableElement.jsx`
- Renderização de elementos
- Handles de redimensionamento
- Edição inline
- Eventos de interação

#### `ContextMenu.jsx`
- Menu contextual dinâmico
- Ações específicas por tipo
- Submenus organizados
- Integração com ações

#### `PropertyPanel.jsx`
- Interface de propriedades
- Controles organizados em abas
- Componentes especializados
- Atualização em tempo real

## 🎨 Personalização

### Adicionando Novos Tipos de Elemento
1. Adicione o tipo em `ELEMENT_TYPES`
2. Configure em `SIDEBAR_ELEMENTS`
3. Implemente em `createDefaultElement`
4. Adicione renderização em `DraggableElement`
5. Configure menu de contexto específico

### Estendendo Propriedades
1. Adicione campos no `PropertyPanel`
2. Atualize estrutura de dados do elemento
3. Implemente lógica de aplicação
4. Teste integração completa

### Temas e Estilos
- Modifique variáveis CSS em `App.css`
- Use sistema de cores do Tailwind
- Personalize componentes shadcn/ui
- Adicione animações customizadas

## 🚀 Funcionalidades Futuras

### Planejadas
- [ ] **Componentes aninhados** - Elementos dentro de containers
- [ ] **Templates prontos** - Layouts pré-definidos
- [ ] **Exportação avançada** - CSS, React, Vue
- [ ] **Colaboração em tempo real** - Múltiplos usuários
- [ ] **Biblioteca de assets** - Imagens e ícones
- [ ] **Responsividade** - Breakpoints e media queries
- [ ] **Animações** - Transições e keyframes
- [ ] **Integração com APIs** - Dados dinâmicos

### Melhorias Técnicas
- [ ] **Performance** - Virtualização de elementos
- [ ] **Acessibilidade** - ARIA e navegação por teclado
- [ ] **Testes** - Cobertura completa
- [ ] **Documentação** - Storybook e exemplos
- [ ] **PWA** - Funcionamento offline

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- **React Team** - Framework incrível
- **@dnd-kit** - Biblioteca de drag and drop
- **shadcn/ui** - Componentes de qualidade
- **Tailwind CSS** - Sistema de design
- **Lucide** - Ícones modernos

---

**Visual Composer** - Criando interfaces visuais de forma intuitiva e profissional.
