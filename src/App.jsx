import { StrictMode, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import {
  ArrowDownWideNarrow, ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Check,
  CheckCheck, CircleHelp, Clock3, GraduationCap, ListTodo, Pencil, Plus,
  Search, Sparkles, Target, Trash2, X,
} from "lucide-react";


// 1. DADOS E FUNÇÕES AUXILIARES: disciplinas, exemplos, datas e busca.
const CHAVE = "estudai-tasks-v1";

const DISCIPLINAS = [
  { name: "Frontend II", color: "purple" },
  { name: "Banco de Dados", color: "blue" },
  { name: "Engenharia de Software", color: "orange" },
  { name: "Redes de Computadores", color: "pink" },
  { name: "Outros estudos", color: "green" },
];

// Usa o horário local para evitar que uma tarefa mude de dia por causa do fuso.
function dataLocal(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function converterData(value) {
  return new Date(`${value}T12:00:00`);
}

function mostrarData(value, today = new Date()) {
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (value === dataLocal(today)) return "Hoje";
  if (value === dataLocal(tomorrow)) return "Amanhã";
  return converterData(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function criarExemplos() {
  function day(offset) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return dataLocal(date);
  }

  return [
    {
      id: "example-1",
      title: "Criar os componentes do projeto React",
      subject: "Frontend II",
      priority: "Alta",
      dueDate: day(0),
      description:
        "Separar a interface em componentes e praticar o uso de props.",
      completed: false,
    },
    {
      id: "example-2",
      title: "Revisar consultas SQL",
      subject: "Banco de Dados",
      priority: "Média",
      dueDate: day(1),
      description: "Revisar SELECT, JOIN e GROUP BY com os exercícios da aula.",
      completed: false,
    },
    {
      id: "example-3",
      title: "Desenhar o diagrama de casos de uso",
      subject: "Engenharia de Software",
      priority: "Média",
      dueDate: day(3),
      description: "",
      completed: false,
    },
    {
      id: "example-4",
      title: "Ler o material sobre protocolos de rede",
      subject: "Redes de Computadores",
      priority: "Baixa",
      dueDate: day(5),
      description: "",
      completed: false,
    },
    {
      id: "example-5",
      title: "Organizar as anotações da semana",
      subject: "Outros estudos",
      priority: "Baixa",
      dueDate: day(0),
      description: "",
      completed: true,
    },
  ];
}

function tarefaValida(tarefa) {
  return (
    tarefa &&
    typeof tarefa.id === "string" &&
    typeof tarefa.title === "string" &&
    tarefa.title.trim().length > 0 &&
    DISCIPLINAS.some((subject) => subject.name === tarefa.subject) &&
    ["Alta", "Média", "Baixa"].includes(tarefa.priority) &&
    typeof tarefa.dueDate === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(tarefa.dueDate) &&
    !Number.isNaN(converterData(tarefa.dueDate).getTime()) &&
    dataLocal(converterData(tarefa.dueDate)) === tarefa.dueDate &&
    typeof tarefa.description === "string" &&
    typeof tarefa.completed === "boolean"
  );
}

function filtrarTarefas(tarefas, { busca, situacao, subject, sort }) {
  const normalize = (text) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const priorityOrder = { Alta: 0, Média: 1, Baixa: 2 };

  return tarefas
    .filter((tarefa) => {
      const matchesSearch = normalize(`${tarefa.title} ${tarefa.subject}`).includes(
        normalize(busca.trim()),
      );
      const matchesStatus =
        situacao === "all" ||
        (situacao === "completed" ? tarefa.completed : !tarefa.completed);
      return (
        matchesSearch &&
        matchesStatus &&
        (subject === "all" || tarefa.subject === subject)
      );
    })
    .sort((a, b) => {
      if (a.completed !== b.completed)
        return Number(a.completed) - Number(b.completed);
      if (sort === "priority")
        return (
          priorityOrder[a.priority] - priorityOrder[b.priority] ||
          a.dueDate.localeCompare(b.dueDate)
        );
      return a.dueDate.localeCompare(b.dueDate);
    });
}


// 2. APLICAÇÃO: estado, salvamento, ações e tela principal.
function carregarTarefas() {
  try {
    const saved = localStorage.getItem(CHAVE);
    if (saved === null) return { tarefas: criarExemplos(), warning: "" };
    const tarefas = JSON.parse(saved);
    if (!Array.isArray(tarefas) || !tarefas.every(tarefaValida))
      throw new Error("Invalid tasks");
    return { tarefas, warning: "" };
  } catch {
    return {
      tarefas: criarExemplos(),
      warning:
        "Não foi possível recuperar os dados salvos. Exibindo tarefas de exemplo.",
    };
  }
}

function App() {
  // useState guarda os dados. Quando mudam, o React atualiza a tela.
  const [inicio] = useState(carregarTarefas);
  const [tarefas, setTarefas] = useState(inicio.tarefas);
  const [aviso, setAviso] = useState(inicio.warning);
  const [busca, setBusca] = useState("");
  const [situacao, setSituacao] = useState("all");
  const [subject, setDisciplina] = useState("all");
  const [sort, setOrdem] = useState("date");
  const [janela, setJanela] = useState(null);
  const [mensagem, setMensagem] = useState("");

  // Mantém os dados após atualizar a página, sem precisar de um servidor.
  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(tarefas));
    } catch {
      setAviso(
        "O navegador não permitiu salvar. Suas alterações ficarão disponíveis apenas nesta sessão.",
      );
    }
  }, [tarefas]);

  useEffect(() => {
    if (!mensagem) return;
    const timeout = setTimeout(() => setMensagem(""), 3500);
    return () => clearTimeout(timeout);
  }, [mensagem]);

  // Os indicadores são calculados a partir das tarefas.
  const completed = tarefas.filter((tarefa) => tarefa.completed).length;
  const pending = tarefas.length - completed;
  const dueToday = tarefas.filter(
    (tarefa) => !tarefa.completed && tarefa.dueDate === dataLocal(),
  ).length;
  const tarefasVisiveis = filtrarTarefas(tarefas, { busca, situacao, subject, sort });
  const temFiltros = busca.trim() || situacao !== "all" || subject !== "all";
  const today = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Estas são as ações dos botões do site.
  function salvarTarefa(form) {
    if (janela.tarefa) {
      setTarefas((current) =>
        current.map((tarefa) =>
          tarefa.id === janela.tarefa.id ? { ...tarefa, ...form } : tarefa,
        ),
      );
      setMensagem("Alterações salvas!");
    } else {
      setTarefas((current) => [
        ...current,
        { ...form, id: crypto.randomUUID(), completed: false },
      ]);
      limparFiltros();
      setMensagem("Nova tarefa adicionada. Um passo mais perto!");
    }
    setJanela(null);
  }

  function concluirTarefa(id) {
    const selected = tarefas.find((tarefa) => tarefa.id === id);
    setTarefas((current) =>
      current.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, completed: !tarefa.completed } : tarefa,
      ),
    );
    setMensagem(
      selected.completed
        ? "Tarefa reaberta."
        : "Mais uma conquista! Tarefa concluída.",
    );
  }

  function excluirTarefa() {
    setTarefas((current) => current.filter((tarefa) => tarefa.id !== janela.tarefa.id));
    setJanela(null);
    setMensagem("Tarefa excluída.");
  }

  function limparFiltros() {
    setBusca("");
    setSituacao("all");
    setDisciplina("all");
  }

  function selecionarDisciplina(value) {
    setDisciplina(value);
    setBusca("");
    setSituacao("all");
    document
      .getElementById("tasks")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <a className="skip-link" href="#tasks">
        Ir para as tarefas
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a href="#" className="brand" aria-label="Estudaí, início">
            <span className="brand-mark">
              <BookOpen size={24} />
            </span>
            <span>
              estudaí<span className="brand-period">.</span>
            </span>
          </a>
          <button
            className="help-button"
            onClick={() => setJanela({ type: "help" })}
          >
            <CircleHelp size={17} />
            <span>Como funciona</span>
          </button>
          <span className="profile-icon" title="Seu espaço de estudos">
            <GraduationCap size={22} />
          </span>
        </div>
      </header>

      <main className="page-shell">
        <div className="page-heading">
          <div>
            <h1>Seu semestre, mais leve.</h1>
            <p>Organize as tarefas. Encontre seu ritmo. Vá mais longe.</p>
          </div>
          <span className="today-date">
            <CalendarDays size={16} />
            {today}
          </span>
        </div>

        <section className="hero-banner" aria-label="Boas-vindas">
          <div className="hero-copy">
            <h2>
              Pequenos passos.
              <br />
              <span>Grandes conquistas.</span>
            </h2>
            <p>
              Uma tarefa de cada vez é tudo o que você precisa
              <br className="desktop-break" /> para transformar planos em
              progresso.
            </p>
            <button
              className="hero-link"
              onClick={() => setJanela({ type: "form" })}
            >
              Vamos planejar? <ArrowRight size={17} />
            </button>
          </div>
          <div className="study-illustration" aria-hidden="true">
            <span className="illustration-orbit" />
            <span className="illustration-star star-one">✦</span>
            <span className="illustration-star star-two">✧</span>
            <div className="floating-label">
              <span>
                <Check size={13} strokeWidth={3} />
              </span>
              Você dá conta!
            </div>
            <div className="book book-back">
              <span>UM DIA DE CADA VEZ</span>
            </div>
            <div className="book book-front">
              <span className="notebook-label">
                IDEIAS &<br />
                PLANOS<span>O próximo passo começa aqui.</span>
              </span>
              <span className="book-flower">✳</span>
              <div className="notebook-lines" />
            </div>
            <div className="pencil" />
            <div className="mini-note">
              <CheckCheck size={19} />
              <span>
                menos caos,
                <br />
                <strong>mais foco.</strong>
              </span>
            </div>
          </div>
        </section>

        {aviso && (
          <div className="storage-warning" role="alert">
            {aviso}
            <button
              className="icon-button"
              aria-label="Fechar aviso"
              onClick={() => setAviso("")}
            >
              <X size={16} />
            </button>
          </div>
        )}

        <section className="stats-grid" aria-label="Resumo das tarefas">
          {[
            {
              label: "Total de tarefas",
              value: tarefas.length,
              icon: ListTodo,
              color: "green",
            },
            {
              label: "Em andamento",
              value: pending,
              icon: Clock3,
              color: "orange",
            },
            {
              label: "Concluídas",
              value: completed,
              icon: CheckCheck,
              color: "purple",
            },
            {
              label: "Para hoje",
              value: dueToday,
              icon: CalendarDays,
              color: "blue",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div className="stat-card" key={label}>
              <span className={`stat-icon ${color}`}>
                <Icon size={21} strokeWidth={1.7} />
              </span>
              <div>
                <span>{label}</span>
                <strong>{String(value).padStart(2, "0")}</strong>
              </div>
            </div>
          ))}
        </section>

        <div className="workspace-grid">
          <section
            className="tasks-section"
            id="tasks"
            aria-labelledby="tasks-heading"
          >
            <div className="section-heading">
              <div>
                <h2 id="tasks-heading">
                  Minhas tarefas <span>{tarefas.length}</span>
                </h2>
              </div>
              <button
                className="button button-primary"
                onClick={() => setJanela({ type: "form" })}
              >
                <Plus size={18} />
                Nova tarefa
              </button>
            </div>
            <div className="task-toolbar">
              <div
                className="status-tabs"
                role="group"
                aria-label="Filtrar por situação"
              >
                {[
                  { id: "all", label: "Todas", count: tarefas.length },
                  { id: "pending", label: "Pendentes", count: pending },
                  { id: "completed", label: "Concluídas", count: completed },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={situacao === tab.id ? "active" : ""}
                    aria-pressed={situacao === tab.id}
                    onClick={() => setSituacao(tab.id)}
                  >
                    {tab.label}
                    <span>{tab.count}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-row">
              <div className="search-field">
                <Search size={17} />
                <input
                  aria-label="Buscar tarefas"
                  placeholder="Buscar uma tarefa..."
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                />
                {busca && (
                  <button
                    className="icon-button"
                    aria-label="Limpar busca"
                    onClick={() => setBusca("")}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
              <select
                className="subject-select"
                aria-label="Filtrar por disciplina"
                value={subject}
                onChange={(event) => setDisciplina(event.target.value)}
              >
                <option value="all">Todas as disciplinas</option>
                {DISCIPLINAS.map((item) => (
                  <option key={item.name}>{item.name}</option>
                ))}
              </select>
              <label className="sort-field">
                <ArrowDownWideNarrow size={17} />
                <select
                  aria-label="Ordenar tarefas"
                  value={sort}
                  onChange={(event) => setOrdem(event.target.value)}
                >
                  <option value="date">Prazo</option>
                  <option value="priority">Prioridade</option>
                </select>
              </label>
            </div>
            {temFiltros && (
              <div className="filter-summary">
                <span>
                  {tarefasVisiveis.length}{" "}
                  {tarefasVisiveis.length === 1
                    ? "tarefa encontrada"
                    : "tarefas encontradas"}
                </span>
                <button onClick={limparFiltros}>
                  Limpar filtros <X size={12} />
                </button>
              </div>
            )}
            <div className="task-list">
              {tarefasVisiveis.map((tarefa) => (
                <Tarefa
                  key={tarefa.id}
                  tarefa={tarefa}
                  aoConcluir={concluirTarefa}
                  aoEditar={(selected) =>
                    setJanela({ type: "form", tarefa: selected })
                  }
                  aoExcluir={(selected) =>
                    setJanela({ type: "delete", tarefa: selected })
                  }
                />
              ))}
            </div>
            {!tarefasVisiveis.length && (
              <div className="empty-state">
                <span>
                  <BookOpen size={30} />
                </span>
                <h3>
                  {temFiltros
                    ? "Nenhuma tarefa por aqui."
                    : "Seu próximo passo começa aqui."}
                </h3>
                <p>
                  {temFiltros
                    ? "Tente outro termo ou ajuste os filtros."
                    : "Adicione sua primeira tarefa e comece a se organizar."}
                </p>
                <button
                  className="button button-secondary"
                  onClick={
                    temFiltros ? limparFiltros : () => setJanela({ type: "form" })
                  }
                >
                  {temFiltros ? "Limpar filtros" : "Criar primeira tarefa"}
                </button>
              </div>
            )}
            <p className="list-footer">
              <Check size={14} />
              Marque as tarefas concluídas e celebre cada passo.
            </p>
          </section>
          <Progresso tarefas={tarefas} aoSelecionarDisciplina={selecionarDisciplina} />
        </div>
        <footer className="site-footer">
          <span>
            <BookOpen size={15} /> estudaí. <span>Feito para o seu ritmo.</span>
          </span>
          <span>
            Seus dados ficam salvos neste navegador{" "}
            <span className="save-dot" />
          </span>
        </footer>
      </main>

      {janela?.type === "form" && (
        <Janela
          title={
            janela.tarefa ? "Editar tarefa" : "Uma nova tarefa, um novo passo."
          }
          aoFechar={() => setJanela(null)}
        >
          <Formulario
            tarefa={janela.tarefa}
            aoSalvar={salvarTarefa}
            aoCancelar={() => setJanela(null)}
          />
        </Janela>
      )}
      {janela?.type === "delete" && (
        <Janela title="Excluir esta tarefa?" aoFechar={() => setJanela(null)}>
          <p className="delete-description">
            A tarefa <strong>“{janela.tarefa.title}”</strong> será excluída. Esta
            ação não pode ser desfeita.
          </p>
          <div className="modal-actions">
            <button
              className="button button-secondary"
              onClick={() => setJanela(null)}
            >
              Cancelar
            </button>
            <button className="button button-danger" onClick={excluirTarefa}>
              Excluir tarefa
            </button>
          </div>
        </Janela>
      )}
      {janela?.type === "help" && (
        <Janela
          title="Menos bagunça, mais espaço para aprender."
          aoFechar={() => setJanela(null)}
        >
          <div className="help-content">
            <p>
              O Estudaí é seu organizador pessoal de estudos. Começamos com
              algumas tarefas de exemplo; você pode editar ou excluir todas
              elas.
            </p>
            <ol>
              <li>
                <strong>Planeje seu próximo passo.</strong>
                <span>
                  Clique em “Nova tarefa”, escolha a disciplina, a prioridade e
                  a data de entrega.
                </span>
              </li>
              <li>
                <strong>Encontre o que precisa.</strong>
                <span>
                  Busque pelo nome ou disciplina, filtre por situação e organize
                  por prazo ou prioridade.
                </span>
              </li>
              <li>
                <strong>Veja seu progresso acontecer.</strong>
                <span>
                  Marque o quadradinho ao lado da tarefa para concluir. Você
                  pode clicar novamente para reabrir.
                </span>
              </li>
            </ol>
            <p className="help-storage">
              <Sparkles size={18} />
              As tarefas são salvas automaticamente neste navegador. Não há
              login nem sincronização entre dispositivos. Limpar os dados do
              navegador remove as tarefas.
            </p>
            <button
              className="button button-primary"
              onClick={() => setJanela(null)}
            >
              Entendi, vamos estudar <ArrowRight size={17} />
            </button>
          </div>
        </Janela>
      )}
      <div
        className={`toast ${mensagem ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {mensagem && (
          <>
            <span>
              <Check size={15} />
            </span>
            {mensagem}
          </>
        )}
      </div>
    </>
  );
}


// 3. CARTÃO: componente repetido para cada tarefa.
function Tarefa({ tarefa, aoConcluir, aoEditar, aoExcluir }) {
  const color =
    DISCIPLINAS.find((subject) => subject.name === tarefa.subject)?.color || "green";
  const overdue = !tarefa.completed && tarefa.dueDate < dataLocal();

  return (
    <article className={`task-card ${tarefa.completed ? "is-completed" : ""}`}>
      <button
        className="task-checkbox"
        role="checkbox"
        aria-checked={tarefa.completed}
        aria-label={`${tarefa.completed ? "Reabrir" : "Concluir"}: ${tarefa.title}`}
        onClick={() => aoConcluir(tarefa.id)}
      >
        {tarefa.completed && <Check size={15} strokeWidth={3} />}
      </button>
      <div className="task-content">
        <div className="task-meta">
          <span className={`subject-badge ${color}`}>{tarefa.subject}</span>
          <span
            className={`priority priority-${tarefa.priority === "Alta" ? "high" : tarefa.priority === "Média" ? "medium" : "low"}`}
          >
            <span />
            {tarefa.priority}
          </span>
        </div>
        <h3>{tarefa.title}</h3>
        {tarefa.description && (
          <p className="task-description">{tarefa.description}</p>
        )}
        <span className={`task-date ${overdue ? "overdue" : ""}`}>
          <CalendarDays size={13} />
          <time dateTime={tarefa.dueDate}>{mostrarData(tarefa.dueDate)}</time>
          {overdue && <span>· Atrasada</span>}
          {tarefa.completed && (
            <span className="completed-label">· Concluída</span>
          )}
        </span>
      </div>
      <div className="task-actions">
        <button
          className="icon-button"
          aria-label={`Editar: ${tarefa.title}`}
          title="Editar tarefa"
          onClick={() => aoEditar(tarefa)}
        >
          <Pencil size={16} />
        </button>
        <button
          className="icon-button delete-button"
          aria-label={`Excluir: ${tarefa.title}`}
          title="Excluir tarefa"
          onClick={() => aoExcluir(tarefa)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}

// 4. FORMULÁRIO: os mesmos campos servem para criar e editar.
function Formulario({ tarefa, aoSalvar, aoCancelar }) {
  function enviarFormulario(event) {
    event.preventDefault();
    // Lê os campos de uma vez, quando o usuário envia o formulário.
    const fields = new FormData(event.currentTarget);
    const form = {
      title: fields.get("title").trim(),
      subject: fields.get("subject"),
      dueDate: fields.get("dueDate"),
      priority: fields.get("priority"),
      description: fields.get("description").trim(),
    };
    if (form.title) aoSalvar(form);
  }

  return (
    <form onSubmit={enviarFormulario} className="task-form">
      <p className="form-intro">Tire da cabeça, coloque no planejamento.</p>
      <label>O que você precisa fazer?
        <input autoFocus name="title" defaultValue={tarefa?.title || ""} required maxLength={100}
          pattern={".*\\S.*"} title="Digite um título que não contenha apenas espaços."
          placeholder="Ex.: Revisar os conceitos de React" />
      </label>
      <label>Disciplina
        <select name="subject" defaultValue={tarefa?.subject || DISCIPLINAS[0].name}>
          {DISCIPLINAS.map((item) => <option key={item.name}>{item.name}</option>)}
        </select>
      </label>
      <div className="form-row">
        <label>Data de entrega
          <input type="date" name="dueDate" defaultValue={tarefa?.dueDate || dataLocal()}
            min="1900-01-01" max="9999-12-31" required />
        </label>
        <label>Prioridade
          <select name="priority" defaultValue={tarefa?.priority || "Média"}>
            <option>Baixa</option><option>Média</option><option>Alta</option>
          </select>
        </label>
      </div>
      <label>Observações <span className="optional">(opcional)</span>
        <textarea name="description" rows={3} defaultValue={tarefa?.description || ""}
          maxLength={500} placeholder="Algum detalhe para lembrar?" />
      </label>
      <div className="modal-actions">
        <button type="button" className="button button-secondary" onClick={aoCancelar}>Cancelar</button>
        <button type="submit" className="button button-primary">
          <Check size={17} />{tarefa ? "Salvar alterações" : "Criar tarefa"}
        </button>
      </div>
    </form>
  );
}

// 5. JANELA: componente usado no formulário, na exclusão e na ajuda.
// O dialog nativo mantém o foco dentro da janela e permite fechar com Escape.
function Janela({ title, children, aoFechar }) {
  const referencia = useRef(null);

  useEffect(() => {
    const dialog = referencia.current;
    dialog.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = oldOverflow;
    };
  }, []);

  return (
    <dialog
      ref={referencia}
      className="modal"
      aria-labelledby="modal-title"
      onCancel={aoFechar}
      onClick={(event) => {
        if (event.target === event.currentTarget) aoFechar();
      }}
    >
      <div className="modal-heading">
        <h2 id="modal-title">{title}</h2>
        <button
          type="button"
          className="icon-button"
          aria-label="Fechar janela"
          onClick={aoFechar}
        >
          <X size={21} />
        </button>
      </div>
      {children}
    </dialog>
  );
}

// 6. PROGRESSO: calcula os indicadores a partir das tarefas.
function Progresso({ tarefas, aoSelecionarDisciplina }) {
  const completed = tarefas.filter((tarefa) => tarefa.completed).length;
  const percentage = tarefas.length
    ? Math.round((completed / tarefas.length) * 100)
    : 0;
  const nextTask = tarefas
    .filter((tarefa) => !tarefa.completed)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];

  return (
    <aside className="sidebar">
      <section className="panel progress-panel">
        <div className="panel-heading">
          <h2>Seu progresso</h2>
          <Target size={19} />
        </div>
        <div
          className="progress-ring"
          style={{ "--progress": `${percentage}%` }}
          role="img"
          aria-label={`${percentage}% das tarefas concluídas`}
        >
          <div>
            <strong>
              {percentage}
              <span>%</span>
            </strong>
            <span>concluído</span>
          </div>
        </div>
        <h3>
          {percentage === 100
            ? "Você mandou bem!"
            : completed
              ? "Cada tarefa conta!"
              : "Tudo começa com um passo."}
        </h3>
        <p>
          {tarefas.length ? (
            <>
              <strong>
                {completed} de {tarefas.length} tarefas
              </strong>{" "}
              concluídas.
              <br />
              {percentage === 100
                ? "Aproveite a sensação de dever cumprido."
                : "Continue no seu ritmo. Você consegue."}
            </>
          ) : (
            "Adicione sua primeira tarefa para começar."
          )}
        </p>
        <div className="subject-progress">
          <span className="eyebrow">POR DISCIPLINA</span>
          {DISCIPLINAS.filter((subject) =>
            tarefas.some((tarefa) => tarefa.subject === subject.name),
          ).map((subject) => {
            const group = tarefas.filter((tarefa) => tarefa.subject === subject.name);
            const done = group.filter((tarefa) => tarefa.completed).length;
            return (
              <button
                className="subject-progress-item"
                key={subject.name}
                onClick={() => aoSelecionarDisciplina(subject.name)}
                title={`Filtrar ${subject.name}`}
              >
                <span className={`subject-dot ${subject.color}`} />
                <span>{subject.name}</span>
                <span className="subject-count">
                  {done}/{group.length}
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <section className="next-panel">
        <div className="panel-heading">
          <span className="eyebrow">
            <CalendarDays size={15} /> PRÓXIMA ENTREGA
          </span>
          <ArrowUpRight size={19} />
        </div>
        {nextTask ? (
          <>
            <h3>{nextTask.title}</h3>
            <p>
              {nextTask.subject} <span>·</span> {mostrarData(nextTask.dueDate)}
            </p>
          </>
        ) : (
          <>
            <h3>Tudo em dia por aqui.</h3>
            <p>Seu próximo passo pode ser uma pausa.</p>
          </>
        )}
      </section>
      <div className="gentle-note">
        <Sparkles size={17} />
        <p>
          Não precisa fazer tudo hoje.
          <br />
          Só precisa dar o próximo passo.
        </p>
      </div>
    </aside>
  );
}

// Inicializa a aplicação no elemento root do index.html.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
