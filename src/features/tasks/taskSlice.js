import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getTasks, createTask, updateTask, deleteTask } from "./taskService";

// Fetch all tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      return await getTasks();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Add new task
export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (taskData, { rejectWithValue }) => {
    try {
      return await createTask(taskData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Update task
export const editTask = createAsyncThunk(
  "tasks/editTask",
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      return await updateTask(id, taskData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Delete task
export const removeTask = createAsyncThunk(
  "tasks/removeTask",
  async (id, { rejectWithValue }) => {
    try {
      await deleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const taskSlice = createSlice({
  name: "tasks",

  initialState: {
    tasks: [],
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH TASKS
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;

        state.tasks = Array.isArray(action.payload)
          ? action.payload
          : action.payload.tasks;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ADD TASK
      .addCase(addTask.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.creating = false;

        const newTask = action.payload.task ?? action.payload;

        state.tasks.unshift(newTask);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || action.error.message;
      })

      // UPDATE TASK
      .addCase(editTask.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(editTask.fulfilled, (state, action) => {
        state.updating = false;

        const updatedTask = action.payload.task ?? action.payload;

        const index = state.tasks.findIndex(
          (task) => task._id === updatedTask._id,
        );

        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      })
      .addCase(editTask.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || action.error.message;
      })

      // DELETE TASK
      .addCase(removeTask.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.deleting = false;

        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default taskSlice.reducer;
