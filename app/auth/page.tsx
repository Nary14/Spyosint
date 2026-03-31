'use client'

import React, { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Eye, EyeOff, ShieldCheck, Lock, Mail, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import '../welcome/spyosint-animations.css'
import ParticlesBackground from './ParticlesBackground';

type AuthMode = 'login' | 'signup'

interface FormData {
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    setErrors({})
    setSuccess('')
    setFormData({ email: '', password: '', confirmPassword: '' })
  }, [mode])

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.email) newErrors.email = 'Email requis'
    else if (!validateEmail(formData.email)) newErrors.email = 'Format invalide'

    if (!formData.password) newErrors.password = 'Mot de passe requis'
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 caractères'

    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })
        if (error) throw error
        setSuccess('Accès autorisé. Redirection...')
        setTimeout(() => router.push('/dashboard'), 1500)
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        })
        if (error) throw error
        setSuccess('Profil créé. Vérifiez vos emails.')
      }
    } catch (error: any) {
      setErrors({ general: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <ParticlesBackground />
      {/* Background FX */}
      <div className="hud-grid opacity-20 absolute inset-0 pointer-events-none" />
      <div className="scanlines absolute inset-0 opacity-10 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md z-10 animate-slide-up">
        {/* Visual Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-blue-500/30 mb-4 neon-border">
            <ShieldCheck className={`w-8 h-8 ${loading ? 'animate-pulse text-blue-400' : 'text-blue-400'}`} />
          </div>
          <h1 className="text-2xl font-bold tracking-tighter text-white  font-mono">
            {mode === 'login' ? 'Identification Requise' : 'Enregistrement Agent'}
          </h1>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          {/* Decorative Top Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

          {/* Messages */}
          {success && (
            <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/50 rounded flex items-center gap-3 animate-flicker">
              <CheckCircle2 className="text-emerald-400 w-4 h-4" />
              <p className="text-emerald-400 text-xs font-mono uppercase">{success}</p>
            </div>
          )}
          {errors.general && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded flex items-center gap-3">
              <AlertCircle className="text-red-400 w-4 h-4" />
              <p className="text-red-400 text-xs font-mono uppercase">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-500  ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="agent@spyosint.net"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm font-mono text-white focus:border-blue-500/50 focus:ring-0 transition-all outline-none"
                />
              </div>
              {errors.email && <p className="text-red-500 text-[10px] font-mono uppercase">{errors.email}</p>}
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-500  ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-lg pl-10 pr-10 py-2 text-sm font-mono text-white focus:border-blue-500/50 outline-none transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-400 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[10px] font-mono uppercase">{errors.password}</p>}
            </div>

            {/* Confirm Password (Signup) */}
            {mode === 'signup' && (
              <div className="space-y-2 animate-slide-down">
                <label className="text-[10px] font-mono text-slate-500  ml-1">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-lg pl-10 py-2 text-sm font-mono text-white focus:border-blue-500/50 outline-none transition-all"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-[10px] font-mono ">{errors.confirmPassword}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all group overflow-hidden relative mt-4"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 font-mono text-xs tracking-tighter">
                {loading ? 'initialisation...' : mode === 'login' ? 'Connexion ' : 'S\'enregistrer'}
                {!loading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-[10px] font-mono text-slate-500 hover:text-blue-400 transition-colors"
            >
              {mode === 'login' ? " Besoin d'un accès ? Enregistrement" : " Déjà enregistré ? Identification"}
            </button>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-8 flex justify-between items-center opacity-40 font-mono text-[9px] tracking-widest text-slate-500">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              Secure Access
           </div>
           <span>Nary SpyOSINT</span>
        </div>
      </div>
    </main>
  )
}