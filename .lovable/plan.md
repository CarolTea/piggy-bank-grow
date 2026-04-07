

# Corrigir autenticação: publicar o app e testar na URL pública

## Diagnóstico

Os dois problemas relatados são **limitações conhecidas do ambiente de preview**, não bugs no código:

1. **Google OAuth 404**: O proxy do preview interfere com as requisições de autenticação do OAuth, causando erro 404.
2. **Link de confirmação de e-mail vai para login do Lovable**: A URL de preview requer autenticação do Lovable, então o link de confirmação redireciona para o login do Lovable em vez de confirmar a conta.

## Solução

**Publicar o app** e testar na URL pública (`.lovable.app`). Ambos os fluxos (Google e confirmação de e-mail) funcionam corretamente na URL publicada.

### Passo a passo

1. Clicar no botão **Publish** (canto superior direito do editor)
2. Publicar o projeto para gerar a URL pública
3. Testar o login com Google na URL publicada
4. Testar o cadastro por e-mail e a confirmação na URL publicada

### Nenhuma alteração de código é necessária

O código de autenticação está implementado corretamente:
- Google OAuth usa `lovable.auth.signInWithOAuth` (padrão correto)
- Signup com e-mail usa `supabase.auth.signUp` com `emailRedirectTo: window.location.origin`
- O listener `onAuthStateChange` gerencia a sessão corretamente

