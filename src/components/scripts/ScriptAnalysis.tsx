import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  Users, 
  Eye, 
  Brain, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Download,
  Play,
  BookOpen,
  Zap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { blink } from '../../blink/client'
import { useToast } from '../../hooks/use-toast'

interface Script {
  id: string
  title: string
  fileName: string
  uploadDate: string
  analysisStatus: 'pending' | 'analyzing' | 'completed' | 'error'
  analysisData?: {
    characters: Character[]
    scenes: Scene[]
    summary: string
    totalLines: number
    estimatedReadTime: number
  }
}

interface Character {
  id: string
  name: string
  description: string
  lineCount: number
  importanceScore: number
  traits: string[]
  emotionalRange: string[]
}

interface Scene {
  id: string
  sceneNumber: number
  title: string
  charactersPresent: string[]
  emotionalTone: string
  setting: string
  summary: string
  lineCount: number
}

export function ScriptAnalysis() {
  const [scripts, setScripts] = useState<Script[]>([])
  const [selectedScript, setSelectedScript] = useState<Script | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const { toast } = useToast()

  const analyzeScript = useCallback(async (script: Script, content: string) => {
    try {
      // Simulate AI analysis with realistic processing time
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Generate AI analysis using Blink AI
      const analysisPrompt = `
        Analyze this script and provide detailed character and scene analysis:
        
        ${content.substring(0, 5000)}...
        
        Please provide:
        1. Main characters with descriptions, line counts, and importance scores
        2. Scene breakdown with emotional tones and settings
        3. Overall script summary
        4. Estimated reading time
        
        Format the response as structured data.
      `

      const { object: analysisResult } = await blink.ai.generateObject({
        prompt: analysisPrompt,
        schema: {
          type: 'object',
          properties: {
            characters: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  lineCount: { type: 'number' },
                  importanceScore: { type: 'number' },
                  traits: { type: 'array', items: { type: 'string' } },
                  emotionalRange: { type: 'array', items: { type: 'string' } }
                }
              }
            },
            scenes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  sceneNumber: { type: 'number' },
                  title: { type: 'string' },
                  charactersPresent: { type: 'array', items: { type: 'string' } },
                  emotionalTone: { type: 'string' },
                  setting: { type: 'string' },
                  summary: { type: 'string' },
                  lineCount: { type: 'number' }
                }
              }
            },
            summary: { type: 'string' },
            totalLines: { type: 'number' },
            estimatedReadTime: { type: 'number' }
          }
        }
      })

      // Process analysis results
      const processedAnalysisData = {
        characters: Array.isArray(analysisResult.characters) 
          ? analysisResult.characters.map((char: any, index: number) => ({
              id: `char_${index}`,
              name: char.name || 'Unknown Character',
              description: char.description || 'No description available',
              lineCount: char.lineCount || 0,
              importanceScore: char.importanceScore || 5,
              traits: Array.isArray(char.traits) ? char.traits : [],
              emotionalRange: Array.isArray(char.emotionalRange) ? char.emotionalRange : []
            }))
          : [],
        scenes: Array.isArray(analysisResult.scenes)
          ? analysisResult.scenes.map((scene: any, index: number) => ({
              id: `scene_${index}`,
              sceneNumber: scene.sceneNumber || index + 1,
              title: scene.title || `Scene ${index + 1}`,
              charactersPresent: Array.isArray(scene.charactersPresent) ? scene.charactersPresent : [],
              emotionalTone: scene.emotionalTone || 'Neutral',
              setting: scene.setting || 'Unknown',
              summary: scene.summary || 'No summary available',
              lineCount: scene.lineCount || 0
            }))
          : [],
        summary: analysisResult.summary || 'No summary available',
        totalLines: analysisResult.totalLines || 0,
        estimatedReadTime: analysisResult.estimatedReadTime || 0
      }

      // Update script in database
      await blink.db.scripts.update(script.id, {
        analysisStatus: 'completed',
        analysisData: JSON.stringify(processedAnalysisData)
      })

      // Update local state
      setScripts(prev => prev.map(s => 
        s.id === script.id 
          ? { 
              ...s, 
              analysisStatus: 'completed',
              analysisData: processedAnalysisData
            }
          : s
      ))

      toast({
        title: "Analysis completed",
        description: "Your script has been successfully analyzed!",
      })

    } catch (error) {
      console.error('Analysis error:', error)
      
      // Update database with error status
      try {
        await blink.db.scripts.update(script.id, {
          analysisStatus: 'error'
        })
      } catch (dbError) {
        console.error('Database update error:', dbError)
      }

      setScripts(prev => prev.map(s => 
        s.id === script.id 
          ? { ...s, analysisStatus: 'error' }
          : s
      ))

      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your script. Please try again.",
        variant: "destructive"
      })
    }
  }, [toast])

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return

    // Validate file type
    const allowedTypes = ['text/plain', 'application/pdf', '.txt', '.pdf']
    const fileExtension = file.name.toLowerCase().split('.').pop()
    
    if (!allowedTypes.includes(file.type) && !['txt', 'pdf'].includes(fileExtension || '')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or TXT file.",
        variant: "destructive"
      })
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Upload file to storage
      const { publicUrl } = await blink.storage.upload(
        file,
        `scripts/${Date.now()}-${file.name}`,
        { upsert: true }
      )

      clearInterval(progressInterval)
      setUploadProgress(95)

      // Extract text content from file
      let content = ''
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        content = await file.text()
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        // For PDF files, we'll use the data extraction API
        content = await blink.data.extractFromUrl(publicUrl)
      }

      // Save script to database using Blink SDK
      const user = await blink.auth.me()
      const scriptRecord = await blink.db.scripts.create({
        userId: user.id,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        content: content,
        uploadDate: new Date().toISOString(),
        analysisStatus: 'analyzing'
      })

      // Create script record for local state
      const newScript: Script = {
        id: scriptRecord.id,
        title: scriptRecord.title,
        fileName: file.name,
        uploadDate: scriptRecord.uploadDate,
        analysisStatus: 'analyzing'
      }

      setScripts(prev => [newScript, ...prev])
      setUploadProgress(100)

      // Start AI analysis
      analyzeScript(newScript, content)

      toast({
        title: "Script uploaded successfully",
        description: "AI analysis is now in progress.",
      })

    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your script. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [toast, analyzeScript])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }, [handleFileUpload])

  const getStatusIcon = (status: Script['analysisStatus']) => {
    switch (status) {
      case 'pending':
        return <FileText className="h-5 w-5 text-slate-400" />
      case 'analyzing':
        return <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />
    }
  }

  const getStatusText = (status: Script['analysisStatus']) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'analyzing':
        return 'Analyzing...'
      case 'completed':
        return 'Completed'
      case 'error':
        return 'Error'
    }
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
          Script Analysis
        </h1>
        <p className="text-xl text-slate-400">
          Upload your scripts and get AI-powered character and scene analysis
        </p>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass">
          <CardContent className="p-8">
            <div
              className={`
                relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
                ${dragActive 
                  ? 'border-blue-400 bg-blue-400/10' 
                  : 'border-slate-600 hover:border-slate-500'
                }
                ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => {
                if (!isUploading) {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = '.txt,.pdf'
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) handleFileUpload(file)
                  }
                  input.click()
                }
              }}
            >
              {isUploading ? (
                <div className="space-y-4">
                  <Loader2 className="h-12 w-12 text-blue-400 animate-spin mx-auto" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-white">Uploading script...</p>
                    <Progress value={uploadProgress} className="w-64 mx-auto" />
                    <p className="text-sm text-slate-400">{uploadProgress}% complete</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Upload Your Script
                    </h3>
                    <p className="text-slate-400 mb-4">
                      Drag and drop your script file here, or click to browse
                    </p>
                    <p className="text-sm text-slate-500">
                      Supports PDF and TXT files up to 10MB
                    </p>
                  </div>
                  <Button className="btn-primary">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Scripts List */}
      {scripts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Your Scripts</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {scripts.map((script, index) => (
              <motion.div
                key={script.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card 
                  className={`glass hover-glass cursor-pointer transition-all duration-300 ${
                    selectedScript?.id === script.id ? 'ring-2 ring-blue-400' : ''
                  }`}
                  onClick={() => setSelectedScript(script)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span className="truncate">{script.title}</span>
                      </CardTitle>
                      <Badge 
                        variant="secondary" 
                        className={`
                          ${script.analysisStatus === 'completed' ? 'bg-green-500/20 text-green-400' : ''}
                          ${script.analysisStatus === 'analyzing' ? 'bg-blue-500/20 text-blue-400' : ''}
                          ${script.analysisStatus === 'error' ? 'bg-red-500/20 text-red-400' : ''}
                          ${script.analysisStatus === 'pending' ? 'bg-slate-500/20 text-slate-400' : ''}
                        `}
                      >
                        {getStatusIcon(script.analysisStatus)}
                        <span className="ml-1">{getStatusText(script.analysisStatus)}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Uploaded</span>
                        <span className="text-white">
                          {new Date(script.uploadDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {script.analysisData && (
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">
                              {script.analysisData.characters.length}
                            </p>
                            <p className="text-xs text-slate-400">Characters</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">
                              {script.analysisData.scenes.length}
                            </p>
                            <p className="text-xs text-slate-400">Scenes</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Script Analysis Details */}
      <AnimatePresence>
        {selectedScript && selectedScript.analysisData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Analysis: {selectedScript.title}
              </h2>
              <div className="flex space-x-2">
                <Button variant="outline" className="glass">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button className="btn-primary">
                  <Play className="h-4 w-4 mr-2" />
                  Start Practice
                </Button>
              </div>
            </div>

            {/* Analysis Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">
                    {selectedScript.analysisData.characters.length}
                  </p>
                  <p className="text-sm text-slate-400">Characters</p>
                </CardContent>
              </Card>
              
              <Card className="glass">
                <CardContent className="p-6 text-center">
                  <Eye className="h-8 w-8 text-teal-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">
                    {selectedScript.analysisData.scenes.length}
                  </p>
                  <p className="text-sm text-slate-400">Scenes</p>
                </CardContent>
              </Card>
              
              <Card className="glass">
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">
                    {selectedScript.analysisData.totalLines}
                  </p>
                  <p className="text-sm text-slate-400">Total Lines</p>
                </CardContent>
              </Card>
              
              <Card className="glass">
                <CardContent className="p-6 text-center">
                  <Zap className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">
                    {selectedScript.analysisData.estimatedReadTime}m
                  </p>
                  <p className="text-sm text-slate-400">Read Time</p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analysis Tabs */}
            <Card className="glass">
              <CardContent className="p-6">
                <Tabs defaultValue="characters" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 glass">
                    <TabsTrigger value="characters">Characters</TabsTrigger>
                    <TabsTrigger value="scenes">Scenes</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="characters" className="mt-6 space-y-4">
                    {(selectedScript.analysisData.characters || []).map((character) => (
                      <Card key={character.id} className="glass-subtle">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-lg font-semibold text-white">
                                {character.name}
                              </h4>
                              <p className="text-sm text-slate-400">
                                {character.lineCount} lines • Importance: {character.importanceScore}/10
                              </p>
                            </div>
                            <div className="flex space-x-1">
                              {(Array.isArray(character.traits) ? character.traits : []).slice(0, 3).map((trait, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {trait}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-300 text-sm mb-3">
                            {character.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {(Array.isArray(character.emotionalRange) ? character.emotionalRange : []).map((emotion, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {emotion}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="scenes" className="mt-6 space-y-4">
                    {(selectedScript.analysisData.scenes || []).map((scene) => (
                      <Card key={scene.id} className="glass-subtle">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-lg font-semibold text-white">
                                Scene {scene.sceneNumber}: {scene.title}
                              </h4>
                              <p className="text-sm text-slate-400">
                                {scene.lineCount} lines • {scene.emotionalTone}
                              </p>
                            </div>
                            <Badge variant="secondary">
                              {scene.setting}
                            </Badge>
                          </div>
                          <p className="text-slate-300 text-sm mb-3">
                            {scene.summary}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {(Array.isArray(scene.charactersPresent) ? scene.charactersPresent : []).map((character, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {character}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="summary" className="mt-6">
                    <Card className="glass-subtle">
                      <CardContent className="p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">
                          Script Summary
                        </h4>
                        <p className="text-slate-300 leading-relaxed">
                          {selectedScript.analysisData.summary}
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {scripts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 animate-float">
            <Brain className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Ready to analyze your first script?
          </h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Upload a script to get detailed character analysis, scene breakdowns, and insights to improve your performance.
          </p>
        </motion.div>
      )}
    </div>
  )
}