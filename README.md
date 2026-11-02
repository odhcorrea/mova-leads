# Mova Leads

Funil de leads do Mova, no ar em **https://funil.movaclub.app**.

Uma landing page com os mockups do app e o botão "Eu quero", que leva a duas telas (nome e WhatsApp) e a uma tela de sucesso com confete. Os leads vão para uma planilha do Google Sheets.

Feito em HTML, CSS e JavaScript puros, sem build. Dependências carregadas por CDN:

- [intl-tel-input](https://github.com/jackocnr/intl-tel-input): campo de WhatsApp com seletor de país (lista suspensa no desktop, bottom sheet no celular)
- [canvas-confetti](https://github.com/catdad/canvas-confetti): confete na tela de sucesso

## Estrutura

```
index.html          Landing page + telas do funil
css/style.css       Estilos (cores e fontes no topo do arquivo, em :root)
js/config.js        URL de envio dos leads
js/app.js           Navegação, validação e envio
assets/             Logo, mockups do app e avatar do Dhiego
apps-script/Code.gs Código que recebe os leads e grava na planilha
CNAME               Domínio do GitHub Pages (funil.movaclub.app)
.nojekyll           Faz o GitHub Pages servir os arquivos como estão
```

## Rodar localmente

```bash
python3 -m http.server 8000
```

Depois abra http://localhost:8000. Atenção: com a URL preenchida em `js/config.js`, os testes locais gravam na planilha de verdade. Para testar sem enviar, deixe `endpoint` vazio (o lead aparece só no console do navegador) e não faça commit dessa mudança.

## Publicação

O site é publicado pelo **GitHub Pages** a partir da branch **`main`**. O que está na `main` é o que está no ar.

1. Crie uma branch a partir da `main` e faça as alterações nela.
2. Dê merge na `main` (por PR ou direto) e envie para o GitHub.
3. Em cerca de 1 minuto o GitHub publica sozinho.

Quem já abriu o funil pode continuar vendo a versão anterior por até 10 minutos, porque o GitHub Pages manda o navegador guardar os arquivos em cache. Para conferir na hora, use uma aba anônima.

**Domínio:** o DNS do `movaclub.app` fica na Hostinger. O subdomínio `funil` é um registro `CNAME` apontando para `odhcorrea.github.io`. A home `movaclub.app` continua na Vercel e não depende deste projeto. O HTTPS é gerado e renovado pelo GitHub.

Se mexer no domínio pelas configurações do GitHub Pages, o GitHub cria commits no arquivo `CNAME` da `main`. Dê `git pull` antes de continuar.

## Conectar ao Google Sheets (gratuito)

1. Crie uma planilha nova no Google Sheets (ex.: "Mova Leads").
2. Na planilha, vá em **Extensões > Apps Script**.
3. Apague o conteúdo do editor, cole o conteúdo de `apps-script/Code.gs` e salve.
4. Clique em **Implantar > Nova implantação**.
   - Tipo: **App da Web**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
5. Clique em **Implantar** e autorize o acesso à sua conta quando o Google pedir (aparece um aviso de "app não verificado", porque o script é seu: clique em **Avançado > Acessar**). Se a URL responder "Acesso negado", selecione `doGet` no editor e clique em **Executar** para concluir a autorização.
6. Copie a **URL do app da Web** (termina em `/exec`) e cole em `js/config.js`:

   ```js
   window.MOVA_CONFIG = {
     endpoint: "https://script.google.com/macros/s/XXXX/exec"
   };
   ```

7. Abra a URL no navegador: deve aparecer `{"ok":true,...}`. Faça um teste pelo funil e confira a aba **Leads** na planilha (ela é criada no primeiro envio).

Cada lead vira uma linha com data, nome, WhatsApp e um link `wa.me` para abrir a conversa direto.

**Se alterar o `Code.gs` depois:** cole o código novo no editor, vá em **Implantar > Gerenciar implantações**, edite a implantação existente e escolha **Nova versão**. Assim a URL continua a mesma.

## Personalizar

- **Textos da landing page e das telas:** `index.html`
- **Imagens:** substitua os arquivos em `assets/` mantendo o mesmo nome
- **Cores e fontes:** variáveis no topo de `css/style.css`

## Segurança

- A URL do Apps Script fica visível no código da página, mas ela só sabe **adicionar uma linha** depois de validar nome e WhatsApp. Ninguém consegue ler, editar ou apagar a planilha por ela.
- Há uma proteção simples contra bots (campo invisível que pessoas não preenchem).
- Ainda **não** há limite contra envios em massa. Próximos passos possíveis: ignorar WhatsApp repetido, limitar envios por minuto, alerta por e-mail quando o volume passar do normal e, com o domínio no ar, o captcha invisível Cloudflare Turnstile.

## Observações

- O WhatsApp aceita números de qualquer país. O campo começa no Brasil; a pessoa troca o país na bandeira e a máscara e a validação se ajustam. Na planilha o número fica no formato internacional (ex.: `+55 11 98765-4321`, `+351 912 345 678`).
