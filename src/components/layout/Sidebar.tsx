import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Home, 
  FileText, 
  Brain, 
  Video, 
  Users, 
  Settings, 
  Menu,
  X,
  Trophy,
  BarChart3,
  LogOut
} from 'lucide-react'
import { Button } from '../ui/button'
import { blink } from '../../blink/client'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'scripts', label: 'Script Analysis', icon: FileText },
  { id: 'memorization', label: 'Memorization', icon: Brain },
  { id: 'performance', label: 'Performance', icon: Video },
  { id: 'coaching', label: 'AI Coaching', icon: Users },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    blink.auth.logout()
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden glass rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`
          fixed left-0 top-0 h-full w-72 glass-strong z-40 p-6
          lg:translate-x-0 lg:static lg:z-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text-primary">ActingAI</h1>
              <p className="text-sm text-slate-400">Coaching Platform</p>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item, index) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="ghost"
                  className={`
                    w-full justify-start space-x-3 h-12 rounded-xl transition-all duration-300
                    ${isActive 
                      ? 'gradient-primary text-white shadow-lg' 
                      : 'hover-glass text-slate-300 hover:text-white'
                    }
                  `}
                  onClick={() => {
                    onTabChange(item.id)
                    setIsOpen(false)
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              </motion.div>
            )
          })}
        </nav>

        {/* Logout Button for Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-auto mb-4 lg:hidden"
        >
          <Button
            variant="ghost"
            className="w-full justify-start space-x-3 h-12 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </Button>
        </motion.div>

        {/* User Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-6 left-6 right-6"
        >
          <div className="glass rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-accent rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Actor</p>
                <p className="text-xs text-slate-400 truncate">Premium Member</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.aside>
    </>
  )
}