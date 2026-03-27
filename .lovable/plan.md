
# Ajustar a cadência pós-depósito

## Objetivo
Garantir uma experiência em sequência, sem sobreposição:
```text
PIX confirmado
→ pausa curta
→ animação de mudança de nível (se houver)
→ pausa curta
→ 1 flashcard
```

## Causa do problema atual
Hoje os eventos são disparados por caminhos diferentes e acabam concorrendo:
- `addBalance()` roda antes de a experiência do PIX terminar, então o `Dashboard` detecta level-up cedo demais.
- O flashcard é enfileirado separadamente no `onSuccess` do depósito.
- O timer de 20s também pode enfileirar flashcard enquanto outra experiência ainda está acontecendo.
- O `FlashcardPopup` escolhe o card com `getRandomFlashcard()` a cada render, o que pode parecer “dois cards”.

## Plano de implementação

### 1. Centralizar o fluxo no `Dashboard`
Refatorar o controle atual de overlays para um fluxo único de experiência:
- criar um estado/ref para “flow ativo” (`entry`, `deposit`, `levelup`, `flashcard`)
- criar fila com itens estruturados, não só strings
- impedir enqueue duplicado do mesmo tipo enquanto ele já estiver ativo ou pendente
- adicionar pequenos intervalos entre etapas para a pessoa “curtir” cada momento

### 2. Tirar o level-up do gatilho imediato do `balance`
Em vez de abrir a animação assim que o saldo muda:
- detectar que houve mudança de nível
- guardar isso como “level-up pendente”
- só disparar a animação depois que o fluxo do PIX terminar completamente

Isso resolve o principal conflito de timing.

### 3. Fazer o `DepositModal` avisar o fim real da jornada do PIX
Ajustar o `DepositModal` para separar melhor os eventos:
- continuar mostrando a animação/som de sucesso do PIX
- fechar o modal
- só então notificar o `Dashboard` com um callback tipo “depósito concluído”
- o `Dashboard` decide a próxima etapa: level-up primeiro, flashcard depois

### 4. Prioridade clara entre eventos
Definir esta ordem:
```text
1. Earnings de entrada
2. PIX sucesso
3. Level-up (se existir)
4. Flashcard
```

Regras:
- flashcard nunca abre durante `earnings`, `deposit` ou `levelup`
- timer de flashcard fica bloqueado enquanto houver fluxo ativo
- se o timer vencer durante outra animação, ele vira apenas “flashcard pendente”
- mostrar apenas 1 flashcard por vez e sem duplicar enqueue

### 5. Fixar o flashcard escolhido ao abrir
No `FlashcardPopup`:
- sortear o card apenas quando o popup abrir
- manter esse card em estado local até fechar
- evitar trocar de conteúdo em re-renders internos

Isso elimina a sensação de dois cards aparecendo.

## Cadência sugerida
Vou usar uma cadência mais “jogo”:
- fim do PIX → pausa de ~500–700ms
- level-up → tela dedicada completa
- fim do level-up → pausa de ~700–1000ms
- abrir flashcard

Se não houver level-up:
- fim do PIX → pausa curta
- flashcard

## Arquivos a ajustar
1. `src/pages/Dashboard.tsx`
   - centralizar a orquestração do fluxo
   - bloquear duplicidades
   - adiar flashcard e level-up corretamente

2. `src/components/DepositModal.tsx`
   - separar “saldo atualizado” de “experiência PIX finalizada”
   - disparar callback final apenas no momento certo

3. `src/components/FlashcardPopup.tsx`
   - persistir o flashcard sorteado durante a exibição

## Resultado esperado
Depois do ajuste, ao depositar:
- a pessoa vê a confirmação do PIX inteira
- depois vê a evolução do porquinho, se subiu de nível
- só depois aparece um único flashcard
- nunca mais tudo ao mesmo tempo

## Detalhes técnicos
- O ponto crítico é remover a dependência de timing implícito entre `balance`, `activeOverlay` e `onSuccess`.
- A solução mais segura é tratar cada experiência como evento orquestrado pelo `Dashboard`, com fila, prioridade e cooldown curto entre overlays.
