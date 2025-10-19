export const LoadingScreen: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
    <span className="loading loading-spinner loading-lg text-primary" />
    <p className="text-sm text-neutral-500">{message ?? 'Loading...'}</p>
  </div>
)
