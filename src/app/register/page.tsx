"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../../lib/api';

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

  // دالة التسجيل بجوجل
  const handleGoogleLogin = () => {
    // التوجه لرابط الباك اند الذي يشغل Google OAuth
    window.location.href = "https://taskts.vercel.app/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 border border-slate-100"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create an account</h1>
          <p className="text-slate-500 text-sm">Enjoy managing your tasks with ease</p>
        </div>

        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={RegisterSchema}
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            try {
              const response = await api.post('/signup', values);
              if (response.status === 200 || response.status === 201) {
                router.push('/login');
              }
            } catch (error: any) {
              setStatus(error.response?.data?.message || 'Failed to register, please try again.');
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
                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                <Field
                  name="name"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your name here"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <Field
                  name="email"
                  type="email"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="name@example.com"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <Field
                  name="password"
                  type="password"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
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
                {isSubmitting ? 'Sending...' : 'Create an account'}
              </motion.button>

              {/* فاصل "أو" */}
              <div className="relative flex py-2 items-center">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink mx-4 text-slate-400 text-xs uppercase">Or</span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              {/* زر جوجل */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white border border-slate-200 text-slate-700 font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 hover:bg-slate-50 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                Continue with Google
              </motion.button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
