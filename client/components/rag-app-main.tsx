"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Send, FileText, User, Bot, X } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
}

export default function PDFRagApp() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const pdfFiles = Array.from(files).filter((file) => file.type === "application/pdf")
      if (pdfFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...pdfFiles])
        // Add a system message when PDFs are uploaded
        const systemMessage: Message = {
          id: Date.now().toString(),
          type: "assistant",
          content: `${pdfFiles.length} PDF(s) uploaded successfully! You can now ask questions about their content.`,
        }
        setMessages((prev) => [...prev, systemMessage])
      }
    }
    // Reset the input value to allow uploading the same file again
    if (event.target) {
      event.target.value = ""
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleDeleteFile = (indexToDelete: number) => {
    setUploadedFiles((prev) => prev.filter((_, index) => index !== indexToDelete))
    // if (uploadedFiles.length === 1) {
    //   // If this was the last file, clear messages
    //   setMessages([])
    // }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || uploadedFiles.length === 0) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const fileNames = uploadedFiles.map((f) => f.name).join(", ")
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `Based on your ${uploadedFiles.length} PDF(s) (${fileNames}), here's my response to your question: "${inputMessage}". This is a simulated response - in a real application, this would be generated by analyzing the PDF content using RAG technology.`,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-2 flex-shrink-0 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              AI-Powered PDF RAG Assistant
            </h1>
            <p className="text-slate-600 text-sm hidden sm:block">Upload PDFs and ask questions based on their content</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900">Full Name</p>
              <p className="text-xs text-slate-500">name@company.com</p>
            </div>
            <Avatar className="h-8 w-8 ring-2 ring-blue-100">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                FN
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-8xl mx-auto h-full p-4">
          <div className="grid grid-cols-1 grid-rows-[16rem_1fr] lg:grid-rows-1 lg:grid-cols-[2fr_3fr] gap-4 h-full">
            {/* Left Section - PDF Upload */}
            <Card className="flex flex-col bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg shadow-slate-200/50 overflow-hidden p-0">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b border-slate-200/60 p-2 flex justify-center items-center">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  Uploaded PDFs ({uploadedFiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                {/* PDF List */}
                <div className="flex-1 overflow-hidden">
                  {uploadedFiles.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                      <div className="p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl mb-2 lg:mb-6">
                        <FileText className="h-7 w-7 lg:h-12 lg:w-12 text-blue-600 mx-auto" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-semibold text-slate-900">No PDFs uploaded</p>
                        <p className="text-sm text-slate-600">Upload PDF files to analyze with AI</p>
                      </div>
                    </div>
                  ) : (
                    <ScrollArea className="h-full">
                      <div className="p-4 space-y-3">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between  max-w-[60%] lg:max-w-[80%] p-4 bg-gradient-to-r from-white to-slate-50 rounded-xl border border-slate-200/60 hover:shadow-md hover:border-blue-200 transition-all duration-200"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="p-2.5 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                                <FileText className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate" title={file.name}>
                                  {file.name}
                                </p>
                                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleDeleteFile(index)}
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>

                {/* Upload Button at Bottom */}
                <div className="border-t border-slate-200/60 p-4 bg-gradient-to-r from-slate-50/50 to-blue-50/50 flex-shrink-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={handleUploadClick}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-200/50"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload PDF{uploadedFiles.length > 0 ? "s" : ""}
                  </Button>
                  <p className="text-xs text-slate-500 text-center mt-2">You can select multiple PDF files at once</p>
                </div>
              </CardContent>
            </Card>

            {/* Right Section - Chat Interface */}
            <Card className="flex flex-col bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg shadow-slate-200/50 overflow-hidden p-0">
              <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b border-slate-200/60 p-2 flex justify-center items-center">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <div className="p-1.5 bg-indigo-100 rounded-lg">
                    <Bot className="h-4 w-4 text-indigo-600" />
                  </div>
                  Chat with your PDFs
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                {/* Messages Area */}
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-12">
                          <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl mb-6">
                            <Bot className="h-12 w-12 text-indigo-600 mx-auto" />
                          </div>
                          <p className="text-slate-600">Upload PDFs to start asking questions!</p>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`flex gap-3 max-w-[85%] ${
                                message.type === "user" ? "flex-row-reverse" : "flex-row"
                              }`}
                            >
                              <div
                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                                  message.type === "user"
                                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                                    : "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600"
                                }`}
                              >
                                {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                              </div>
                              <div
                                className={`rounded-2xl px-4 py-3 shadow-sm ${
                                  message.type === "user"
                                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                                    : "bg-gradient-to-br from-slate-100 to-slate-50 text-slate-900 border border-slate-200/60"
                                }`}
                              >
                                <p className="text-sm leading-relaxed">{message.content}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                      {isLoading && (
                        <div className="flex gap-3 justify-start">
                          <div className="flex gap-3 max-w-[85%]">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center shadow-sm">
                              <Bot className="h-4 w-4" />
                            </div>
                            <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl px-4 py-3 border border-slate-200/60 shadow-sm">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                <div
                                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>

                {/* Input Area */}
                <div className="border-t border-slate-200/60 p-4 bg-gradient-to-r from-slate-200/50 to-indigo-200/50 flex-shrink-0">
                  <div className="flex gap-3">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        uploadedFiles.length > 0
                          ? "Ask a question about your PDFs..."
                          : "Upload PDFs first to start chatting"
                      }
                      disabled={uploadedFiles.length === 0 || isLoading}
                      className="flex-1 bg-white/80 border-slate-200/60 focus:border-blue-300 focus:ring-blue-200/50 rounded-xl text-sm"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || uploadedFiles.length === 0 || isLoading}
                      size="icon"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-200/50 rounded-xl flex-shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <p className="text-xs text-slate-500 mt-2">
                      Press Enter to send • Analyzing: {uploadedFiles.length} PDF{uploadedFiles.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
