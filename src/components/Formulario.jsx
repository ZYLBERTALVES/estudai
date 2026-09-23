import { useState } from "react";
import { Check } from "lucide-react";
import { DISCIPLINAS, dataLocal } from "../tarefas";

export default function Formulario({ tarefa, aoSalvar, aoCancelar }) {
  // Na edição, os campos começam com os dados da tarefa escolhida.
  const [titulo, setTitulo] = useState(tarefa ? tarefa.title : "");
  const [disciplina, setDisciplina] = useState(tarefa ? tarefa.subject : DISCIPLINAS[0].name);
  const [dataEntrega, setDataEntrega] = useState(tarefa ? tarefa.dueDate : dataLocal());
  const [prioridade, setPrioridade] = useState(tarefa ? tarefa.priority : "Média");
  const [observacoes, setObservacoes] = useState(tarefa ? tarefa.description : "");

  function enviarFormulario(evento) {
    evento.preventDefault();
    if (!titulo.trim()) return;

    // Envia os campos para o App adicionar ou editar a tarefa.
    aoSalvar({
      title: titulo.trim(),
      subject: disciplina,
      dueDate: dataEntrega,
      priority: prioridade,
      description: observacoes.trim(),
    });
  }

  return (
    <form onSubmit={enviarFormulario} className="task-form">
      <p className="form-intro">Tire da cabeça, coloque no planejamento.</p>
      <label>
        O que você precisa fazer?
        <input
          autoFocus
          name="title"
          value={titulo}
          onChange={(evento) => setTitulo(evento.target.value)}
          required
          maxLength={100}
          pattern={".*\\S.*"}
          title="Digite um título que não contenha apenas espaços."
          placeholder="Ex.: Revisar os conceitos de React"
        />
      </label>
      <label>
        Disciplina
        <select
          name="subject"
          value={disciplina}
          onChange={(evento) => setDisciplina(evento.target.value)}
        >
          {DISCIPLINAS.map((item) => (
            <option key={item.name}>{item.name}</option>
          ))}
        </select>
      </label>
      <div className="form-row">
        <label>
          Data de entrega
          <input
            type="date"
            name="dueDate"
            value={dataEntrega}
            onChange={(evento) => setDataEntrega(evento.target.value)}
            min="1900-01-01"
            max="9999-12-31"
            required
          />
        </label>
        <label>
          Prioridade
          <select
            name="priority"
            value={prioridade}
            onChange={(evento) => setPrioridade(evento.target.value)}
          >
            <option>Baixa</option>
            <option>Média</option>
            <option>Alta</option>
          </select>
        </label>
      </div>
      <label>
        Observações <span className="optional">(opcional)</span>
        <textarea
          name="description"
          rows={3}
          value={observacoes}
          onChange={(evento) => setObservacoes(evento.target.value)}
          maxLength={500}
          placeholder="Algum detalhe para lembrar?"
        />
      </label>
      <div className="modal-actions">
        <button type="button" className="button button-secondary" onClick={aoCancelar}>
          Cancelar
        </button>
        <button type="submit" className="button button-primary">
          <Check size={17} />
          {tarefa ? "Salvar alterações" : "Criar tarefa"}
        </button>
      </div>
    </form>
  );
}
