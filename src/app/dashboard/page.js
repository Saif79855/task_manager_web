"use client";

import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import TaskStats from "@/components/tasks/TaskStats";
import TaskList from "@/components/tasks/TaskList";
import DashboardHeader from "@/components/tasks/DashboardHeader";
import TaskModal from "@/components/tasks/TaskModal";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { addTask, editTask } from "@/features/tasks/taskSlice";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeFilter, setActiveFilter] = useState("all");
  const [activeMenu, setActiveMenu] = useState(null);

  const mainRef = useRef(null);
  const taskListRef = useRef(null);

  const dispatch = useDispatch();

  const { creating, updating, error } = useSelector((state) => state.tasks);

  const isEditMode = Boolean(selectedTask);
  const isSubmitting = creating || updating;

  // Handle sidebar navigation

  const handleNavigation = (menu) => {
    setActiveMenu(menu);

    if (menu === "completed") {
      setActiveFilter("completed");
    } else if (menu === "pending") {
      setActiveFilter("pending");
    } else {
      setActiveFilter("all");
    }

    requestAnimationFrame(() => {
      if (menu === "dashboard") {
        mainRef.current?.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        taskListRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  };

  // Handle filters inside TaskList
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);

    const menu =
      filter === "completed"
        ? "completed"
        : filter === "pending"
          ? "pending"
          : "allTasks";

    setActiveMenu(menu);
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Create or Update Task
  const handleSubmitTask = async (taskData) => {
    try {
      if (isEditMode) {
        await dispatch(
          editTask({
            id: selectedTask._id,
            taskData,
          }),
        ).unwrap();

        toast.success("Task updated successfully!");
      } else {
        await dispatch(addTask(taskData)).unwrap();

        toast.success("Task created successfully!");
      }

      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error(
        isEditMode ? "Update task failed:" : "Create task failed:",
        error,
      );

      toast.error(
        typeof error === "string"
          ? error
          : "Something went wrong. Please try again.",
      );
    }
  };

  // Close Modal
  const handleCloseModal = () => {
    if (isSubmitting) return;

    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <ProtectedRoute>
      <div className="h-dvh overflow-hidden bg-background lg:pl-64">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeMenu={activeMenu}
          onNavigate={handleNavigation}
        />

        <Navbar
          onMenuClick={() => setIsSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Scrollable Dashboard Content */}
        <main ref={mainRef} className="h-dvh min-w-0 overflow-y-auto">
          <div className="px-4 pb-8 pt-24 sm:px-6 lg:px-8">
            {/* Dashboard Section */}
            <div>
              <DashboardHeader onAddTask={handleOpenCreateModal} />

              <TaskStats />
            </div>

            {/* Task List Section */}
            <div ref={taskListRef} className="scroll-mt-24">
              <TaskList
                onEditTask={handleEditTask}
                searchQuery={searchQuery}
                onAddTask={handleOpenCreateModal}
                onSearchChange={setSearchQuery}
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
        </main>

        {/* Task Modal */}
        {isModalOpen && (
          <TaskModal
            key={selectedTask?._id || "create"}
            isOpen={true}
            onClose={handleCloseModal}
            onSubmit={handleSubmitTask}
            isSubmitting={isSubmitting}
            error={error}
            initialTask={selectedTask}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
