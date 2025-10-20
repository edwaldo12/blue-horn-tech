import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { DashboardPage } from '@/pages/Dashboard/DashboardPage'
import { ScheduleDetailPage } from '@/pages/ScheduleDetail/ScheduleDetailPage'
import { ScheduleProgressPage } from '@/pages/ScheduleProgress/ScheduleProgressPage'
import { ProfilePage } from '@/pages/Profile/ProfilePage'
import { useAuth } from '@/hooks/useAuth'
import { LoadingScreen } from '@/components/common/LoadingScreen'

export const AppRoutes: React.FC = () => {
  const { loading } = useAuth()

  if (loading) {
    return <LoadingScreen message="Connecting to Caregiver services..." />
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="schedule/:scheduleId" element={<ScheduleDetailPage />} />
        <Route path="schedule/:scheduleId/progress" element={<ScheduleProgressPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
