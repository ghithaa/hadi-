import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Animated } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Send, Smile, Wind, Brain, Activity, Mic } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';
import { chatService } from '@/services/chat.service';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export default function ChatPage() {
  const { t, language } = useLocalization();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: t('chat.welcome') },
  ]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleSend = useCallback(async () => {
    const content = input.trim();
    if (!content || isSending) return;

    setInput('');
    setIsSending(true);

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content };
    setMessages((prev) => [...prev, userMsg]);

    // Create a placeholder for the assistant's streaming response
    const assistantMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantMsgId, role: 'assistant', content: '', isStreaming: true },
    ]);

    try {
      let currentSessionId = sessionId;

      // Create session if none exists
      if (!currentSessionId) {
        const session = await chatService.createSession({ title: content.slice(0, 50) });
        currentSessionId = session.id;
        setSessionId(session.id);
      }

      let accumulated = '';

      await chatService.sendMessageStream(
        currentSessionId,
        { content },
        (chunk) => {
          accumulated += chunk;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: accumulated, isStreaming: true }
                : m
            )
          );
        },
        () => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId ? { ...m, isStreaming: false } : m
            )
          );
          setIsSending(false);
        },
        (err) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: 'عذراً، حدث خطأ. يرجى المحاولة مجدداً.', isStreaming: false }
                : m
            )
          );
          setIsSending(false);
        }
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? { ...m, content: 'عذراً، حدث خطأ. يرجى المحاولة مجدداً.', isStreaming: false }
            : m
        )
      );
      setIsSending(false);
    }
  }, [input, isSending, sessionId]);

  const handlePromptClick = (prompt: string) => setInput(prompt);

  return (
    <View className="flex-1 bg-background">
      <View className="bg-background border-b border-border/40">
        <AppHeader />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 400, paddingTop: 25 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isUser = item.role === 'user';
          return (
            <View className={cn("mb-8 flex-row items-start", isUser ? (language === 'ar' ? "justify-start" : "justify-end") : (language === 'ar' ? "justify-end" : "justify-start"))}>
              {!isUser && (
                <View className={cn("flex-1", language === 'ar' ? "mr-3" : "ml-3")}>
                  <View className={cn("bg-card border border-border rounded-[24px] p-5", language === 'ar' ? "rounded-tr-[4px]" : "rounded-tl-[4px]")}>
                    <Text className={cn("text-[14px] leading-6 text-foreground font-bold", language === 'ar' ? "text-right" : "text-left")}>
                      {item.content}
                      {item.isStreaming && <Text className="text-primary">▌</Text>}
                    </Text>
                  </View>
                </View>
              )}
              {!isUser && (
                <View className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 items-center justify-center mt-1">
                  <Smile className="text-primary" size={20} />
                </View>
              )}
              {isUser && (
                <View className={cn("bg-primary rounded-[22px] px-6 py-4 max-w-[85%] shadow-lg shadow-primary/20", language === 'ar' ? "rounded-br-[4px]" : "rounded-bl-[4px]")}>
                  <Text className={cn("text-[14px] leading-6 font-bold text-primary-foreground", language === 'ar' ? "text-right" : "text-left")}>
                    {item.content}
                  </Text>
                </View>
              )}
            </View>
          );
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="absolute bottom-0 left-0 right-0 bg-background/98 border-t border-border p-5 pb-10"
      >
        {messages.length === 1 && (
          <View className="mb-4">
            <View className={cn("flex-row justify-between mb-3", language === 'en' && "flex-row-reverse")}>
              <TouchableOpacity onPress={() => handlePromptClick(t('chat.suggested.anxiety'))} className="bg-card border border-border px-4 py-3 rounded-full flex-row items-center justify-center w-[48%]">
                <Text className="text-[10px] font-bold text-muted-foreground">{t('chat.suggested.anxiety')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePromptClick(t('chat.suggested.sleep'))} className="bg-card border border-border px-4 py-3 rounded-full flex-row items-center justify-center w-[48%]">
                <Text className="text-[10px] font-bold text-muted-foreground">{t('chat.suggested.sleep')}</Text>
              </TouchableOpacity>
            </View>
            <View className={cn("flex-row justify-between", language === 'en' && "flex-row-reverse")}>
              <TouchableOpacity onPress={() => handlePromptClick(t('chat.suggested.stress'))} className="bg-card border border-border px-3 py-3 rounded-full flex-row items-center justify-center w-[48%]">
                <Text className="text-[9px] font-bold text-muted-foreground">{t('chat.suggested.stress')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePromptClick(t('chat.suggested.relax'))} className="bg-card border border-border px-4 py-3 rounded-full flex-row items-center justify-center w-[48%]">
                <Text className="text-[10px] font-bold text-muted-foreground">{t('chat.suggested.relax')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View className={cn("flex-row items-center bg-muted rounded-full px-5 border border-border h-14 mb-5", language === 'ar' ? "flex-row" : "flex-row-reverse")}>
          <TouchableOpacity
            onPress={handleSend}
            disabled={!input.trim() || isSending}
            activeOpacity={0.8}
            className={cn("h-10 w-10 rounded-full items-center justify-center", (!input.trim() || isSending) ? "bg-muted-foreground/20" : "bg-primary")}
          >
            <Send size={18} color={(!input.trim() || isSending) ? "#94a3b8" : "white"} style={{ transform: [{ scaleX: language === 'ar' ? 1 : -1 }] }} />
          </TouchableOpacity>
          <TextInput
            className={cn("flex-1 text-[15px] text-foreground px-4 font-semibold", language === 'ar' ? "text-right" : "text-left")}
            placeholder={t('chat.placeholder')}
            placeholderTextColor="#94a3b8"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
        </View>

        <View className="mb-6">
          <TouchableOpacity
            className={cn("bg-[#8B5CF6] w-full h-14 rounded-full flex-row items-center justify-center", language === 'en' && "flex-row-reverse")}
            activeOpacity={0.8}
          >
            <View className={language === 'ar' ? "mr-2" : "ml-2"}>
              <Mic size={16} color="white" />
            </View>
            <Text className={cn("text-primary-foreground text-[14px] font-bold", language === 'ar' ? "mr-3" : "ml-3")}>{t('chat.voiceSession')}</Text>
            <Animated.View style={{ opacity: pulseAnim }} className={cn("h-2 w-2 rounded-full bg-accent border border-primary-foreground")} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
