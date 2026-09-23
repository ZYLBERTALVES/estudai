import { useEffect, useState } from "react";
import { BookOpen, Check, Plus, X } from "lucide-react";
import { CHAVE, carregarTarefas } from "./tarefas";
import { Ajuda, Apresentacao, Cabecalho, Rodape } from "./components/Layout";
import { Progresso, Resumo } from "./components/Progresso";
import Tarefa from "./components/Tarefa";
import Formulario from "./components/Formulario";
import Filtros from "./components/Filtros";
import Modal from "./components/Modal";

// Permite pesquisar sem diferenciar maiúsculas e acentos.
function normalizarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function App() {
  // Carrega e guarda a lista de tarefas.
  const [dadosIniciais] = useState(carregarTarefas);
  const [tarefas, setTarefas] = useState(dadosIniciais.tarefas);
  const [aviso, setAviso] = useState(dadosIniciais.aviso);
  const [busca, setBusca] = useState("");
  const [situacao, setSituacao] = useState("todas");
  const [disciplina, setDisciplina] = useState("todas");
  const [ordenacao, setOrdenacao] = useState("prazo");
  const [janela, setJanela] = useState("");
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [mensagem, setMensagem] = useState("");

  // Salva as tarefas no navegador quando a lista muda.
  useEffect(() => {
    if (!dadosIniciais.podeSalvar) return;
    try {
      localStorage.setItem(CHAVE, JSON.stringify(tarefas));
    } catch {
      setAviso(
        "O navegador não permitiu salvar. Suas alterações ficarão disponíveis apenas nesta sessão.",
      );
    }
  }, [tarefas, dadosIniciais.podeSalvar]);

  useEffect(() => {
    if (!mensagem) return;
    const tempo = setTimeout(() => setMensagem(""), 3500);
    return () => clearTimeout(tempo);
  }, [mensagem]);

  function limparFiltros() {
    setBusca("");
    setSituacao("todas");
    setDisciplina("todas");
  }

  function selecionarDisciplina(nome) {
    limparFiltros();
    setDisciplina(nome);
    document.getElementById("tasks").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function abrirFormulario(tarefa = null) {
    setTarefaSelecionada(tarefa);
    setJanela("formulario");
  }

  function pedirExclusao(tarefa) {
    setTarefaSelecionada(tarefa);
    setJanela("excluir");
  }

  function fecharModal() {
    setJanela("");
    setTarefaSelecionada(null);
  }

  // Adiciona uma nova tarefa sem alterar a lista anterior.
  function adicionarTarefa(dados) {
    const novaTarefa = { ...dados, id: crypto.randomUUID(), completed: false };
    setTarefas([...tarefas, novaTarefa]);
    limparFiltros();
    fecharModal();
    setMensagem("Nova tarefa adicionada. Um passo mais perto!");
  }

  // O map substitui apenas a tarefa que está sendo editada.
  function editarTarefa(dados) {
    const tarefasAtualizadas = tarefas.map((tarefa) => {
      if (tarefa.id === tarefaSelecionada.id) {
        return { ...tarefa, ...dados };
      }
      return tarefa;
    });
    setTarefas(tarefasAtualizadas);
    fecharModal();
    setMensagem("Alterações salvas!");
  }

  function excluirTarefa() {
    const tarefasRestantes = tarefas.filter((tarefa) => tarefa.id !== tarefaSelecionada.id);
    setTarefas(tarefasRestantes);
    fecharModal();
    setMensagem("Tarefa excluída.");
  }

  function concluirTarefa(id) {
    const tarefasAtualizadas = tarefas.map((tarefa) => {
      if (tarefa.id === id) {
        return { ...tarefa, completed: !tarefa.completed };
      }
      return tarefa;
    });
    setTarefas(tarefasAtualizadas);
    setMensagem("Situação da tarefa atualizada.");
  }

  // Filtra as tarefas pelo texto, pela situação e pela disciplina.
  const tarefasFiltradas = tarefas.filter((tarefa) => {
    const texto = normalizarTexto(`${tarefa.title} ${tarefa.subject}`);
    if (!texto.includes(normalizarTexto(busca.trim()))) return false;
    if (situacao === "pendentes" && tarefa.completed) return false;
    if (situacao === "concluidas" && !tarefa.completed) return false;
    if (disciplina !== "todas" && tarefa.subject !== disciplina) return false;
    return true;
  });

  // Ordena a lista filtrada; a lista guardada no estado permanece intacta.
  const ordemPrioridades = { Alta: 1, Média: 2, Baixa: 3 };
  tarefasFiltradas.sort((primeira, segunda) => {
    if (primeira.completed !== segunda.completed) {
      if (primeira.completed) return 1;
      return -1;
    }
    if (ordenacao === "prioridade" && primeira.priority !== segunda.priority) {
      return ordemPrioridades[primeira.priority] - ordemPrioridades[segunda.priority];
    }
    return primeira.dueDate.localeCompare(segunda.dueDate);
  });
  const temFiltros = busca.trim() !== "" || situacao !== "todas" || disciplina !== "todas";

  return (
    <>
      <Cabecalho aoAbrirAjuda={() => setJanela("ajuda")} />
      <main className="page-shell">
        <Apresentacao aoCriar={() => abrirFormulario()} />
        {aviso && (
          <div className="storage-warning" role="alert">
            {aviso}
            <button className="icon-button" aria-label="Fechar aviso" onClick={() => setAviso("")}>
              <X size={16} />
            </button>
          </div>
        )}
        <Resumo tarefas={tarefas} />
        <div className="workspace-grid">
          <section className="tasks-section" id="tasks" aria-labelledby="tasks-heading">
            <div className="section-heading">
              <div>
                <h2 id="tasks-heading">
                  Minhas tarefas <span>{tarefas.length}</span>
                </h2>
              </div>
              <button className="button button-primary" onClick={() => abrirFormulario()}>
                <Plus size={18} /> Nova tarefa
              </button>
            </div>
            <Filtros
              tarefas={tarefas}
              busca={busca}
              situacao={situacao}
              disciplina={disciplina}
              ordenacao={ordenacao}
              aoBuscar={setBusca}
              aoMudarSituacao={setSituacao}
              aoMudarDisciplina={setDisciplina}
              aoMudarOrdenacao={setOrdenacao}
            />
            {temFiltros && (
              <div className="filter-summary">
                <span>
                  {tarefasFiltradas.length}{" "}
                  {tarefasFiltradas.length === 1 ? "tarefa encontrada" : "tarefas encontradas"}
                </span>
                <button onClick={limparFiltros}>
                  Limpar filtros <X size={12} />
                </button>
              </div>
            )}
            <div className="task-list">
              {/* Cria um componente para cada tarefa. */}
              {tarefasFiltradas.map((tarefa) => (
                <Tarefa
                  key={tarefa.id}
                  tarefa={tarefa}
                  aoConcluir={concluirTarefa}
                  aoEditar={abrirFormulario}
                  aoExcluir={pedirExclusao}
                />
              ))}
            </div>
            {tarefasFiltradas.length === 0 && (
              <div className="empty-state">
                <span>
                  <BookOpen size={30} />
                </span>
                <h3>
                  {temFiltros ? "Nenhuma tarefa por aqui." : "Seu próximo passo começa aqui."}
                </h3>
                <p>
                  {temFiltros
                    ? "Tente outro termo ou ajuste os filtros."
                    : "Adicione sua primeira tarefa e comece a se organizar."}
                </p>
                <button
                  className="button button-secondary"
                  onClick={temFiltros ? limparFiltros : () => abrirFormulario()}
                >
                  {temFiltros ? "Limpar filtros" : "Criar primeira tarefa"}
                </button>
              </div>
            )}
            <p className="list-footer">
              <Check size={14} /> Marque as tarefas concluídas e celebre cada passo.
            </p>
          </section>
          <Progresso tarefas={tarefas} aoSelecionarDisciplina={selecionarDisciplina} />
        </div>
        <Rodape />
      </main>
      {janela === "formulario" && (
        <Modal
          titulo={tarefaSelecionada ? "Editar tarefa" : "Uma nova tarefa, um novo passo."}
          aoFechar={fecharModal}
        >
          <Formulario
            tarefa={tarefaSelecionada}
            aoSalvar={tarefaSelecionada ? editarTarefa : adicionarTarefa}
            aoCancelar={fecharModal}
          />
        </Modal>
      )}
      {janela === "excluir" && (
        <Modal titulo="Excluir esta tarefa?" aoFechar={fecharModal}>
          <p className="delete-description">
            A tarefa <strong>“{tarefaSelecionada.title}”</strong> será excluída. Esta ação não pode
            ser desfeita.
          </p>
          <div className="modal-actions">
            <button className="button button-secondary" onClick={fecharModal}>
              Cancelar
            </button>
            <button className="button button-danger" onClick={excluirTarefa}>
              Excluir tarefa
            </button>
          </div>
        </Modal>
      )}
      {janela === "ajuda" && (
        <Modal titulo="Menos bagunça, mais espaço para aprender." aoFechar={fecharModal}>
          <Ajuda aoFechar={fecharModal} />
        </Modal>
      )}
      <div className={`toast ${mensagem ? "visible" : ""}`} role="status" aria-live="polite">
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
