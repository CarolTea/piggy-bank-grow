## Problema
A música ambiente usa `audio.play()` dentro de um `useEffect` no Dashboard. Navegadores bloqueiam autoplay sem gesto direto do usuário, então:
- Funciona quando o usuário clica "Entrar" e é redirecionado.
- **Falha** em refresh direto no `/dashboard`, deep links, ou em iOS Safari onde o gesto não "atravessa" o `await`/navegação.

O erro é silenciado por `.catch(() => {})`, então parece aleatório.

## Correção proposta

**1. Garantir que a música arme no clique de Login (gesto direto)**
No `handleLogin` do `src/pages/Login.tsx`, chamar `startBgMusic()` **sincronamente dentro do onClick**, antes do `await` de autenticação. Assim o navegador registra o gesto.

**2. Fallback "tap-to-start" quando autoplay é bloqueado**
No `useSound`, fazer `startBgMusic()` retornar a Promise do `play()` e detectar rejeição. Se rejeitar:
- Marcar estado global `bgBlocked = true`.
- Registrar um listener `once` em `document` para `pointerdown`/`touchstart` que tenta `play()` de novo automaticamente no próximo toque do usuário.

**3. Resumir AudioContext junto**
Chamar `audioCtx.resume()` no mesmo gesto, pois ele também pode estar suspenso após reload.

**4. Logar falhas em vez de engolir**
Trocar `.catch(() => {})` por `.catch(err => console.warn('bg music blocked:', err.name))` para diagnosticar futuros casos.

## Arquivos afetados
- `src/hooks/useSound.ts` — endurecer `startBgMusic` com fallback de gesto e log.
- `src/pages/Login.tsx` — disparar `startBgMusic()` no onClick do botão Entrar (sincronamente).
- `src/pages/Dashboard.tsx` — manter o `useEffect` como tentativa otimista (sem mudanças funcionais).

## Resultado esperado
- Login normal: música começa imediatamente (gesto do botão).
- Refresh em `/dashboard`: tentativa otimista; se bloqueada, começa no primeiro toque/clique do usuário na tela — sem que ele perceba.
