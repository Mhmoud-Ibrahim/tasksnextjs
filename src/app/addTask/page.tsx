"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../../lib/api'; // تأكد من مسار ملف الـ axios الخاص بك
import { useRouter } from 'next/navigation';

export default function AddTaskPage() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // إعدادات التحقق من المدخلات
  const validationSchema = Yup.object({
    title: Yup.string().required('عنوان المهمة مطلوب'),
    description: Yup.string().required('وصف المهمة مطلوب'),
  });

  const handleSubmit = async (values: { title: string; description: string }, { setSubmitting }: any) => {
    try {
      await api.post('/tasks', values); // إرسال البيانات للباك إند
      setIsOpen(false); // إغلاق النافذة عند النجاح
      router.push('/tasks'); // التوجيه لصفحة المهام
    } catch (error) {
      console.error("خطأ في إضافة المهمة:", error);
      alert("فشل إضافة المهمة، تأكد من تسجيل الدخول");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">tasks management</h1>

      {/* زر فتح النافذة */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition-colors"
      >
        + add new tasks
      </motion.button>

      {/* النافذة المنبثقة (Modal) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* الخلفية المظلمة */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60"
            />

            {/* محتوى النافذة */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-70 p-8"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">  add new task</h2>

              <Formik
                initialValues={{ title: '', description: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">title</label>
                      <Field
                        name="title"
                        type="text"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="what do you need to do?"
                      />
                      <ErrorMessage name="title" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">description</label>
                      <Field
                        as="textarea"
                        name="description"
                        rows={4}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="more details..."
                      />
                      <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? "Sending..." : " save task"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
