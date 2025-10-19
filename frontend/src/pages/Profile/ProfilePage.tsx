import { useAuth } from '../../hooks/useAuth'

export const ProfilePage: React.FC = () => {
  const { caregiver, refreshToken } = useAuth()

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
      <div className="card-shadow flex flex-col gap-4 p-6">
        <div className="flex items-center gap-4">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content w-16 rounded-full">
              <span className="text-xl">{caregiver?.name?.[0] ?? 'C'}</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-800">{caregiver?.name ?? 'Caregiver'}</h1>
            <p className="text-sm text-neutral-500">{caregiver?.email ?? 'No email provided'}</p>
          </div>
        </div>

        <div className="divider" />

        <button type="button" className="btn btn-outline btn-error" onClick={() => refreshToken()}>
          Refresh session
        </button>
      </div>
    </div>
  )
}
