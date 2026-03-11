"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../../lib/api';
import toast from 'react-hot-toast';

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface Props {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditTaskModal({ task, isOpen, onClose, onUpdate }: Props) {
  if (!task) return null;

  const validationSchema = Yup.object({
    title: Yup.string().required('العنوان مطلوب'),
    description: Yup.string().required('الوصف مطلوب'),
    completed: Yup.boolean()
  });

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    const loadToast = toast.loading('جاري تحديث المهمة...');
    try {
      await api.put(`/tasks/${task._id}`, values);
      toast.success('تم التحديث بنجاح', { id: loadToast });
      onUpdate(); // تحديث القائمة في الصفحة الرئيسية
      onClose();   // إغلاق النافذة
    } catch (error) {
      toast.error('فشل التحديث، حاول مرة أخرى', { id: loadToast });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">تعديل المهمة</h2>

            <Formik
              initialValues={{ title: task.title, description: task.description, completed: task.completed }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">العنوان</label>
                    <Field name="title" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <ErrorMessage name="title" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">الوصف</label>
                    <Field as="textarea" name="description" rows={3} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Field type="checkbox" name="completed" id="completed" className="w-5 h-5 accent-indigo-600" />
                    <label htmlFor="completed" className="text-sm font-bold text-slate-700 cursor-pointer">تم إنجاز المهمة</label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50">إلغاء</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 bg-indigo-600 text-white py-3 rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50">
                      {isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
