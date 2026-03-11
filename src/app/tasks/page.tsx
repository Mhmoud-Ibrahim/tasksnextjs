"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import EditTaskModal from '../editTask/page';
// تأكد من إنشاء هذا الملف

// تعريف واجهة المهمة المحدثة
interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function TasksDisplayPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // حالات الحذف
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // حالات التعديل
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 1. دالة جلب المهام
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      const data = response.data.tasks || response.data;
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("خطأ في جلب المهام:", error);
      toast.error("فشل في تحميل المهام");
    } finally {
      setLoading(false);
    }
  };

  // 2. دالة تأكيد الحذف
  const confirmDelete = async () => {
    if (!taskToDelete) return;

    const loadingToast = toast.loading('جاري حذف المهمة...');
    setIsDeleting(true);

    try {
      await api.delete(`/tasks/${taskToDelete}`);
      setTasks(prev => prev.filter(task => task._id !== taskToDelete));
      setTaskToDelete(null);
      toast.success('تم حذف المهمة بنجاح', { id: loadingToast });
    } catch (error) {
      toast.error('فشل حذف المهمة، حاول مرة أخرى', { id: loadingToast });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen pt-32 px-6 flex flex-col items-center bg-slate-50">
      <div className="max-w-4xl w-full">
        <header className="mb-12 text-center md:text-right">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">MyTasks</h1>
          <p className="text-slate-500 mt-2 font-medium">You have <span className='fw-bold text-danger'>{tasks.length}</span>  Tasks on your list</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {loading ? (
            <div className="col-span-full flex flex-col items-center py-20">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 mt-4 font-bold"> Synchronizing...</p>
            </div>
          ) : tasks.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <motion.div
                  key={task._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 transition-all flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-slate-800 leading-tight">{task.title}</h3>

                    {/* وسم الحالة */}
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${task.completed
                      ? 'bg-green-50 text-green-600 border-green-100'
                      : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                      {task.completed ? 'completed' : 'hanging'}
                      {task.completed && <span className="text-xs">✓</span>}
                    </div>
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed mb-8 grow">
                    {task.description}
                  </p>

                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => { setTaskToEdit(task); setIsEditModalOpen(true); }}
                      className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded-2xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                    >
                      edit
                    </button>
                    <button
                      onClick={() => setTaskToDelete(task._id)}
                      className="flex-1 bg-rose-50 text-rose-600 py-2 rounded-2xl text-xs font-bold hover:bg-rose-600 hover:text-white transition-all active:scale-95"
                    >
                      delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="col-span-full text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
              <div className="text-5xl mb-4 opacity-30">✨</div>
              <p className="text-slate-400 font-bold text-lg">قائمة المهام فارغة، استمتع بوقتك!</p>
            </div>
          )}
        </div>
      </div>

      {/* --- نافذة تأكيد الحذف --- */}
      <AnimatePresence>
        {taskToDelete && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setTaskToDelete(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-10 shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">🗑️</div>
              <h2 className="text-2xl font-black text-slate-800 mb-3">حذف المهمة؟</h2>
              <p className="text-slate-500 text-sm mb-10 leading-relaxed font-medium">سيتم مسح هذه المهمة نهائياً من السحابة الخاصة بك.</p>
              <div className="flex gap-4">
                <button disabled={isDeleting} onClick={() => setTaskToDelete(null)}
                  className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors"
                >تراجع</button>
                <button disabled={isDeleting} onClick={confirmDelete}
                  className="flex-1 bg-rose-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-rose-200 hover:bg-rose-700 active:scale-95 transition-all"
                >{isDeleting ? "لحظة..." : "نعم، احذف"}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- نافذة التعديل (الكومبوننت المنفصل) --- */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        task={taskToEdit}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={fetchTasks}
      />
    </div>
  );
}
