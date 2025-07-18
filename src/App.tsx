import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { blink } from './blink/client'
import { TopNavigation } from './components/layout/TopNavigation'
import { Dashboard } from './components/dashboard/Dashboard'
import { ScriptAnalysis } from './components/scripts/ScriptAnalysis'
import { PerformanceAnalysis } from './components/performance/PerformanceAnalysis'
import { Toaster } from './components/ui/toaster'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }



  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={handleTabChange} />
      case 'scripts':
        return <ScriptAnalysis />
      case 'memorization':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Memorization Tools</h2>
            <p className="text-slate-400">Coming soon - Interactive line practice</p>
          </div>
        )
      case 'performance':
        return <PerformanceAnalysis />
      case 'coaching':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">AI Coaching</h2>
            <p className="text-slate-400">Coming soon - Virtual coaching sessions</p>
          </div>
        )
      case 'progress':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Progress Tracking</h2>
            <p className="text-slate-400">Coming soon - Detailed progress analytics</p>
          </div>
        )
      case 'achievements':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Achievements</h2>
            <p className="text-slate-400">Coming soon - Unlock badges and rewards</p>
          </div>
        )
      case 'settings':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
            <p className="text-slate-400">Coming soon - Customize your experience</p>
          </div>
        )
      default:
        return <Dashboard onNavigate={handleTabChange} />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <span className="text-2xl font-bold text-white">AI</span>
          </div>
          <p className="text-xl text-white">Loading ActingAI...</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-md mx-auto px-6"
        >
          <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto animate-glow">
            <span className="text-3xl font-bold text-white">AI</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold gradient-text-primary">ActingAI</h1>
            <p className="text-xl text-slate-400">Coaching Platform</p>
          </div>
          <p className="text-slate-300">
            Please sign in to access your personalized acting coaching experience
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <TopNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="relative">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Toaster />
    </div>
  )
}

export default App