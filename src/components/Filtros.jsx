import { ArrowDownWideNarrow, Search, X } from "lucide-react";
import { DISCIPLINAS } from "../tarefas";

export default function Filtros({
  tarefas,
  busca,
  situacao,
  disciplina,
  ordenacao,
  aoBuscar,
  aoMudarSituacao,
  aoMudarDisciplina,
  aoMudarOrdenacao,
}) {
  const concluidas = tarefas.filter((tarefa) => tarefa.completed).length;
  const pendentes = tarefas.length - concluidas;

  // Os valores vêm do App; os eventos avisam quando um filtro muda.
  return (
    <>
      <div className="task-toolbar">
        <div className="status-tabs" role="group" aria-label="Filtrar por situação">
          <button
            className={situacao === "todas" ? "active" : ""}
            aria-pressed={situacao === "todas"}
            onClick={() => aoMudarSituacao("todas")}
          >
            Todas <span>{tarefas.length}</span>
          </button>
          <button
            className={situacao === "pendentes" ? "active" : ""}
            aria-pressed={situacao === "pendentes"}
            onClick={() => aoMudarSituacao("pendentes")}
          >
            Pendentes <span>{pendentes}</span>
          </button>
          <button
            className={situacao === "concluidas" ? "active" : ""}
            aria-pressed={situacao === "concluidas"}
            onClick={() => aoMudarSituacao("concluidas")}
          >
            Concluídas <span>{concluidas}</span>
          </button>
        </div>
      </div>
      <div className="filter-row">
        <div className="search-field">
          <Search size={17} />
          <input
            aria-label="Buscar tarefas"
            placeholder="Buscar uma tarefa..."
            value={busca}
            onChange={(evento) => aoBuscar(evento.target.value)}
          />
          {busca && (
            <button className="icon-button" aria-label="Limpar busca" onClick={() => aoBuscar("")}>
              <X size={15} />
            </button>
          )}
        </div>
        <select
          className="subject-select"
          aria-label="Filtrar por disciplina"
          value={disciplina}
          onChange={(evento) => aoMudarDisciplina(evento.target.value)}
        >
          <option value="todas">Todas as disciplinas</option>
          {DISCIPLINAS.map((item) => (
            <option key={item.name}>{item.name}</option>
          ))}
        </select>
        <label className="sort-field">
          <ArrowDownWideNarrow size={17} />
          <select
            aria-label="Ordenar tarefas"
            value={ordenacao}
            onChange={(evento) => aoMudarOrdenacao(evento.target.value)}
          >
            <option value="prazo">Prazo</option>
            <option value="prioridade">Prioridade</option>
          </select>
        </label>
      </div>
    </>
  );
}
