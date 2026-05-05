import React, { useState, useRef, useEffect } from "react"
import { Head } from "@inertiajs/react"
import AuthenticatedLayout from "@/layouts/authenticated-layout"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, Send, User, Loader2 } from "lucide-react"
import axios from "axios"

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export default function AIIndex() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I am your CRM AI Assistant. How can I help you today? I can analyze your projects, customers, or financial stats." }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight)
        }
    }, [messages])

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage = input
        setInput("")
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setIsLoading(true)

        try {
            const response = await axios.post(route('ai.chat'), { message: userMessage })
            const aiResponse = response.data.choices[0].message.content
            setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])
        } catch (error: any) {
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: "Sorry, I encountered an error: " + (error.response?.data?.error || error.message) 
            }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthenticatedLayout>
            <Head title="AI Assistant" />
            <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto py-6 px-4">
                <Card className="flex-1 flex flex-col overflow-hidden shadow-xl border-t-4 border-t-primary">
                    <CardHeader className="border-b bg-muted/30 py-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary p-2 rounded-lg">
                                <Bot className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">CRM AI Assistant</CardTitle>
                                <p className="text-xs text-muted-foreground">Powered by Baidu Qianfan via OpenRouter</p>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 overflow-hidden p-0">
                        <ScrollArea className="h-full p-6" ref={scrollRef}>
                            <div className="space-y-6">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <Avatar className="h-9 w-9 border shadow-sm">
                                                {msg.role === 'assistant' ? (
                                                    <>
                                                        <AvatarImage src="" />
                                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                                            <Bot className="h-5 w-5" />
                                                        </AvatarFallback>
                                                    </>
                                                ) : (
                                                    <>
                                                        <AvatarImage src="" />
                                                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                                                            <User className="h-5 w-5" />
                                                        </AvatarFallback>
                                                    </>
                                                )}
                                            </Avatar>
                                            <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                                                msg.role === 'user' 
                                                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                                                : 'bg-muted border rounded-tl-none'
                                            }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="flex gap-3">
                                            <Avatar className="h-9 w-9 border animate-pulse">
                                                <AvatarFallback className="bg-primary text-primary-foreground">
                                                    <Bot className="h-5 w-5" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="bg-muted border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                                <span className="text-sm text-muted-foreground">Thinking...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="p-4 border-t bg-muted/30">
                        <form onSubmit={sendMessage} className="flex w-full gap-3">
                            <Input 
                                placeholder="Type your message here..." 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isLoading}
                                className="flex-1 bg-background"
                            />
                            <Button type="submit" disabled={isLoading || !input.trim()} className="px-6">
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                <span className="ml-2 hidden sm:inline">Send</span>
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
                
                <p className="text-center text-xs text-muted-foreground mt-4 italic">
                    Tip: Ask about your current revenue, project progress, or active clients.
                </p>
            </div>
        </AuthenticatedLayout>
    )
}
