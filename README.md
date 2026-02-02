# Teste Técnico Seiwa - Frontend

Este repositório contém o código-fonte do frontend para o teste técnico da Seiwa, desenvolvido com React Native e Expo. A aplicação consome a API RESTful desenvolvida no backend para o gerenciamento de repasses financeiros.

A aplicação permite que médicos e administradores visualizem produções, repasses, hospitais e informações financeiras consolidadas.

**usuário ja com dados poupulados pela seed**

email: admin@seiwa.com<br>
senha: 123456

### Funcionalidades

- **Autenticação**: Login e Cadastro de usuários.
- **Dashboard**: Visão geral e acesso rápido às funcionalidades.
- **Médicos**: Listagem e visualização de perfil de médicos.
- **Hospitais**: Listagem e detalhes de hospitais.
- **Produções**: Visualização de registros de produções.
- **Repasses**: Acompanhamento de repasses financeiros consolidados e pendentes.

## Tecnologias Utilizadas

- **React Native** (via **Expo**)
- **TypeScript**
- **React Navigation** (Gerenciamento de rotas e navegação)
- **Axios** (Integração com a API)
- **Context API** (Gerenciamento de estado simples)
- **Estilização Customizada** (Sistema de design com paleta Teal/Slate)

## Decisões de Projeto

- **Atomic Design**: A estrutura de componentes foi organizada (atoms, molecules, organisms, templates) para promover reuso e consistência.
- **Expo**: Escolhido para agilizar o desenvolvimento e facilitar o deploy em múltiplas plataformas (Web, Android, iOS).
- **TypeScript**: Utilizado para garantir tipagem estática e reduzir erros em tempo de desenvolvimento.
- **Theming Centralizado**: Definição de cores, espaçamentos e tipografia em um arquivo central (`src/theme`) para facilitar manutenção e consistência visual.

## Pastas Importantes

- `src/`: Código-fonte da aplicação
  - `components/`: Componentes UI seguindo Atomic Design
    - `atoms/`: Botões, inputs, textos básicos
    - `molecules/`: Campos de formulário, cards simples
    - `organisms/`: Formulários completos, listas complexas
    - `templates/`: Estruturas de layout de página
  - `screens/`: Telas da aplicação (Dashboard, Listagens, Detalhes)
  - `services/`: Configuração do Axios e chamadas à API
  - `theme/`: Configuração de tema (cores, fontes, espaçamentos)
  - `hooks/`: Hooks customizados
  - `context/`: Contextos da aplicação (Auth, etc)

## Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado.
- npm ou yarn.
- Aplicativo Expo Go (para testar em dispositivo móvel) ou emulador Android/iOS configurado.

### Passos
1. Clone este repositório (caso esteja separado do monorepo):
   ```bash
   git clone <url-do-repositorio>
   ```
2. Navegue até o diretório do frontend:
   ```bash
   cd test-tec-seiwa-frontend
   ```
3. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

5. Inicie o projeto:
   ```bash
   npx expo start
   ```
6. Escolha a plataforma:
   - Pressione `w` para rodar na Web.
   - Pressione `a` para rodar no Android (Emulador ou USB).
