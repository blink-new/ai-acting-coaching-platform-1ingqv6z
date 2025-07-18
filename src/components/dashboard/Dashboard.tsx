import { motion } from 'framer-motion'
import { 
  FileText, 
  Brain, 
  Video, 
  Users, 
  TrendingUp, 
  Clock,
  Star,
  Target,
  Play,
  BookOpen,
  Award,
  Calendar
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'

const statsCards = [
  {
    title: 'Scripts Analyzed',
    value: '12',
    change: '+3 this week',
    icon: FileText,
    gradient: 'gradient-primary'
  },
  {
    title: 'Lines Memorized',
    value: '847',
    change: '+127 today',
    icon: Brain,
    gradient: 'gradient-accent'
  },
  {
    title: 'Performances',
    value: '8',
    change: '+2 this week',
    icon: Video,
    gradient: 'from-teal-500 to-cyan-500'
  },
  {
    title: 'Coaching Hours',
    value: '24.5',
    change: '+4.2 this week',
    icon: Users,
    gradient: 'from-pink-500 to-rose-500'
  }
]

const recentActivities = [
  {
    type: 'script',
    title: 'Analyzed "Hamlet" Act 3',
    time: '2 hours ago',
    icon: FileText,
    color: 'text-blue-400'
  },
  {
    type: 'memorization',
    title: 'Completed Scene 2 practice',
    time: '4 hours ago',
    icon: Brain,
    color: 'text-amber-400'
  },
  {
    type: 'performance',
    title: 'Uploaded monologue video',
    time: '1 day ago',
    icon: Video,
    color: 'text-teal-400'
  },
  {
    type: 'coaching',
    title: 'AI coaching session with Method Coach',
    time: '2 days ago',
    icon: Users,
    color: 'text-pink-400'
  }
]

const quickActions = [
  {
    title: 'Upload New Script',
    description: 'Analyze characters and scenes',
    icon: FileText,
    action: 'scripts',
    gradient: 'gradient-primary'
  },
  {
    title: 'Practice Lines',
    description: 'Interactive memorization',
    icon: Brain,
    action: 'memorization',
    gradient: 'gradient-accent'
  },
  {
    title: 'Record Performance',
    description: 'Get AI feedback',
    icon: Video,
    action: 'performance',
    gradient: 'from-teal-500 to-cyan-500'
  },
  {
    title: 'Start Coaching',
    description: 'Virtual AI coach session',
    icon: Users,
    action: 'coaching',
    gradient: 'from-pink-500 to-rose-500'
  }
]

interface DashboardProps {
  onNavigate: (tab: string) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Compact Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            Hey, Actor! 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Ready to elevate your craft today?
          </p>
        </div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-xl px-4 py-2 text-sm text-white hover:bg-white/20 transition-all duration-200"
        >
          ⚡ Customize
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass hover-glass cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-green-400 mt-1">{stat.change}</p>
                    </div>
                    <div className={`w-10 h-10 ${stat.gradient} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="glass hover-glass cursor-pointer h-full" onClick={() => onNavigate(action.action)}>
                  <CardContent className="p-4 text-center space-y-3">
                    <div className={`w-12 h-12 ${action.gradient} rounded-xl flex items-center justify-center mx-auto animate-float`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-1">{action.title}</h3>
                      <p className="text-xs text-slate-400">{action.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Recent Activity & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center space-x-3 p-3 glass-subtle rounded-lg hover-glass"
                  >
                    <Icon className={`h-5 w-5 ${activity.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{activity.title}</p>
                      <p className="text-xs text-slate-400">{activity.time}</p>
                    </div>
                  </motion.div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Progress Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Script Analysis</span>
                  <span className="text-white">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Line Memorization</span>
                  <span className="text-white">72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Performance Skills</span>
                  <span className="text-white">68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Overall Progress</span>
                  <span className="text-white">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-amber-400" />
                    <span className="text-sm text-white">Next Achievement</span>
                  </div>
                  <span className="text-xs text-slate-400">25 lines away</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Sessions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-subtle rounded-lg p-4 hover-glass">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Line Practice</p>
                    <p className="text-xs text-slate-400">Today, 3:00 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="glass-subtle rounded-lg p-4 hover-glass">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">AI Coaching</p>
                    <p className="text-xs text-slate-400">Tomorrow, 10:00 AM</p>
                  </div>
                </div>
              </div>
              
              <div className="glass-subtle rounded-lg p-4 hover-glass">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 from-teal-500 to-cyan-500 bg-gradient-to-r rounded-lg flex items-center justify-center">
                    <Video className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Performance Review</p>
                    <p className="text-xs text-slate-400">Friday, 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}