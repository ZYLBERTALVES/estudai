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

A interface é composta pelos componentes `App`, `Tarefa`, `Formulario`, `Janela` e `Progresso`. Os dados e as funções de interação são compartilhados por meio de props.

O hook `useState` controla a lista de tarefas, os filtros e as janelas da aplicação. O `useEffect` sincroniza as alterações com o `localStorage`, enquanto o `useRef` permite controlar o elemento nativo `<dialog>`. O formulário utiliza `FormData` para obter os valores preenchidos.

As operações de cadastro, edição e exclusão geram novas listas para atualizar o estado. Os totais e a porcentagem de conclusão são calculados a partir das tarefas cadastradas, e a listagem utiliza renderização condicional para apresentar resultados ou indicar a ausência deles.

## Organização do código

```text
src/
├── App.jsx       # Inicialização, componentes e lógica das tarefas
└── styles.css    # Estilos e regras de responsividade
```

## Armazenamento

O projeto funciona no navegador, sem backend ou banco de dados externo. As tarefas são armazenadas no `localStorage` e permanecem disponíveis após recarregar a página. Não há autenticação ou sincronização entre dispositivos; a limpeza dos dados do site remove os registros salvos.

No primeiro acesso, são carregadas cinco tarefas de exemplo para demonstrar as funcionalidades. Esses registros podem ser editados ou excluídos.

## Execução local

Requisitos: Node.js 22 ou superior e npm.

```bash
npm install
npm run dev
```

O endereço local é informado no terminal. O comando `npm run build` gera a versão de produção na pasta `dist`.
