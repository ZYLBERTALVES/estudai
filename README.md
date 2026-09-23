# Estudaí — Organizador de estudos

Projeto acadêmico de Frontend II desenvolvido com React. A aplicação permite registrar atividades de estudo, organizar prazos por disciplina e acompanhar a conclusão das tarefas.

**[Acessar a aplicação](https://zylbertalves.github.io/estudai/)**

## Objetivo

Aplicar os conceitos de desenvolvimento de interfaces com React em um organizador de tarefas acadêmicas. O projeto reúne cadastro de dados, interação com formulários, atualização de estado e persistência local em uma interface responsiva.

## Funcionalidades

- Cadastro e edição de tarefas com título, disciplina, data de entrega, prioridade e observações.
- Conclusão e reabertura de tarefas.
- Exclusão com confirmação.
- Busca por título ou disciplina e filtros por situação e disciplina.
- Ordenação por prazo ou prioridade.
- Identificação de tarefas atrasadas e da próxima entrega pendente.
- Indicadores de tarefas cadastradas, pendentes, concluídas e com entrega no dia.
- Acompanhamento do progresso geral e por disciplina.
- Salvamento automático no navegador.
- Layout adaptado para computadores e celulares.

## Tecnologias utilizadas

| Tecnologia | Aplicação no projeto |
| --- | --- |
| React | Componentes, gerenciamento de estado e atualização da interface. |
| JavaScript | Operações sobre as tarefas, filtros, ordenação e cálculo dos indicadores. |
| CSS | Estilização e responsividade com media queries. |
| Vite | Ambiente de desenvolvimento e geração da versão de produção. |
| Lucide React | Ícones da interface. |
| GitHub Pages e Actions | Hospedagem e publicação automática. |

## Implementação

A interface está organizada em componentes: o `App` concentra a lista, os filtros e as ações sobre as tarefas. Os componentes recebem dados e funções por meio de props para apresentar os campos, cartões, indicadores e janelas.

O hook `useState` controla a lista de tarefas, os filtros, as janelas e os campos do formulário. Os eventos `onClick`, `onChange` e `onSubmit` conectam as ações do usuário às funções da aplicação. O `useEffect` salva a lista no `localStorage` e controla a abertura do elemento nativo `<dialog>`.

As operações de cadastro, edição e exclusão geram novas listas para atualizar o estado. O método `map` atualiza e apresenta as tarefas, enquanto `filter` seleciona resultados e remove registros. Os totais e a porcentagem de conclusão são calculados a partir da lista. A renderização condicional apresenta resultados, avisos e janelas conforme o estado da aplicação.

## Organização do código

```text
src/
├── main.jsx              # Inicialização do React
├── App.jsx               # Estados, ações, filtros e integração
├── styles.css            # Visual e responsividade
├── tarefas.js            # Exemplos, disciplinas, datas e leitura dos dados
└── components/
    ├── Tarefa.jsx        # Cartão de uma tarefa e seus botões
    ├── Formulario.jsx    # Campos de cadastro e edição
    ├── Filtros.jsx       # Busca, situação, disciplina e ordenação
    ├── Progresso.jsx     # Resumo, progresso e próxima entrega
    ├── Modal.jsx         # Janela reutilizada pelos formulários e avisos
    └── Layout.jsx        # Cabeçalho, apresentação, rodapé e ajuda
```

## Armazenamento

O projeto funciona no navegador, sem backend ou banco de dados externo. As tarefas são armazenadas no `localStorage` e permanecem disponíveis após recarregar a página. Não há autenticação ou sincronização entre dispositivos; a limpeza dos dados do site remove os registros salvos.

No primeiro acesso, são carregadas cinco tarefas de exemplo para demonstrar as funcionalidades. Esses registros podem ser editados ou excluídos.

O formato de armazenamento das tarefas foi mantido para preservar os registros de versões anteriores. Se os dados não puderem ser lidos, a aplicação exibe um aviso e exemplos temporários, sem substituir o conteúdo salvo.

## Execução local

Requisitos: Node.js 22 ou superior e npm.

```bash
npm install
npm run dev
```

O endereço local é informado no terminal. O comando `npm run build` gera a versão de produção na pasta `dist`.
