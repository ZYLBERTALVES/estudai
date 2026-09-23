# Estudaí

Organizador de estudos feito com React, JavaScript e CSS para um trabalho de faculdade.

## Rodar

Com Node.js 22 ou superior instalado, abra o terminal nesta pasta:

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal, normalmente http://localhost:5173. Para encerrar, use `Ctrl + C`.

## Os três arquivos do site

```text
src/
  App.jsx       → tela, tarefas, formulário e funções
  styles.css    → aparência e adaptação ao celular
  main.jsx      → inicia o React
```

Toda a lógica está em **App.jsx**, dividida por comentários numerados em português. Os componentes `Tarefa`, `Formulario`, `Janela` e `Progresso` também ficam nesse arquivo, abaixo do componente principal `App`.

Os demais arquivos são de apoio:

| Arquivo ou pasta | Para que serve |
| --- | --- |
| `index.html` | Página onde o React é colocado. |
| `package.json` | Dependências e comandos como `npm run dev`. |
| `package-lock.json` | Registro automático das versões das dependências. |
| `vite.config.js` | Configura o Vite e os caminhos do GitHub Pages. |
| `.gitignore` | Diz quais arquivos não enviar ao GitHub. |
| `.github/workflows/deploy.yml` | Publica o site no GitHub Pages. |
| `public/favicon.svg` | Ícone da aba do navegador. |
| `node_modules/` | Bibliotecas instaladas pelo npm; não é código escrito para o trabalho. |
| `dist/` | Site gerado por `npm run build`; pode ser gerado novamente. |

Na apresentação, concentre a explicação em `App.jsx` e `styles.css`. Os arquivos de configuração podem ser explicados pelas funções da tabela, caso o professor pergunte.

## O que o site faz

Cadastra, edita, conclui, reabre e exclui tarefas. Permite buscar, filtrar por disciplina ou situação e ordenar por prazo ou prioridade. Calcula o progresso e salva as tarefas no navegador.

Na primeira abertura, mostra cinco exemplos. A lista continua salva mesmo se você excluir todos. As tarefas ficam apenas neste navegador e endereço, sem sincronização entre dispositivos.

## Como explicar em três minutos

1. **Objetivo:** “Fiz um organizador para acompanhar tarefas e prazos de estudo.”
2. **Demonstração:** cadastre uma tarefa, edite o título e marque como concluída. Mostre o progresso mudando.
3. **Estado:** em `App.jsx`, mostre `useState`. “Ele guarda as tarefas e os filtros. Quando o estado muda, o React atualiza a tela.”
4. **Ações:** mostre `salvarTarefa`, `concluirTarefa` e `excluirTarefa`. “Uso uma nova lista para atualizar o estado. `map` modifica o item escolhido e `filter` retira o item excluído.”
5. **Persistência:** mostre o primeiro `useEffect` e recarregue a página. “Quando as tarefas mudam, salvo a lista no `localStorage`.”
6. **Componentes:** mostre `Tarefa`. “O `map` cria um cartão para cada tarefa. As props passam os dados e as funções para o cartão.”
7. **Visual:** abra `styles.css`. “O CSS define as cores e o layout. As regras `@media` adaptam a tela ao celular.”

Outros conceitos presentes, se perguntarem: JSX descreve a interface; `FormData` lê os campos do formulário; `useRef` dá acesso à janela nativa `<dialog>`; `key` identifica cada tarefa na lista. Os campos dos dados salvos, como `title` e `completed`, continuam em inglês para manter compatibilidade com tarefas cadastradas antes da simplificação.

## GitHub Pages

Crie um repositório público vazio chamado **estudai**, sem README, licença ou `.gitignore` automáticos. Na pasta deste projeto, execute:

```bash
git init -b main
git add .
git commit -m "Adiciona o Estudai"
git remote add origin https://github.com/ZYLBERTALVES/estudai.git
git push -u origin main
```

Se você já conectou o repositório, basta usar `git add .`, `git commit -m "Simplifica o projeto"` e `git push`.

No GitHub, selecione **Settings → Pages → Source → GitHub Actions**. Depois, abra **Actions → Publicar Estudaí no GitHub Pages → Run workflow**. Após a execução ficar verde, o endereço esperado é **https://zylbertalves.github.io/estudai/**.

O workflow instala as dependências e compila o projeto. A pasta `.github` precisa estar no repositório; `node_modules` e `dist` já são ignoradas pelo Git. Os próximos envios à branch `main` atualizam o site automaticamente.
