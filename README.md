# Inova Barbearia: Aplicativo de Barbearia

Este é um aplicativo móvel e web de barbearia construído com React Native e Expo, projetado para facilitar o agendamento de serviços, gerenciamento de usuários e perfis, e exibição de barbeiros e serviços. O aplicativo se integra a um backend MERN Stack (MongoDB, Express.js, React, Node.js) para gerenciamento de dados.

## Funcionalidades

-   **Autenticação de Usuário**: Login e registro de usuários com Firebase Authentication.
-   **Gerenciamento de Perfil**: Visualização e atualização de informações do perfil do usuário.
-   **Agendamento de Serviços**:
    -   Processo de agendamento em múltiplas etapas.
    -   Seleção dinâmica de serviços e barbeiros disponíveis.
    -   Seleção de data para o agendamento.
    -   Confirmação e resumo do agendamento.
-   **Exibição de Serviços e Barbeiros**: Páginas dedicadas para listar todos os serviços e barbeiros, com cards informativos.
-   **Registro de Novos Usuários (Admin/Barbeiro)**:
    -   Página de cadastro com campos diferenciados baseados na função do usuário logado (Admin registra barbeiros, Barbeiro registra clientes).
    -   Integração com Firebase para criação de usuários.
-   **Proteção de Rotas**: Componente `ProtectedRoute` para garantir que apenas usuários autenticados e com as permissões corretas possam acessar determinadas páginas.
-   **Header Dinâmico**: Header que se adapta com base no status de autenticação e na função do usuário, exibindo opções relevantes (ex: botão de registro para admins/barbeiros).
-   **Layout Responsivo**: Estilização com Tailwind CSS para garantir uma experiência de usuário agradável em diferentes dispositivos e plataformas (web e mobile).
-   **Integração com Backend**: Consumo de APIs RESTful para buscar, criar e atualizar dados de serviços, usuários (barbeiros e clientes) e agendamentos.

## Tecnologias Utilizadas

-   **Frontend**:
    -   React Native
    -   Expo
    -   Expo Router
    -   Tailwind CSS (via NativeWind)
    -   Axios para requisições HTTP
    -   Firebase Authentication (para autenticação de usuário)
    -   `@react-native-community/datetimepicker` para seleção de data
    -   `expo-secure-store` para armazenamento seguro de tokens e IDs de usuário
    -   `lucide-react-native` para ícones
-   **Backend**:
    -   Node.js
    -   Express.js
    -   MongoDB (Mongoose ODM)
    -   Firebase Admin SDK (para verificação de token, se implementado)

## Configuração do Ambiente

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

-   Node.js (versão 18.x ou superior recomendada)
-   npm ou Yarn
-   Expo CLI (`npm install -g expo-cli`)
-   Uma instância do MongoDB rodando (localmente ou na nuvem)
-   Um projeto Firebase configurado (com autenticação ativada)

### Configuração do Projeto

1.  **Clone o Repositório**:
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd barbershop-reactnative
    ```

2.  **Instale as Dependências**:
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configuração do Firebase**:
    Crie um arquivo `src/services/firebase.ts` com suas credenciais do Firebase:
    ```typescript
    // src/services/firebase.ts
    import { initializeApp } from 'firebase/app';
    import { getAuth } from 'firebase/auth';

    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    const app = initializeApp(firebaseConfig);
    export default app;
    ```

4.  **Configuração do Backend (MERN Stack)**:
    Este frontend espera se comunicar com um backend MERN Stack rodando em `http://localhost:5000/api`. Certifique-se de que seu backend esteja configurado com as seguintes rotas e lógicas:

    -   **Serviços**:
        -   `GET /api/servicos`: Retorna todos os serviços.
        -   `POST /api/servicos`: Cria um novo serviço.
        -   `PUT /api/servicos/:id`: Atualiza um serviço.
        -   `DELETE /api/servicos/:id`: Deleta um serviço.
    -   **Usuários (incluindo Barbeiros e Clientes)**:
        -   `GET /api/usuarios`: Retorna todos os usuários.
        -   `GET /api/usuarios/barbeiros`: Retorna apenas os usuários com a função 'barbeiro'.
        -   `GET /api/usuarios/firebase/:firebase_uid`: Retorna um usuário específico pelo seu UID do Firebase.
        -   `POST /api/usuarios`: Cria um novo usuário (para registro de barbeiros por admins).
    -   **Clientes**:
        -   `POST /api/clientes`: Cria um novo cliente (para registro de clientes por barbeiros).
        -   `GET /api/clientes/firebase/:firebase_uid`: Retorna um cliente específico pelo seu UID do Firebase.
    -   **Agendamentos**:
        -   `GET /api/agendamentos`: Retorna todos os agendamentos.
        -   `POST /api/agendamentos`: Cria um novo agendamento.
        -   `PUT /api/agendamentos/:id`: Atualiza um agendamento.
        -   `DELETE /api/agendamentos/:id`: Deleta um agendamento.

    Certifique-se de que seu backend esteja conectado ao MongoDB e que as rotas correspondam às chamadas feitas no `APIService.ts`.

5.  **Rodar a Aplicação**:

    -   **Para Web**:
        ```bash
        npm run web
        # ou
        yarn web
        ```
        Abra `http://localhost:19006` (ou a porta indicada) no seu navegador.

    -   **Para Android/iOS (com Expo Go)**:
        ```bash
        npm start
        # ou
        yarn start
        ```
        Escaneie o código QR com o aplicativo Expo Go no seu dispositivo móvel.

## Estrutura do Projeto

```
.
├── src/
│   ├── app/                # Páginas principais (login, agendamento, profile, etc.)
│   ├── components/         # Componentes reutilizáveis (Header, Footer, ServiceCard, etc.)
│   ├── services/           # Serviços de API (APIService, firebase.ts)
│   ├── types/              # Definições de tipos (TypeScript)
│   └── assets/             # Imagens, fontes, etc.
├── app.json
├── package.json
└── README.md
```

