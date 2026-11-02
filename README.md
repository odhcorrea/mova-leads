# Mova Leads

Funil de leads da Mova: uma landing page com um hero e um botão, que leva a duas telas (nome e WhatsApp) e a uma tela de sucesso. Os leads vão para uma planilha do Google Sheets.

Feito em HTML, CSS e JavaScript puros, sem build. A única dependência é o [intl-tel-input](https://github.com/jackocnr/intl-tel-input), carregado por CDN, que faz o campo de WhatsApp com seletor de país.

## Estrutura

```
index.html          Hero + telas do funil
css/style.css       Estilos (cores no topo do arquivo, em :root)
js/config.js        URL de envio dos leads
js/app.js           Navegação, validação e envio
assets/             Logo, mockup do app e imagem das pessoas escaneadas
apps-script/Code.gs Código que recebe os leads e grava na planilha
```

## Rodar localmente

```bash
python3 -m http.server 8000
```

Depois abra http://localhost:8000. Com `endpoint` vazio em `js/config.js`, o funil funciona em modo de teste: nada é enviado e o lead aparece no console do navegador.

## Conectar ao Google Sheets (gratuito)

1. Crie uma planilha nova no Google Sheets (ex.: "Mova Leads").
2. Na planilha, vá em **Extensões > Apps Script**.
3. Apague o conteúdo do editor, cole o conteúdo de `apps-script/Code.gs` e salve.
4. Clique em **Implantar > Nova implantação**.
   - Tipo: **App da Web**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
5. Clique em **Implantar** e autorize o acesso à sua conta quando o Google pedir (aparece um aviso de "app não verificado", porque o script é seu: clique em **Avançado > Acessar**).
6. Copie a **URL do app da Web** (termina em `/exec`) e cole em `js/config.js`:

   ```js
   window.MOVA_CONFIG = {
     endpoint: "https://script.google.com/macros/s/XXXX/exec"
   };
   ```

7. Abra a URL no navegador: deve aparecer `{"ok":true,...}`. Faça um teste pelo funil e confira a aba **Leads** na planilha (ela é criada no primeiro envio).

Cada lead vira uma linha com data, nome, WhatsApp e um link `wa.me` para abrir a conversa direto.

**Se alterar o `Code.gs` depois:** vá em **Implantar > Gerenciar implantações**, edite a implantação existente e escolha **Nova versão**. Assim a URL continua a mesma.

## Personalizar

- **Textos da landing page e das telas:** `index.html`
- **Imagens:** substitua os arquivos em `assets/` mantendo o mesmo nome (a posição de cada imagem na composição fica em `.lp__mockup` e `.lp__people`, em `css/style.css`)
- **Cores e fontes:** variáveis no topo de `css/style.css`

## Observações

- A URL do Apps Script fica visível no código da página, então qualquer pessoa pode enviar dados para ela. Há uma proteção simples contra bots (campo invisível) e o script valida nome e celular antes de gravar.
- O WhatsApp aceita números de qualquer país. O campo começa no Brasil; a pessoa troca o país na bandeira e a máscara e a validação se ajustam. Na planilha o número fica no formato internacional (ex.: `+55 11 98765-4321`, `+351 912 345 678`).
