"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../../lib/api';

// مخطط التحقق الخاص بالدخول
const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('البريد الإلكتروني غير صالح')
        .required('البريد الإلكتروني مطلوب'),
    password: Yup.string()
        .min(6, 'كلمة المرور قصيرة جداً')
        .required('كلمة المرور مطلوبة'),
});

export default function LoginPage() {
    const router = useRouter();

    // دالة الدخول بجوجل
    const handleGoogleLogin = () => {
        window.location.href = "https://taskts.vercel.app/auth/google";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            {/* حركة دخول الصفحة */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 border border-slate-100"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Login</h1>
                    <p className="text-slate-500 text-sm">Welcome back to the Tasks Platform</p>
                </div>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={LoginSchema}
                    onSubmit={async (values, { setSubmitting, setStatus }) => {
                        try {
                            const response = await api.post('/auth/signin', values);

                            if (response.data.message === 'success') {
                                localStorage.setItem('is_auth', 'true');
                                window.dispatchEvent(new Event("authChange"));
                                router.push('/tasks');
                            }
                        } catch (error: any) {
                            setStatus(error.response?.data?.message || 'email or password is incorrect');
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ isSubmitting, status }) => (
                        <Form className="space-y-4">
                            {status && (
                                <motion.div
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="bg-amber-50 text-amber-700 p-3 rounded-lg text-sm border border-amber-100 text-center font-medium"
                                >
                                    {status}
                                </motion.div>
                            )}

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
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-slate-700">Password</label>
                                    <Link href="/forgotpassword"  className="text-xs text-indigo-600 hover:underline">Forget Password?</Link>
                                </div>
                                <Field
                                    name="password"
                                    type="password"
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg disabled:opacity-70 mt-2"
                            >
                                {isSubmitting ? 'Verifying...' : 'Login'}
                            </motion.button>

                            {/* فاصل "أو" */}
                            <div className="relative flex py-2 items-center">
                                <div className="grow border-t border-slate-200"></div>
                                <span className="shrink mx-4 text-slate-400 text-xs uppercase">Or</span>
                                <div className="grow border-t border-slate-200"></div>
                            </div>

                            {/* زر جوجل */}
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
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
                                Sign in with Google
                            </motion.button>
                        </Form>
                    )}
                </Formik>

                <p className="text-center text-sm text-slate-600 pt-2">
                   Don't have an account?{' '}
                    <Link href="/register" className="text-indigo-600 font-bold hover:underline">
                       Create account now
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
