import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  FileText, 
  Brain, 
  Video, 
  Users, 
  Settings, 
  Trophy,
  BarChart3,
  LogOut,
  ChevronDown,
  Search,
  Bell,
  HelpCircle,
  User,
  Grid3X3
} from 'lucide-react'
import { Button } from '../ui/button'
import { blink } from '../../blink/client'

interface TopNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const mainNavigation = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'workspace', label: 'Workspace', icon: Grid3X3, hasDropdown: true },
  { id: 'performance', label: 'Performance', icon: BarChart3, hasDropdown: true },
  { id: 'more', label: 'More', icon: Grid3X3, hasDropdown: true },
]

const workspaceItems = [
  { id: 'scripts', label: 'Script Analysis', icon: FileText },
  { id: 'memorization', label: 'Memorization Tools', icon: Brain },
  { id: 'coaching', label: 'AI Coaching', icon: Users },
]

const performanceItems = [
  { id: 'performance', label: 'Video Analysis', icon: Video },
  { id: 'progress', label: 'Progress Tracking', icon: BarChart3 },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
]

const moreItems = [
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function TopNavigation({ activeTab, onTabChange }: TopNavigationProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const handleLogout = () => {
    blink.auth.logout()
  }

  const handleNavClick = (item: any) => {
    if (item.hasDropdown) {
      setOpenDropdown(openDropdown === item.id ? null : item.id)
    } else {
      onTabChange(item.id)
      setOpenDropdown(null)
    }
  }

  const handleDropdownItemClick = (itemId: string) => {
    onTabChange(itemId)
    setOpenDropdown(null)
  }

  const getDropdownItems = (navId: string) => {
    switch (navId) {
      case 'workspace':
        return workspaceItems
      case 'performance':
        return performanceItems
      case 'more':
        return moreItems
      default:
        return []
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && dropdownRefs.current[openDropdown]) {
        const dropdownElement = dropdownRefs.current[openDropdown]
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          setOpenDropdown(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdown])

  const isActiveSection = (navId: string) => {
    switch (navId) {
      case 'dashboard':
        return activeTab === 'dashboard'
      case 'workspace':
        return ['scripts', 'memorization', 'coaching'].includes(activeTab)
      case 'performance':
        return ['performance', 'progress', 'achievements'].includes(activeTab)
      case 'more':
        return ['settings'].includes(activeTab)
      default:
        return false
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="glass-strong border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text-primary">ActingAI</h1>
                <p className="text-xs text-slate-400 -mt-1">Coaching Platform</p>
              </div>
            </div>

            {/* Main Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {mainNavigation.map((item) => {
                const Icon = item.icon
                const isActive = isActiveSection(item.id)
                
                return (
                  <div key={item.id} className="relative" ref={el => dropdownRefs.current[item.id] = el}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`
                        relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                        ${isActive 
                          ? 'bg-white/20 text-white shadow-lg' 
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                        }
                      `}
                      onClick={() => handleNavClick(item)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <span>{item.label}</span>
                      {item.hasDropdown && (
                        <ChevronDown 
                          className={`h-3 w-3 ml-1 transition-transform duration-200 ${
                            openDropdown === item.id ? 'rotate-180' : ''
                          }`} 
                        />
                      )}
                    </Button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {item.hasDropdown && openDropdown === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-2 w-64 glass-strong rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
                        >
                          <div className="p-2">
                            {getDropdownItems(item.id).map((dropdownItem, index) => {
                              const DropdownIcon = dropdownItem.icon
                              return (
                                <motion.button
                                  key={dropdownItem.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className={`
                                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                                    ${activeTab === dropdownItem.id
                                      ? 'bg-white/20 text-white'
                                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                                    }
                                  `}
                                  onClick={() => handleDropdownItemClick(dropdownItem.id)}
                                >
                                  <DropdownIcon className="h-5 w-5" />
                                  <span className="font-medium">{dropdownItem.label}</span>
                                </motion.button>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Search */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
              >
                <Bell className="h-4 w-4" />
              </Button>

              {/* Help */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>

              {/* User Profile */}
              <div className="relative" ref={el => dropdownRefs.current['profile'] = el}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 rounded-full p-0 overflow-hidden"
                  onClick={() => setOpenDropdown(openDropdown === 'profile' ? null : 'profile')}
                >
                  <div className="w-full h-full gradient-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">A</span>
                  </div>
                </Button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {openDropdown === 'profile' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-48 glass-strong rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
                    >
                      <div className="p-2">
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm font-medium text-white">Actor</p>
                          <p className="text-xs text-slate-400">Premium Member</p>
                        </div>
                        <button
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                          onClick={() => handleDropdownItemClick('settings')}
                        >
                          <User className="h-4 w-4" />
                          <span className="text-sm">Profile Settings</span>
                        </button>
                        <button
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="text-sm">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}