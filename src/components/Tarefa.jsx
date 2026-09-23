import { CalendarDays, Check, Pencil, Trash2 } from "lucide-react";
import { DISCIPLINAS, dataLocal, mostrarData } from "../tarefas";

// Mostra uma tarefa e avisa o App quando um botão é clicado.
export default function Tarefa({ tarefa, aoConcluir, aoEditar, aoExcluir }) {
  const disciplina = DISCIPLINAS.find((item) => item.name === tarefa.subject);
  const cor = disciplina ? disciplina.color : "green";
  const atrasada = !tarefa.completed && tarefa.dueDate < dataLocal();

  let classePrioridade = "priority-low";
  if (tarefa.priority === "Alta") classePrioridade = "priority-high";
  if (tarefa.priority === "Média") classePrioridade = "priority-medium";

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
          <span className={`subject-badge ${cor}`}>{tarefa.subject}</span>
          <span className={`priority ${classePrioridade}`}>
            <span />
            {tarefa.priority}
          </span>
        </div>
        <h3>{tarefa.title}</h3>
        {tarefa.description && <p className="task-description">{tarefa.description}</p>}
        <span className={`task-date ${atrasada ? "overdue" : ""}`}>
          <CalendarDays size={13} />
          <time dateTime={tarefa.dueDate}>{mostrarData(tarefa.dueDate)}</time>
          {atrasada && <span>· Atrasada</span>}
          {tarefa.completed && <span className="completed-label">· Concluída</span>}
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
