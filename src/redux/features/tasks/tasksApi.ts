import { baseApi } from "@/redux/hooks/baseApi";
export interface Task {
  id: string;
  name: string;
  isComplete: boolean;
  category: string;
  priority: string;
  dueDate: string;
  daysAhead: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateTaskRequest {
  name: string;
  category: string;
  priority: string;
  dueDate: string;
}

export interface UpdateTaskRequest {
  isComplete?: boolean;
  priority?: string;
  name?: string;
  category?: string;
  dueDate?: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Task
    createTask: builder.mutation<ApiResponse<Task>, CreateTaskRequest>({
      query: (body) => ({
        url: "/tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),

    // Get All Tasks
    getTasks: builder.query<ApiResponse<Task[]>, void>({
      query: () => "/tasks",
      providesTags: ["Tasks"],
    }),

    // Get Tasks by Category
    getTasksByCategory: builder.query<
      ApiResponse<Record<string, Task[]>>,
      void
    >({
      query: () => "/tasks/by-category",
      providesTags: ["Tasks"],
    }),

    // Get Tasks by Timeline
    getTasksTimeline: builder.query<
      ApiResponse<{
        today: Task[];
        next2Days: Task[];
        thisWeek: Task[];
        later: Task[];
      }>,
      void
    >({
      query: () => "/tasks/timeline",
      providesTags: ["Tasks"],
    }),

    // Get Task by Id
    getTaskById: builder.query<ApiResponse<Task>, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: ["Tasks"],
    }),

    // Update Task
    updateTask: builder.mutation<
      ApiResponse<Task>,
      { id: string; body: UpdateTaskRequest }
    >({
      query: ({ id, body }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),

    // Delete Task
    deleteTask: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetTasksQuery,
  useGetTasksByCategoryQuery,
  useGetTasksTimelineQuery,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
