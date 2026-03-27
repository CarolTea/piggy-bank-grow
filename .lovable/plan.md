

# Integrar Sons WAV Customizados

## Resumo
Substituir sons sintetizados por 3 arquivos WAV reais enviados pelo usuário, mapeados pelo nome:

| Arquivo | Onde usar | Substitui |
|---------|-----------|-----------|
| `abriu_o_app.wav` | Ao abrir o app (Login → Dashboard) | `playSuccess` no Login |
| `porquinho_aumentou_mudou_de_nivel.wav` | Quando o porquinho sobe de nível | `playLevelUp` no EvolutionaryPig |
| `entrada_do_card.wav` | Quando o flashcard popup aparece | `playCelebration` no FlashcardPopup |

## Mudanças

### 1. Copiar arquivos para `public/sounds/`
- `abriu_o_app.wav` → `public/sounds/abriu_o_app.wav`
- `porquinho_aumentou_mudou_de_nivel.wav` → `public/sounds/level_up.wav`
- `entrada_do_card.wav` → `public/sounds/card_entry.wav`

### 2. Atualizar `src/hooks/useSound.ts`
- Criar helper `playFile(path)` que usa `new Audio(path).play()`
- `playLevelUp` → toca `/sounds/level_up.wav`
- `playCelebration` → toca `/sounds/card_entry.wav`
- Adicionar novo `playAppOpen` → toca `/sounds/abriu_o_app.wav`
- Manter os demais sons sintetizados (click, nav, deposit, etc.)

### 3. Atualizar `src/pages/Login.tsx`
- Importar e usar `playAppOpen` em vez de `playSuccess` no handleLogin

### Arquivos modificados
1. `public/sounds/` — 3 arquivos WAV copiados
2. `src/hooks/useSound.ts` — helper playFile + substituir 3 sons
3. `src/pages/Login.tsx` — usar playAppOpen

