import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTask,
  endSchedule,
  fetchScheduleById,
  fetchSchedules,
  startSchedule,
  updateTaskStatus,
} from '@/api/schedules';
import type {
  ScheduleDetail,
  ScheduleSummary,
  UpdateTaskPayload,
  VisitEventPayload,
} from '@/types';
import toast from 'react-hot-toast';

export const schedulesKeys = {
  all: ['schedules'] as const,
  today: ['schedules', 'today'] as const,
  detail: (id: string) => ['schedules', id] as const,
};

export const useSchedules = () =>
  useQuery<ScheduleSummary[]>({
    queryKey: schedulesKeys.all,
    queryFn: fetchSchedules,
  });

export const useTodaySchedules = () =>
  useQuery<ScheduleSummary[]>({
    queryKey: schedulesKeys.today,
    queryFn: fetchSchedules,
  });

export const useScheduleDetail = (id: string) =>
  useQuery<ScheduleDetail>({
    queryKey: schedulesKeys.detail(id),
    queryFn: () => fetchScheduleById(id),
    enabled: Boolean(id),
  });

export const useStartSchedule = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VisitEventPayload) => startSchedule(id, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(schedulesKeys.detail(id), data);
      void queryClient.invalidateQueries({ queryKey: schedulesKeys.today });
      void queryClient.invalidateQueries({ queryKey: schedulesKeys.all });
      toast.success('Clock-in recorded successfully.');
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error('Unable to clock in. Please try again.');
    },
  });
};

export const useEndSchedule = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VisitEventPayload) => endSchedule(id, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(schedulesKeys.detail(id), data);
      void queryClient.invalidateQueries({ queryKey: schedulesKeys.today });
      void queryClient.invalidateQueries({ queryKey: schedulesKeys.all });
      toast.success('Clock-out recorded successfully.');
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error('Unable to clock out. Please try again.');
    },
  });
};

export const useUpdateTaskStatus = (scheduleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: string;
      payload: UpdateTaskPayload;
    }) => updateTaskStatus(taskId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(schedulesKeys.detail(scheduleId), data);
      toast.success('Task updated.');
    },
    onError: () => {
      toast.error('Failed to update task. Please try again.');
    },
  });
};

export const useCreateTask = (scheduleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { title: string; description?: string }) =>
      createTask(scheduleId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(schedulesKeys.detail(scheduleId), data);
      toast.success('Task added successfully.');
    },
    onError: () => {
      toast.error('Unable to add task right now.');
    },
  });
};
