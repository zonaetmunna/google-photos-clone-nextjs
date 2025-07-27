'use client';

import { Camera, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
    const router=useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
      console.log('Login attempt:', { email, password });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main card */}
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-xl backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary rounded-full">
                <Camera className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your photos</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-foreground">
                <input type="checkbox" className="mr-2 rounded border-border bg-input text-primary focus:ring-ring accent-primary" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-border"></div>
            <span className="px-4 text-muted-foreground text-sm">or</span>
            <div className="flex-1 border-t border-border"></div>
          </div>

          {/* Social login */}
          <button className="w-full py-3 px-4 bg-secondary hover:bg-secondary/80 border border-border text-secondary-foreground font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Sign up link */}
          <p className="mt-6 text-center text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:text-primary/80 transition-colors font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}