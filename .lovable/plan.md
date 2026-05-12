## Handoff para Dev React Native — Smart Pig

Vou gerar um documento Markdown completo (`/mnt/documents/handoff-react-native.md`) que seu dev pode abrir no editor dele. O conteúdo cobre tudo que ele precisa para reconstruir o app fielmente em React Native (Expo recomendado).

### Estrutura do documento

**1. Visão geral do produto**
- O que é o Smart Pig (poupança gamificada com "Web3 invisível" na Stellar).
- Modos da tela inicial: `Demo` (pitch) vs `Experiência` (login real).
- Público: usuário leigo em cripto — toda terminologia DeFi é abstraída.

**2. Stack recomendada (RN)**
- Expo SDK + TypeScript + Expo Router (equivalente ao react-router-dom).
- `nativewind` (Tailwind no RN) ou `tamagui` para manter os tokens.
- `react-native-reanimated` + `moti` no lugar de `framer-motion`.
- `react-native-svg` para o porquinho (SVG já pronto, basta portar).
- `expo-av` para os sons (mesmos arquivos em `/sounds/`).
- `@supabase/supabase-js` + `@react-native-async-storage/async-storage` para auth.
- `@gorhom/bottom-sheet` no lugar dos `Dialog` shadcn.

**3. Design system (tokens HSL)**
- Tabela completa das variáveis de `index.css`: background `260 20% 8%`, primary `320 90% 58%`, secondary `270 80% 60%`, accent `38 100% 55%`, success `145 80% 48%`, gold `42 100% 58%`.
- Gradientes: `gradient-primary` (pink→purple), `gradient-hot` (orange→pink), `gradient-gold`.
- Glows (box-shadow → `react-native-shadow-2`): pink, gold, green, purple.
- Fonte: Nunito (400/600/700/800/900).
- Border radius padrão: 1rem (16px). Cards: 2rem.

**4. Telas e rotas**
| Rota | Tela | Conteúdo |
|---|---|---|
| `/` | Login | Toggle Demo/Experiência, email+senha, olho de mostrar senha |
| `/dashboard` | Dashboard | Header gradient, porquinho, saldo, CTAs (Depositar/Sacar/Educação), card "Como rende", dica |
| `/education` | Educação | FlashcardSwiper (12 cards) + barra de progresso |
| `/profile` | Perfil | Avatar, carteira, chave PIX (CRUD), logout |
| `/history` | Histórico | Lista de transações (deposit/withdraw/yield) |

**5. Sistema do Porquinho (gamificação)**
- 5 níveis com regras exatas (label, faixa de saldo, tamanho, cores, olhos, extras):
  - Bebê (R$0–100, rosa claro, olhos fofos)
  - Esperto (R$100–500, óculos)
  - Forte (R$500–1k, bandana, olhar fechado)
  - Dourado (R$1k–5k, glow dourado)
  - Rei (R$5k+, coroa, glow laranja)
- SVG completo (basta copiar JSX e trocar `<svg>` por `Svg` de `react-native-svg`).
- Animações por nível (bounce + scale específicos).

**6. Fluxos críticos**

*Depósito PIX (mock)*
- input → tela com QR + chave `smartpig@stellar.pay` → timer 10s mas auto-confirma em 3s → processing 1.8s (`mockDeposit`) → success com confetti + som `pix_in_completo.mp3` → fecha modal → emite `onSuccess()` para o Dashboard.
- Quick values: 10, 50, 100, 500. Toggle "Pix Automático".

*Saque PIX*
- Bloqueia se `user.pixKey` vazio → manda para `/profile`.
- input → confirm (chave mascarada) → processing (`mockWithdraw`, 2s) → success "1-2 dias úteis" + som `pix_out_complete.wav`.

*Orquestração de overlays no Dashboard*
- Fila estrita com cooldown 800ms: `earnings` (entrada) → `levelup`/`leveldown` (se balance mudar de faixa) → `flashcard` (educacional após depósito ou após 20s ocioso).
- Apenas 1 flashcard por sessão.

**7. Estado global**
- `AuthContext`: Supabase auth (email/senha, auto-confirm habilitado, Google **desativado**), perfil em tabela `profiles` (`name`, `avatar_url`, `pix_key`).
- `BalanceContext`: saldo inicial R$347.52, rendimento simulado 5.87% a.a. compondo a cada 10s.
- `useSound`: AudioContext + arquivos em `/public/sounds/`, mute persistido em `localStorage` (no RN, `AsyncStorage`).

**8. Sons (arquivos a copiar para `assets/sounds/`)**
`som_moeda.mp3`, `level_up.wav`, `pix_in_completo.mp3`, `pix_out_complete.wav`, `card_entry.wav`, `porquinho_voltou_de_nivel.mp3`, `abriu_o_app.wav`. Volumes documentados (0.5–0.8). Sons sintetizados (click/swipe/success/error/nav) podem ser tocados via `expo-av` com arquivos curtos ou recriados com lib de oscilador.

**9. Backend (Lovable Cloud / Supabase)**
- URL e anon key (já no `.env` do projeto web — replicar no `app.config.ts` do Expo).
- Tabela `profiles` (schema). RLS ativo.
- Auth: signup com `data.full_name`, sem confirmação de email obrigatória no fluxo de UX (configurar igual ao web).
- Web3 é **mockado** em `mockWeb3Services.ts` — em RN, manter os mesmos mocks até integração real com Privy/Blend/Jupiter.

**10. Conteúdo dos 12 Flashcards DeFi**
Lista completa (id, título, conteúdo, emoji, gradiente de cor) — copy & paste direto. Todos textos em PT-BR já revisados.

**11. Microcopy e tom**
- Sempre PT-BR informal mas confiável.
- Stellar (NUNCA mencionar Solana — já foi removido).
- "Rendendo via Stellar ⚡", "Powered by Stellar", "Confirmando na Stellar...".
- Streak 🔥, emojis discretos em CTAs.

**12. Checklist de paridade visual**
Itens que o dev precisa validar lado a lado com o web (animação do porquinho, gradiente animado do header, partículas, glow no saldo, confetti do depósito, etc.).

### Entrega

Gero o arquivo em `/mnt/documents/handoff-react-native.md` e apresento como artifact baixável. Tamanho estimado: 15–20 KB, em uma página única e navegável.
