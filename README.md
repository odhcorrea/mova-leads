# Mova Leads

Funis de leads do Mova. O mesmo site atende vários subdomínios, e o subdomínio decide quem aparece no balão da tela do WhatsApp:

| Endereço | Funil | Hospedagem |
|---|---|---|
| https://funil.movaclub.app | `funil` (Dhiego) | GitHub Pages |
| https://alex.movaclub.app | `alex` | Cloudflare Pages |
| https://laura.movaclub.app | `laura` | Cloudflare Pages |
| https://natalia.movaclub.app | `natalia` | Cloudflare Pages |

Avatar, nome, textos e Instagram de cada funil ficam em `js/funis.js`. Todos os leads vão para a mesma planilha, com a coluna **Funil** dizendo de onde veio cada um. Para ver um funil localmente: `http://localhost:8000/?funil=laura`.

**Novo funil:** acrescente a pessoa em `js/funis.js` (a chave é o subdomínio), adicione o domínio no projeto do Cloudflare Pages e crie o `CNAME` na Hostinger.

Uma landing page com os mockups do app e o botão "Eu quero", que leva a duas telas (nome e WhatsApp) e a uma tela de sucesso com confete. Os leads vão para uma planilha do Google Sheets.

Feito em HTML, CSS e JavaScript puros, sem build. Dependências carregadas por CDN:

- [intl-tel-input](https://github.com/jackocnr/intl-tel-input): campo de WhatsApp com seletor de país (lista suspensa no desktop, bottom sheet no celular)
- [canvas-confetti](https://github.com/catdad/canvas-confetti): confete na tela de sucesso

## Estrutura

```
index.html          Landing page + telas do funil
css/style.css       Estilos (cores e fontes no topo do arquivo, em :root)
js/config.js        URL de envio dos leads
js/funis.js         Conteúdo de cada funil (pessoa do balão, textos, Instagram)
js/app.js           Navegação, validação e envio
assets/             Logo, mockups do app e avatares
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

O site é publicado a partir da branch **`main`**, em dois lugares ao mesmo tempo: **GitHub Pages** (`funil.movaclub.app`) e **Cloudflare Pages** (`alex`, `laura` e `natalia`). O GitHub Pages só aceita um domínio por repositório; o Cloudflare Pages aceita vários no mesmo projeto. O que está na `main` é o que está no ar.

1. Crie uma branch a partir da `main` e faça as alterações nela.
2. Dê merge na `main` (por PR ou direto) e envie para o GitHub.
3. Em cerca de 1 minuto o GitHub publica sozinho.

Quem já abriu o funil pode continuar vendo a versão anterior por até 10 minutos, porque o GitHub Pages manda o navegador guardar os arquivos em cache. Para conferir na hora, use uma aba anônima.

**Domínio:** o DNS do `movaclub.app` fica na Hostinger. O subdomínio `funil` é um registro `CNAME` apontando para `odhcorrea.github.io`; `alex`, `laura` e `natalia` são `CNAME` apontando para o endereço `.pages.dev` do projeto no Cloudflare Pages (configurado sem build, publicando a pasta raiz). A home `movaclub.app` continua na Vercel e não depende deste projeto. O HTTPS é gerado e renovado pelo GitHub.

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

Cada lead vira uma linha com data, nome, WhatsApp, um link `wa.me` para abrir a conversa direto e o funil de origem.

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
