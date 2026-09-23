// Mantém a chave e os campos das tarefas já salvas na versão anterior.
const CHAVE = "estudai-tasks-v1";

const DISCIPLINAS = [
  { name: "Frontend II", color: "purple" },
  { name: "Banco de Dados", color: "blue" },
  { name: "Engenharia de Software", color: "orange" },
  { name: "Redes de Computadores", color: "pink" },
  { name: "Outros estudos", color: "green" },
];

// Usa o horário local para evitar que uma tarefa mude de dia por causa do fuso.
function dataLocal(data = new Date()) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function converterData(valor) {
  return new Date(`${valor}T12:00:00`);
}

function mostrarData(valor, hoje = new Date()) {
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);
  if (valor === dataLocal(hoje)) return "Hoje";
  if (valor === dataLocal(amanha)) return "Amanhã";
  return converterData(valor).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function criarExemplos() {
  function prazoEmDias(dias) {
    const data = new Date();
    data.setDate(data.getDate() + dias);
    return dataLocal(data);
  }

  return [
    {
      id: "example-1",
      title: "Criar os componentes do projeto React",
      subject: "Frontend II",
      priority: "Alta",
      dueDate: prazoEmDias(0),
      description: "Separar a interface em componentes e praticar o uso de props.",
      completed: false,
    },
    {
      id: "example-2",
      title: "Revisar consultas SQL",
      subject: "Banco de Dados",
      priority: "Média",
      dueDate: prazoEmDias(1),
      description: "Revisar SELECT, JOIN e GROUP BY com os exercícios da aula.",
      completed: false,
    },
    {
      id: "example-3",
      title: "Desenhar o diagrama de casos de uso",
      subject: "Engenharia de Software",
      priority: "Média",
      dueDate: prazoEmDias(3),
      description: "",
      completed: false,
    },
    {
      id: "example-4",
      title: "Ler o material sobre protocolos de rede",
      subject: "Redes de Computadores",
      priority: "Baixa",
      dueDate: prazoEmDias(5),
      description: "",
      completed: false,
    },
    {
      id: "example-5",
      title: "Organizar as anotações da semana",
      subject: "Outros estudos",
      priority: "Baixa",
      dueDate: prazoEmDias(0),
      description: "",
      completed: true,
    },
  ];
}

function tarefaValida(tarefa) {
  if (!tarefa || typeof tarefa !== "object") return false;

  return (
    typeof tarefa.id === "string" &&
    typeof tarefa.title === "string" &&
    typeof tarefa.subject === "string" &&
    ["Alta", "Média", "Baixa"].includes(tarefa.priority) &&
    typeof tarefa.dueDate === "string" &&
    typeof tarefa.description === "string" &&
    typeof tarefa.completed === "boolean"
  );
}

function carregarTarefas() {
  try {
    const dadosSalvos = localStorage.getItem(CHAVE);
    if (dadosSalvos === null) {
      return { tarefas: criarExemplos(), aviso: "", podeSalvar: true };
    }

    const tarefas = JSON.parse(dadosSalvos);
    if (!Array.isArray(tarefas) || !tarefas.every(tarefaValida)) {
      throw new Error("Lista de tarefas inválida.");
    }

    return { tarefas, aviso: "", podeSalvar: true };
  } catch {
    // Impede que os exemplos substituam dados que não puderam ser lidos.
    return {
      tarefas: criarExemplos(),
      aviso:
        "Não foi possível ler as tarefas salvas. Os dados originais foram preservados. Exibindo exemplos; as alterações ficarão apenas nesta sessão.",
      podeSalvar: false,
    };
  }
}

export { CHAVE, DISCIPLINAS, dataLocal, mostrarData, carregarTarefas };
