interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We could not load your data. Please try again.',
  onRetry,
}) => (
  <div className="card bg-base-100 shadow-md text-center">
    <div className="card-body items-center gap-3">
      <span className="material-symbols-rounded text-4xl text-error">error</span>
      <h3 className="card-title text-lg">{title}</h3>
      <p className="text-sm opacity-70">{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-sm btn-primary" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  </div>
)
