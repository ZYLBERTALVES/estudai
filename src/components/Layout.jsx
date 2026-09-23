import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCheck,
  CircleHelp,
  GraduationCap,
  Sparkles,
} from "lucide-react";

// Elementos de apresentação da página.
export function Cabecalho({ aoAbrirAjuda }) {
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
          <button className="help-button" onClick={aoAbrirAjuda}>
            <CircleHelp size={17} />
            <span>Como funciona</span>
          </button>
          <span className="profile-icon" title="Estudaí">
            <GraduationCap size={22} />
          </span>
        </div>
      </header>
    </>
  );
}

export function Apresentacao({ aoCriar }) {
  const hoje = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Seu semestre, mais leve.</h1>
          <p>Organize as tarefas. Encontre seu ritmo. Vá mais longe.</p>
        </div>
        <span className="today-date">
          <CalendarDays size={16} />
          {hoje}
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
            <br className="desktop-break" /> para transformar planos em progresso.
          </p>
          <button className="hero-link" onClick={aoCriar}>
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
    </>
  );
}

export function Rodape() {
  return (
    <footer className="site-footer">
      <span>
        <BookOpen size={15} /> estudaí. <span>Feito para o seu ritmo.</span>
      </span>
      <span>
        Seus dados ficam salvos neste navegador <span className="save-dot" />
      </span>
    </footer>
  );
}

export function Ajuda({ aoFechar }) {
  return (
    <div className="help-content">
      <p>
        O Estudaí é seu organizador pessoal de estudos. Começamos com algumas tarefas de exemplo;
        você pode editar ou excluir todas elas.
      </p>
      <ol>
        <li>
          <strong>Planeje seu próximo passo.</strong>
          <span>
            Clique em “Nova tarefa”, escolha a disciplina, a prioridade e a data de entrega.
          </span>
        </li>
        <li>
          <strong>Encontre o que precisa.</strong>
          <span>
            Busque pelo nome ou disciplina, filtre por situação e organize por prazo ou prioridade.
          </span>
        </li>
        <li>
          <strong>Veja seu progresso acontecer.</strong>
          <span>
            Marque o quadradinho ao lado da tarefa para concluir. Você pode clicar novamente para
            reabrir.
          </span>
        </li>
      </ol>
      <p className="help-storage">
        <Sparkles size={18} />
        As tarefas são salvas automaticamente neste navegador. Não há login nem sincronização entre
        dispositivos. Limpar os dados do navegador remove as tarefas.
      </p>
      <button className="button button-primary" onClick={aoFechar}>
        Entendi, vamos estudar <ArrowRight size={17} />
      </button>
    </div>
  );
}
