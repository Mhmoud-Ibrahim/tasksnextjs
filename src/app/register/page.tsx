"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../../lib/api';

// 1. تعريف مخطط التحقق باستخدام Yup
const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'الاسم قصير جداً')
    .required('الاسم الكامل مطلوب'),
  email: Yup.string()
    .email('البريد الإلكتروني غير صالح')
    .required('البريد الإلكتروني مطلوب'),
  password: Yup.string()
    .min(8, 'يجب أن تكون كلمة المرور 8 أحرف على الأقل')
    .required('كلمة المرور مطلوبة'),
});

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      {/* 2. إضافة حركات الدخول باستخدام Framer Motion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 border border-slate-100"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create an account </h1>
          <p className="text-slate-500 text-sm">Enjoy managing your tasks with ease</p>
        </div>

        {/* 3. استخدام Formik لإدارة النموذج */}
        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={RegisterSchema}
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            try {
              // 4. استخدام Axios لطلب الـ API
              const response = await api.post('/signup', values);
              if (response.status === 200 || response.status === 201) {
                console.log(response);
                router.push('/login');
              }
            } catch (error: any) {
              setStatus(error.response?.data?.message || ' failed to register, please try again.');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, status }) => (
            <Form className="space-y-4">
              {status && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 text-center"
                >
                  {status}
                </motion.div>
              )}

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700"> full name</label>
                <Field
                  name="name"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="enter your name here"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700"> email</label>
                <Field
                  name="email"
                  type="email"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="name@example.com"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700"> password</label>
                <Field
                  name="password"
                  type="password"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-indigo-200 disabled:opacity-70"
              >
                {isSubmitting ? ' sending ...' : 'create an account'}
              </motion.button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-sm text-slate-600">
          you already have an account{' '}
          <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
         login in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
