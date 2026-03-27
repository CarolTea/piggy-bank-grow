
Objetivo: criar uma experiência própria para quando o porquinho cai de nível e fazer o flashcard fechar de forma realmente imediata ao tocar em “Entendi”.

1. Diferenciar subida vs queda de nível
- Ajustar `Dashboard.tsx` para detectar se a troca de nível foi promoção ou regressão.
- Em vez de tratar tudo como `levelup`, guardar um tipo de transição, por exemplo:
  - `levelup`
  - `leveldown`
- Continuar usando a fila existente, mas enfileirar o evento correto conforme o saldo subir ou descer.

2. Criar uma animação específica de regressão
- Evoluir `LevelUpAnimation.tsx` para suportar dois modos, ou separar em um novo componente dedicado.
- Para regressão:
  - trocar título, mensagem e clima visual
  - inverter a direção visual da transição do porquinho
  - remover confete/festa
  - usar um tom mais suave de “atenção” em vez de celebração
- Mensagem sugerida:
  - “Seu porquinho voltou de nível”
  - “Faça um novo depósito para evoluir novamente”

3. Tocar a música enviada na regressão
- Adicionar o arquivo `porquinho_voltou_de_nível.mp3` em `public/sounds/`.
- Expandir `useSound.ts` com uma função dedicada, por exemplo `playLevelDown`.
- Na animação de regressão, tocar esse áudio no momento principal da transição.

4. Conectar regressão ao saque
- Hoje o saque só altera saldo e fecha o modal.
- O `Dashboard` já observa mudanças de nível por saldo, então com a nova distinção ele poderá disparar automaticamente a animação de regressão após uma retirada que reduza o nível.
- Manter a mesma cadência do app: sucesso do saque primeiro, depois regressão, sem sobreposição.

5. Fazer o flashcard sair sem sensação de atraso
- O clique já chama `onOpenChange(false)`, mas ainda há atraso percebido por dois motivos:
  - o `Dialog` do Radix tem animação de fechamento
  - o `Dashboard` aplica `COOLDOWN_MS` antes da próxima etapa
- Ajustar `FlashcardPopup.tsx` para fechar com saída mais curta ou sem animação perceptível no clique do botão.
- Ajustar `Dashboard.tsx` para permitir avanço imediato quando o overlay fechado for o flashcard, sem esperar o cooldown padrão.
- Resultado esperado: tocou em “Entendi”, o card desaparece praticamente na hora.

6. Arquivos a alterar
- `src/pages/Dashboard.tsx`
  - distinguir promoção e regressão
  - enfileirar `leveldown`
  - pular cooldown após fechamento do flashcard
- `src/components/LevelUpAnimation.tsx`
  - suportar variante de regressão com texto, visual e timing próprios
- `src/hooks/useSound.ts`
  - adicionar `playLevelDown`
- `src/components/FlashcardPopup.tsx`
  - reduzir/eliminar a sensação de atraso ao fechar
- `src/components/WithdrawModal.tsx`
  - provavelmente sem grande refatoração, apenas validar que a cadência continua correta
- `public/sounds/porquinho_voltou_de_nível.mp3`
  - novo áudio da regressão

Detalhes técnicos
- Hoje a diferença entre subir e cair de nível não existe: o código compara apenas `prevLevelRef.current.label !== newLevel.label`.
- A forma correta é comparar a posição do nível antigo e do novo em `PIG_LEVELS`.
- O atraso do flashcard não está só no botão: o `DialogContent` também anima `data-[state=closed]`, e o `Dashboard` ainda espera `COOLDOWN_MS = 800` antes de seguir.
- A correção mais segura é tratar o fechamento do flashcard como “close now”, separado do cooldown usado entre grandes experiências.
