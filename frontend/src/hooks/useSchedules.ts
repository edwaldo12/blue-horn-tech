import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
  createTask,
  endSchedule,
  fetchScheduleById,
  fetchSchedules,
  fetchTodaySchedules,
  startSchedule,
  updateTaskStatus,
  type PaginatedSchedulesResponse,
} from '@/api/schedules';
import type {
  ScheduleDetail,
  ScheduleSummary,
  UpdateTaskPayload,
  VisitEventPayload,
  TodaySchedulesResponse,
} from '@/types';
import toast from 'react-hot-toast';

export const schedulesKeys = {
  all: ['schedules'] as const,
  today: ['schedules', 'today'] as const,
  detail: (id: string) => ['schedules', id] as const,
};

export const useSchedules = () =>
  useQuery<PaginatedSchedulesResponse>({
    queryKey: schedulesKeys.all,
    queryFn: () => fetchSchedules(5, 0), // Default to 5 items, starting from 0
  });

export const useTodaySchedules = () =>
  useQuery<TodaySchedulesResponse, Error, ScheduleSummary[]>({
    queryKey: schedulesKeys.today,
    queryFn: fetchTodaySchedules, // This remains unchanged as it's not paginated
    select: (data) => data.data, // Extract just the data array
  });

export const useInfiniteSchedules = () =>
  useInfiniteQuery<PaginatedSchedulesResponse>({
    queryKey: [...schedulesKeys.all, 'infinite'],
    queryFn: ({ pageParam = 0 }) => fetchSchedules(5, pageParam as number),
    getNextPageParam: (lastPage) => {
      if (lastPage?.pagination?.hasMore) {
        return lastPage.pagination.offset + lastPage.pagination.limit;
      }
      return undefined;
    },
    initialPageParam: 0,
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
