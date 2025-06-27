# Inova Barbearia: Aplicativo de Barbearia

Este é um aplicativo completo (mobile e web) de barbearia construído com **React Native + Expo**, projetado para clientes, barbeiros e administradores. Permite o agendamento de serviços, gerenciamento de usuários, exibição de profissionais e muito mais. A aplicação integra um backend **MERN Stack (MongoDB, Express.js, React, Node.js)**, garantindo robustez e escalabilidade.

---

## ✨ Funcionalidades

- **Autenticação de Usuário**: Cadastro, login e logout via Firebase Authentication.
- **Recuperação de Senha**: Fluxo de "Esqueci minha senha" com redirecionamento e recuperação por e-mail.
- **Gerenciamento de Perfil**: Atualização e exibição de dados pessoais.
- **Agendamento de Serviços**:
  - Fluxo em 4 etapas com seleção de serviço, barbeiro, data e horário.
  - Listagem de agendamentos com opção de cancelamento.
- **Cadastro de Usuários por Função**:
  - Admins podem cadastrar novos barbeiros.
  - Barbeiros podem cadastrar clientes diretamente pelo sistema.
- **Exibição de Serviços e Barbeiros**:
  - Páginas responsivas com cards contendo nome, imagem, descrição, preço e tempo de duração.
- **Proteção de Rotas**: Autorização condicional via componente `ProtectedRoute` e `AuthProvider`.
- **Layout Responsivo**: Funciona em dispositivos mobile e navegadores web com NativeWind (Tailwind CSS para React Native).

---

## 🧰 Tecnologias Utilizadas

### **Frontend (Expo + React Native)**
- React Native (com suporte Web)
- Expo Router (navegação)
- Firebase Authentication
- Tailwind via NativeWind
- Axios (requisições HTTP)
- `expo-secure-store` (armazenamento seguro)
- `@react-native-community/datetimepicker` (seletor de data)
- `lucide-react-native` (ícones SVG)

### **Backend (MERN Stack)**
- Node.js + Express
- MongoDB + Mongoose
- Firebase Admin SDK (verificação de token de autenticação)

---

## ⚙️ Configuração do Ambiente

### Pré-requisitos
- Node.js (18+)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase Console configurado
- Instância MongoDB (local ou Atlas)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <URL_DO_REPOSITORIO>
cd barbershop-reactnative
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure o Firebase**
Crie `src/services/firebase.ts` com suas credenciais:
```ts
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
export const auth = getAuth(app);
```

4. **Configuração do Backend**
O app espera um backend rodando em `http://localhost:5000/api`. As rotas esperadas incluem:

**Serviços**
- `GET /api/servicos`
- `POST /api/servicos`
- `PUT /api/servicos/:id`
- `DELETE /api/servicos/:id`

**Usuários**
- `GET /api/usuarios`
- `GET /api/usuarios/barbeiros`
- `GET /api/usuarios/firebase/:firebase_uid`
- `POST /api/usuarios`

**Clientes**
- `POST /api/clientes`
- `GET /api/clientes/firebase/:firebase_uid`

**Agendamentos**
- `GET /api/agendamentos`
- `POST /api/agendamentos`
- `PUT /api/agendamentos/:id`
- `DELETE /api/agendamentos/:id`

5. **Execute a aplicação**

- Web:
```bash
npm run web
```

- Mobile (Expo Go):
```bash
npm start
```
Escaneie o QR code com o app **Expo Go**.

---

## 📁 Estrutura do Projeto

```
.
├── src/
│   ├── app/              # Páginas e rotas principais
│   ├── components/       # Componentes reutilizáveis
│   ├── context/          # Contexto de autenticação (AuthProvider)
│   ├── services/         # Serviços API, Firebase e helpers
│   ├── types/            # Interfaces TypeScript
│   └── assets/           # Ícones, imagens e fontes
├── app.json              # Configurações do Expo
├── package.json
└── README.md
```

---

## 📌 Observações
- O projeto está em constante evolução, com planos para suporte a notificações push, histórico de agendamentos e avaliações de serviços/barbeiros.
- Sugestões, pull requests e contribuições são bem-vindas!

---

