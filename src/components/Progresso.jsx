import {
  ArrowUpRight,
  CalendarDays,
  CheckCheck,
  Clock3,
  ListTodo,
  Sparkles,
  Target,
} from "lucide-react";
import { DISCIPLINAS, dataLocal, mostrarData } from "../tarefas";

export function Resumo({ tarefas }) {
  const concluidas = tarefas.filter((tarefa) => tarefa.completed).length;
  const pendentes = tarefas.length - concluidas;
  const paraHoje = tarefas.filter(
    (tarefa) => !tarefa.completed && tarefa.dueDate === dataLocal(),
  ).length;

  return (
    <section className="stats-grid" aria-label="Resumo das tarefas">
      <div className="stat-card">
        <span className="stat-icon green">
          <ListTodo size={21} strokeWidth={1.7} />
        </span>
        <div>
          <span>Total de tarefas</span>
          <strong>{String(tarefas.length).padStart(2, "0")}</strong>
        </div>
      </div>
      <div className="stat-card">
        <span className="stat-icon orange">
          <Clock3 size={21} strokeWidth={1.7} />
        </span>
        <div>
          <span>Em andamento</span>
          <strong>{String(pendentes).padStart(2, "0")}</strong>
        </div>
      </div>
      <div className="stat-card">
        <span className="stat-icon purple">
          <CheckCheck size={21} strokeWidth={1.7} />
        </span>
        <div>
          <span>Concluídas</span>
          <strong>{String(concluidas).padStart(2, "0")}</strong>
        </div>
      </div>
      <div className="stat-card">
        <span className="stat-icon blue">
          <CalendarDays size={21} strokeWidth={1.7} />
        </span>
        <div>
          <span>Para hoje</span>
          <strong>{String(paraHoje).padStart(2, "0")}</strong>
        </div>
      </div>
    </section>
  );
}

export function Progresso({ tarefas, aoSelecionarDisciplina }) {
  // Calcula o progresso sem guardar outro estado.
  const concluidas = tarefas.filter((tarefa) => tarefa.completed).length;
  let porcentagem = 0;
  if (tarefas.length > 0) {
    porcentagem = Math.round((concluidas / tarefas.length) * 100);
  }

  const pendentes = tarefas.filter((tarefa) => !tarefa.completed);
  pendentes.sort((primeira, segunda) => primeira.dueDate.localeCompare(segunda.dueDate));
  const proximaTarefa = pendentes[0];

  let tituloProgresso = "Tudo começa com um passo.";
  let mensagemProgresso = "Continue no seu ritmo. Você consegue.";
  if (porcentagem === 100) {
    tituloProgresso = "Você mandou bem!";
    mensagemProgresso = "Aproveite a sensação de dever cumprido.";
  } else if (concluidas > 0) {
    tituloProgresso = "Cada tarefa conta!";
  }

  return (
    <aside className="sidebar">
      <section className="panel progress-panel">
        <div className="panel-heading">
          <h2>Seu progresso</h2>
          <Target size={19} />
        </div>
        <div
          className="progress-ring"
          style={{ "--progress": `${porcentagem}%` }}
          role="img"
          aria-label={`${porcentagem}% das tarefas concluídas`}
        >
          <div>
            <strong>
              {porcentagem}
              <span>%</span>
            </strong>
            <span>concluído</span>
          </div>
        </div>
        <h3>{tituloProgresso}</h3>
        <p>
          {tarefas.length > 0 ? (
            <>
              <strong>
                {concluidas} de {tarefas.length} tarefas
              </strong>{" "}
              concluídas.
              <br />
              {mensagemProgresso}
            </>
          ) : (
            "Adicione sua primeira tarefa para começar."
          )}
        </p>
        <div className="subject-progress">
          <span className="eyebrow">POR DISCIPLINA</span>
          {DISCIPLINAS.map((disciplina) => {
            const tarefasDaDisciplina = tarefas.filter(
              (tarefa) => tarefa.subject === disciplina.name,
            );
            if (tarefasDaDisciplina.length === 0) return null;

            const concluidasDaDisciplina = tarefasDaDisciplina.filter(
              (tarefa) => tarefa.completed,
            ).length;
            return (
              <button
                className="subject-progress-item"
                key={disciplina.name}
                onClick={() => aoSelecionarDisciplina(disciplina.name)}
                title={`Filtrar ${disciplina.name}`}
              >
                <span className={`subject-dot ${disciplina.color}`} />
                <span>{disciplina.name}</span>
                <span className="subject-count">
                  {concluidasDaDisciplina}/{tarefasDaDisciplina.length}
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
        {proximaTarefa ? (
          <>
            <h3>{proximaTarefa.title}</h3>
            <p>
              {proximaTarefa.subject} <span>·</span> {mostrarData(proximaTarefa.dueDate)}
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
