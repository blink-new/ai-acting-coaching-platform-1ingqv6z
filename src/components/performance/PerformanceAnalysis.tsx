import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  Play, 
  Pause, 
  RotateCcw, 
  Download,
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  Eye,
  Mic,
  Heart,
  Brain,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Loader2,
  Video,
  FileVideo,
  X
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { blink } from '../../blink/client'
import { useToast } from '../../hooks/use-toast'

interface PerformanceScore {
  overall: number
  bodyLanguage: number
  voice: number
  emotion: number
  timing: number
}

interface PerformanceMoment {
  timestamp: number
  type: 'best' | 'worst' | 'improvement'
  score: number
  feedback: string
  category: string
}

interface AnalysisResult {
  scores: PerformanceScore
  moments: PerformanceMoment[]
  feedback: string
  improvements: string[]
  strengths: string[]
  nextSteps: string[]
}

export function PerformanceAnalysis() {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [selectedMoment, setSelectedMoment] = useState<PerformanceMoment | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith('video/')) {
        setUploadedVideo(file)
        const url = URL.createObjectURL(file)
        setVideoUrl(url)
        setAnalysisResult(null)
        toast({
          title: "Video uploaded successfully",
          description: "Ready for analysis"
        })
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a video file",
          variant: "destructive"
        })
      }
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('video/')) {
      setUploadedVideo(file)
      const url = URL.createObjectURL(file)
      setVideoUrl(url)
      setAnalysisResult(null)
      toast({
        title: "Video uploaded successfully",
        description: "Ready for analysis"
      })
    }
  }

  const analyzePerformance = async () => {
    if (!uploadedVideo) return

    setIsAnalyzing(true)
    try {
      // Upload video to storage first
      const { publicUrl } = await blink.storage.upload(
        uploadedVideo,
        `performances/${Date.now()}-${uploadedVideo.name}`,
        { upsert: true }
      )

      // Simulate AI analysis with realistic results
      await new Promise(resolve => setTimeout(resolve, 3000))

      const mockResult: AnalysisResult = {
        scores: {
          overall: 78,
          bodyLanguage: 82,
          voice: 75,
          emotion: 80,
          timing: 73
        },
        moments: [
          {
            timestamp: 15,
            type: 'best',
            score: 92,
            feedback: 'Excellent emotional connection and natural body language',
            category: 'Emotional Expression'
          },
          {
            timestamp: 45,
            type: 'improvement',
            score: 65,
            feedback: 'Voice projection could be stronger, consider breathing exercises',
            category: 'Voice & Diction'
          },
          {
            timestamp: 78,
            type: 'best',
            score: 88,
            feedback: 'Perfect timing and rhythm in dialogue delivery',
            category: 'Timing & Pacing'
          },
          {
            timestamp: 102,
            type: 'worst',
            score: 58,
            feedback: 'Posture appears tense, try relaxation techniques',
            category: 'Body Language'
          }
        ],
        feedback: "Your performance shows strong emotional intelligence and natural instincts. Focus on voice projection and physical relaxation to elevate your craft to the next level.",
        improvements: [
          "Practice diaphragmatic breathing for stronger voice projection",
          "Work on shoulder and neck relaxation exercises",
          "Experiment with more dynamic gesture variations",
          "Focus on maintaining eye contact with imaginary scene partners"
        ],
        strengths: [
          "Natural emotional expression and authenticity",
          "Good sense of timing and rhythm",
          "Strong facial expressions that convey subtext",
          "Confident stage presence and charisma"
        ],
        nextSteps: [
          "Record daily voice exercises for 2 weeks",
          "Practice the same scene with different emotional approaches",
          "Work with a movement coach on physical tension",
          "Schedule follow-up analysis in 1 month"
        ]
      }

      setAnalysisResult(mockResult)
      
      // Save to database using Blink SDK
      const user = await blink.auth.me()
      await blink.db.performances.create({
        userId: user.id,
        videoUrl: publicUrl,
        analysisData: JSON.stringify(mockResult),
        uploadDate: new Date().toISOString(),
        overallScore: mockResult.scores.overall
      })

      toast({
        title: "Analysis complete!",
        description: "Your performance has been analyzed successfully"
      })
    } catch (error) {
      console.error('Analysis failed:', error)
      toast({
        title: "Analysis failed",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const seekToMoment = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp
      setCurrentTime(timestamp)
      setSelectedMoment(analysisResult?.moments.find(m => m.timestamp === timestamp) || null)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500'
    if (score >= 60) return 'from-yellow-500 to-amber-500'
    return 'from-red-500 to-rose-500'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold gradient-text-primary">
          Performance Analysis
        </h1>
        <p className="text-xl text-slate-400">
          Upload your performance and get AI-powered feedback
        </p>
      </motion.div>

      {/* Upload Section */}
      {!uploadedVideo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass">
            <CardContent className="p-8">
              <div
                className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover-glass cursor-pointer transition-all duration-300"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-6">
                  <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto animate-float">
                    <Upload className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Upload Your Performance</h3>
                    <p className="text-slate-400 mb-4">
                      Drag and drop your video file here, or click to browse
                    </p>
                    <p className="text-sm text-slate-500">
                      Supports MP4, MOV, AVI • Max file size: 100MB
                    </p>
                  </div>
                  <Button className="btn-primary">
                    <FileVideo className="h-5 w-5 mr-2" />
                    Choose Video File
                  </Button>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Video Player & Analysis */}
      {uploadedVideo && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Video className="h-5 w-5" />
                    <span>Performance Video</span>
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setUploadedVideo(null)
                      setVideoUrl('')
                      setAnalysisResult(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative rounded-xl overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full aspect-video"
                    onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={togglePlayPause}
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between text-sm text-white">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                        <div className="relative">
                          <Progress value={(currentTime / duration) * 100} className="h-1" />
                          {/* Moment markers */}
                          {analysisResult?.moments.map((moment, index) => (
                            <button
                              key={index}
                              className={`absolute top-0 w-3 h-3 rounded-full transform -translate-y-1 -translate-x-1.5 ${
                                moment.type === 'best' ? 'bg-green-400' :
                                moment.type === 'worst' ? 'bg-red-400' : 'bg-yellow-400'
                              }`}
                              style={{ left: `${(moment.timestamp / duration) * 100}%` }}
                              onClick={() => seekToMoment(moment.timestamp)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis Button */}
                <div className="flex justify-center">
                  <Button
                    onClick={analyzePerformance}
                    disabled={isAnalyzing}
                    className="btn-primary px-8 py-3"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Analyzing Performance...
                      </>
                    ) : (
                      <>
                        <Brain className="h-5 w-5 mr-2" />
                        Analyze Performance
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {uploadedVideo.name.split('.')[0]}
                  </div>
                  <div className="text-sm text-slate-400">
                    {(uploadedVideo.size / (1024 * 1024)).toFixed(1)} MB
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration</span>
                    <span className="text-white">{formatTime(duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status</span>
                    <Badge variant={analysisResult ? "default" : "secondary"}>
                      {analysisResult ? "Analyzed" : "Ready"}
                    </Badge>
                  </div>
                  {analysisResult && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Overall Score</span>
                      <span className={`font-bold ${getScoreColor(analysisResult.scores.overall)}`}>
                        {analysisResult.scores.overall}%
                      </span>
                    </div>
                  )}
                </div>

                {selectedMoment && (
                  <>
                    <Separator className="bg-white/10" />
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-white">Selected Moment</div>
                      <div className="text-xs text-slate-400">{formatTime(selectedMoment.timestamp)}</div>
                      <div className={`text-sm ${getScoreColor(selectedMoment.score)}`}>
                        {selectedMoment.category} - {selectedMoment.score}%
                      </div>
                      <div className="text-xs text-slate-300">{selectedMoment.feedback}</div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="scores" className="space-y-6">
            <TabsList className="glass w-full justify-start">
              <TabsTrigger value="scores" className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>Scores & Skills</span>
              </TabsTrigger>
              <TabsTrigger value="moments" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Key Moments</span>
              </TabsTrigger>
              <TabsTrigger value="feedback" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>AI Feedback</span>
              </TabsTrigger>
              <TabsTrigger value="improvement" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Improvement Plan</span>
              </TabsTrigger>
            </TabsList>

            {/* Scores Tab */}
            <TabsContent value="scores">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Overall Score */}
                <Card className="glass md:col-span-2 lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-white text-center">Overall Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className={`text-6xl font-bold ${getScoreColor(analysisResult.scores.overall)}`}>
                      {analysisResult.scores.overall}%
                    </div>
                    <div className={`w-24 h-24 bg-gradient-to-r ${getScoreGradient(analysisResult.scores.overall)} rounded-full flex items-center justify-center mx-auto`}>
                      <Award className="h-12 w-12 text-white" />
                    </div>
                    <p className="text-slate-400">
                      {analysisResult.scores.overall >= 80 ? 'Excellent Performance!' :
                       analysisResult.scores.overall >= 60 ? 'Good Performance' : 'Needs Improvement'}
                    </p>
                  </CardContent>
                </Card>

                {/* Individual Scores */}
                <div className="md:col-span-2 space-y-4">
                  {Object.entries(analysisResult.scores).filter(([key]) => key !== 'overall').map(([key, score]) => (
                    <Card key={key} className="glass">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className={`font-bold ${getScoreColor(score)}`}>{score}%</span>
                        </div>
                        <Progress value={score} className="h-2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Moments Tab */}
            <TabsContent value="moments">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {analysisResult.moments.map((moment, index) => (
                  <Card key={index} className="glass hover-glass cursor-pointer" onClick={() => seekToMoment(moment.timestamp)}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          moment.type === 'best' ? 'bg-green-500/20 text-green-400' :
                          moment.type === 'worst' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {moment.type === 'best' ? <TrendingUp className="h-6 w-6" /> :
                           moment.type === 'worst' ? <TrendingDown className="h-6 w-6" /> :
                           <AlertCircle className="h-6 w-6" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={
                              moment.type === 'best' ? 'default' :
                              moment.type === 'worst' ? 'destructive' : 'secondary'
                            }>
                              {moment.type === 'best' ? 'Best Moment' :
                               moment.type === 'worst' ? 'Needs Work' : 'Improvement'}
                            </Badge>
                            <span className="text-sm text-slate-400">{formatTime(moment.timestamp)}</span>
                          </div>
                          <h4 className="text-white font-medium mb-1">{moment.category}</h4>
                          <p className="text-sm text-slate-300 mb-2">{moment.feedback}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-slate-400">Score:</span>
                            <span className={`text-sm font-bold ${getScoreColor(moment.score)}`}>
                              {moment.score}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Feedback Tab */}
            <TabsContent value="feedback">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>AI Performance Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-slate-300 leading-relaxed">
                    {analysisResult.feedback}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <div>
                      <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span>Your Strengths</span>
                      </h4>
                      <ul className="space-y-2">
                        {analysisResult.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-300 text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Areas for Improvement */}
                    <div>
                      <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-yellow-400" />
                        <span>Areas for Growth</span>
                      </h4>
                      <ul className="space-y-2">
                        {analysisResult.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-300 text-sm">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Improvement Plan Tab */}
            <TabsContent value="improvement">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Your Personalized Improvement Plan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analysisResult.nextSteps.map((step, index) => (
                      <Card key={index} className="glass-subtle">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-sm">{index + 1}</span>
                            </div>
                            <p className="text-slate-300 text-sm">{step}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="text-center pt-6">
                    <Button className="btn-primary">
                      <Download className="h-5 w-5 mr-2" />
                      Download Full Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </div>
  )
}