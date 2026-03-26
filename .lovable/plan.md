

# Tela de Perfil + Histórico + PIX Integrado ao Saque

## Resumo
Criar duas novas páginas (Perfil e Histórico), salvar a chave PIX no perfil do usuário, e fazer o saque usar automaticamente essa chave cadastrada — eliminando o passo manual de digitar a chave e prevenindo fraudes.

## Mudanças

### 1. Tela de Perfil (`src/pages/Profile.tsx`) — nova
- Header com avatar (iniciais do nome), nome e e-mail do usuário
- Campo para cadastrar/editar chave PIX (CPF, e-mail, telefone ou aleatória)
- Botão "Salvar" que persiste a chave no AuthContext
- Seção com wallet address (truncado)
- Botão de logout

### 2. Tela de Histórico (`src/pages/History.tsx`) — nova
- Lista de transações usando `mockTransactionHistory()`
- Cada item mostra: ícone (depósito verde ↓, saque vermelho ↑, yield dourado ⚡), valor, data formatada e status
- Visual tipo timeline com cards estilizados
- Mensagem "Nenhuma transação" se vazio

### 3. Salvar PIX no contexto (`src/contexts/AuthContext.tsx`)
- Adicionar `pixKey: string` ao estado do user e `setPixKey` ao contexto
- Persistir no estado (mock, sem backend)

### 4. Saque usa chave do perfil (`src/components/WithdrawModal.tsx`)
- Remover o passo `pixkey` do modal
- Ao sacar, verificar se `user.pixKey` existe; se não, mostrar aviso "Cadastre sua chave PIX no Perfil"
- Se existe, mostrar a chave cadastrada (mascarada) e pedir apenas confirmação

### 5. Rotas e navegação
- `src/App.tsx` — adicionar rotas `/profile` e `/history`
- `src/components/BottomNav.tsx` — atualizar paths: Histórico → `/history`, Perfil → `/profile`, corrigir lógica de `active`

## Arquivos
1. `src/pages/Profile.tsx` — **novo**
2. `src/pages/History.tsx` — **novo**
3. `src/contexts/AuthContext.tsx` — adicionar pixKey + setPixKey
4. `src/components/WithdrawModal.tsx` — usar pixKey do contexto
5. `src/App.tsx` — novas rotas
6. `src/components/BottomNav.tsx` — corrigir paths

