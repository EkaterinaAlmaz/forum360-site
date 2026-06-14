import { CasesTable } from "@/components/cases/CasesTable";
import { useSiteContent } from "@/context/contentContext";
import { useModal } from "@/context/modalContext";
import { Modal } from "@/components/ui/Modal";

export function ProjectsModal() {
  const { isProjectsOpen, closeProjects } = useModal();
  const { content } = useSiteContent();

  return (
    <Modal
      open={isProjectsOpen}
      onClose={closeProjects}
      labelledBy="projectsModalTitle"
      className="modal modal--projects"
      panelClassName="modal-panel projects-modal-panel"
      backdropDataAttr="data-close-projects-modal"
      closeDataAttr="data-close-projects-modal"
    >
      <button
        type="button"
        className="modal-close mono"
        data-close-projects-modal
        aria-label={content.cases.modalLabels.close}
        onClick={closeProjects}
      >
        ×
      </button>
      <div className="projects-modal-head">
        <h2 className="section-title" id="projectsModalTitle">
          {content.cases.projectsModalTitle}
        </h2>
      </div>
      <div className="projects-modal-body">
        <CasesTable variant="all" />
      </div>
    </Modal>
  );
}
