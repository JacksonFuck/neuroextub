# Guia de Implantação - NEUROEXTUB (Hostinger)

Este projeto foi refatorado para uma arquitetura moderna usando Vite + React + TypeScript. Siga os passos abaixo para hospedar na sua conta Hostinger.

## 1. Gerar o Build de Produção

No seu ambiente local (ou onde você está rodando o projeto), execute o comando para gerar os arquivos estáticos:

```bash
npm run build
```

Isso criará uma pasta chamada `dist/` na raiz do projeto. Esta pasta contém todos os arquivos necessários para a produção.

## 2. Preparar a Pasta de Destino na Hostinger

1. Acesse o **hPanel** da Hostinger.
2. Vá em **Arquivos > Gerenciador de Arquivos**.
3. Navegue até o diretório do seu domínio (geralmente `public_html`).
4. Se você for hospedar em um subdiretório (ex: `seudominio.com/neuroextub`), crie a pasta correspondente.

## 3. Upload dos Arquivos

1. Abra a pasta `dist/` no seu computador.
2. Selecione **todos** os arquivos e pastas dentro de `dist/`.
3. Arraste e solte no Gerenciador de Arquivos da Hostinger dentro da pasta de destino.

## 4. Configuração do `.htaccess` (Obrigatório para SPA)

Como se trata de uma Single Page Application (SPA), precisamos garantir que qualquer sub-rota seja redirecionada para o `index.html`. 

Crie um arquivo chamado `.htaccess` na raiz da pasta onde você enviou os arquivos com o seguinte conteúdo:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

*Nota: Se você instalou em um subdiretório (ex: `/neuroextub/`), altere `RewriteBase /` para `RewriteBase /neuroextub/` e `RewriteRule . /index.html [L]` para `RewriteRule . /neuroextub/index.html [L]`.*

## 5. Verificação Final

1. Acesse a URL do seu site.
2. Verifique se o protocolo carrega corretamente.
3. Teste a navegação entre as fases e a geração do relatório.

---
**Suporte Técnico:** O sistema foi construído para ser resiliente. Erros de script geralmente estão relacionados a permissões de arquivo na Hostinger (certifique-se de que estão em 644 para arquivos e 755 para pastas).
