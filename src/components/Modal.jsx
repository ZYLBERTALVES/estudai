import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ titulo, children, aoFechar }) {
  // O dialog do navegador controla o foco e permite fechar com Escape.
  useEffect(() => {
    const janela = document.getElementById("modal-estudai");
    const elementoAnterior = document.activeElement;
    janela.showModal();
    const rolagemAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      janela.close();
      document.body.style.overflow = rolagemAnterior;
      elementoAnterior.focus();
    };
  }, []);

  function fecharPeloFundo(evento) {
    if (evento.target === evento.currentTarget) aoFechar();
  }

  return (
    <dialog
      id="modal-estudai"
      className="modal"
      aria-labelledby="modal-title"
      onCancel={aoFechar}
      onClick={fecharPeloFundo}
    >
      <div className="modal-heading">
        <h2 id="modal-title">{titulo}</h2>
        <button type="button" className="icon-button" aria-label="Fechar janela" onClick={aoFechar}>
          <X size={21} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
