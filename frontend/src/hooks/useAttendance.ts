import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  getTodayAttendanceStatus,
  clockIn,
  clockOut,
  getAttendanceHistory,
  type AttendanceStatus,
  type ClockEventPayload,
  type AttendanceLogSummary,
} from '@/api/attendance';

export const attendanceKeys = {
  all: ['attendance'] as const,
  todayStatus: ['attendance', 'today', 'status'] as const,
  history: ['attendance', 'history'] as const,
};

export const useTodayAttendanceStatus = () =>
  useQuery<AttendanceStatus>({
    queryKey: attendanceKeys.todayStatus,
    queryFn: getTodayAttendanceStatus,
    refetchInterval: 60000, // Refetch every minute
  });

export const useClockIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ClockEventPayload) => clockIn(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.todayStatus });
      toast.success('Clock-in recorded successfully.');
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error('Unable to clock in. Please try again.');
    },
  });
};

export const useClockOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ClockEventPayload) => clockOut(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.todayStatus });
      toast.success('Clock-out recorded successfully.');
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error('Unable to clock out. Please try again.');
    },
  });
};

export const useAttendanceHistory = (params?: {
  log_type?: 'clock_in' | 'clock_out';
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}) =>
  useQuery<AttendanceLogSummary[]>({
    queryKey: [...attendanceKeys.history, params],
    queryFn: () => getAttendanceHistory(params),
  });