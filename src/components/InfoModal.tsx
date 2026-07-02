type InfoModalProps = {
  open: boolean
  title: string
  children: React.ReactNode
  primaryActionLabel?: string
  onPrimaryAction?: () => void
  onClose: () => void
}

export function InfoModal({
  open,
  title,
  children,
  primaryActionLabel,
  onPrimaryAction,
  onClose,
}: InfoModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            className="icon-button"
            type="button"
            aria-label="关闭"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="toolbar-actions modal-actions">
          {primaryActionLabel && onPrimaryAction ? (
            <button
              className="primary-action small"
              type="button"
              onClick={onPrimaryAction}
            >
              {primaryActionLabel}
            </button>
          ) : null}
          <button type="button" onClick={onClose}>
            关闭
          </button>
        </div>
      </section>
    </div>
  )
}
