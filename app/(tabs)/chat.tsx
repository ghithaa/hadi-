import React, { useState, useRef } from 'react';
import { View, Text, TextInput, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Animated, Alert } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Send, Smile, Mic } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const { t, language } = useLocalization();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: t('chat.welcome'),
    },
  ]);
  const flatListRef = useRef<FlatList>(null);
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t('chat.reply.standard'),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleVoiceSession = () => {
    Alert.alert(t('common.soon'), t('chat.voiceSessionSoon'));
  };

  return (
    <View className="flex-1 bg-background">
      {/* Top Navigation Header */}
      <View className="bg-background border-b border-border/40">
        <AppHeader />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        className="flex-1"
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, paddingTop: 25 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isUser = item.role === 'user';
            return (
              <View className={cn("mb-8 flex-row items-start", isUser ? (language === 'ar' ? "justify-start" : "justify-end") : (language === 'ar' ? "justify-end" : "justify-start"))}>
                {!isUser && (
                  <View className={cn("flex-1", language === 'ar' ? "mr-3" : "ml-3")}>
                    <View
                      className={cn(
                        "bg-card border border-border rounded-[24px] p-5",
                        language === 'ar' ? "rounded-tr-[4px]" : "rounded-tl-[4px]"
                      )}
                    >
                      <Text className={cn("text-[14px] leading-6 text-foreground font-bold", language === 'ar' ? "text-right" : "text-left")}>
                        {item.content}
                      </Text>
                    </View>
                  </View>
                )}

                {!isUser && (
                  <View className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 items-center justify-center mt-1 text-primary">
                    <Smile className="text-primary" size={20} />
                  </View>
                )}

                {isUser && (
                  <View
                    className={cn(
                      "bg-primary rounded-[22px] px-6 py-4 max-w-[85%] shadow-lg shadow-primary/20",
                      language === 'ar' ? "rounded-br-[4px]" : "rounded-bl-[4px]"
                    )}
                  >
                    <Text className={cn("text-[14px] leading-6 font-bold text-primary-foreground", language === 'ar' ? "text-right" : "text-left")}>
                      {item.content}
                    </Text>
                  </View>
                )}
              </View>
            );
          }}
        />

        <View className="bg-background/98 border-t border-border p-5 pb-10">
          {messages.length === 1 && (
            <View className="mb-4">
              <View className={cn("flex-row justify-between mb-3", language === 'en' && "flex-row-reverse")}>
                <TouchableOpacity
                  onPress={() => handlePromptClick(t('chat.suggested.anxiety'))}
                  className="bg-card border border-border px-4 py-3 rounded-full flex-row items-center justify-center w-[48%]"
                >
                  <Text className="text-[10px] font-bold text-muted-foreground">{t('chat.suggested.anxiety')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handlePromptClick(t('chat.suggested.sleep'))}
                  className="bg-card border border-border px-4 py-3 rounded-full flex-row items-center justify-center w-[48%]"
                >
                  <Text className="text-[10px] font-bold text-muted-foreground">{t('chat.suggested.sleep')}</Text>
                </TouchableOpacity>
              </View>
              <View className={cn("flex-row justify-between", language === 'en' && "flex-row-reverse")}>
                <TouchableOpacity
                  onPress={() => handlePromptClick(t('chat.suggested.stress'))}
                  className="bg-card border border-border px-3 py-3 rounded-full flex-row items-center justify-center w-[48%]"
                >
                  <Text className="text-[9px] font-bold text-muted-foreground">{t('chat.suggested.stress')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handlePromptClick(t('chat.suggested.relax'))}
                  className="bg-card border border-border px-4 py-3 rounded-full flex-row items-center justify-center w-[48%]"
                >
                  <Text className="text-[10px] font-bold text-muted-foreground">{t('chat.suggested.relax')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View className={cn("flex-row items-center bg-muted rounded-full px-5 border border-border h-14 mb-5", language === 'ar' ? "flex-row" : "flex-row-reverse")}>
            <TouchableOpacity
              onPress={handleSend}
              disabled={!input.trim()}
              activeOpacity={0.8}
              className={cn(
                "h-10 w-10 rounded-full items-center justify-center",
                !input.trim() ? "bg-muted-foreground/20" : "bg-primary"
              )}
            >
              <Send size={18} color={!input.trim() ? "#94a3b8" : "white"} style={{ transform: [{ scaleX: language === 'ar' ? 1 : -1 }] }} />
            </TouchableOpacity>
            <TextInput
              className={cn("flex-1 text-[15px] text-foreground px-4 font-semibold", language === 'ar' ? "text-right" : "text-left")}
              placeholder={t('chat.placeholder')}
              placeholderTextColor="#94a3b8"
              value={input}
              onChangeText={setInput}
            />
          </View>

          {/* Premium Voice Session Button */}
          <View className='mb-0'>
            <TouchableOpacity
              className={cn(
                "bg-primary w-full h-14 rounded-full flex-row items-center justify-center shadow-sm shadow-primary/20",
                language === 'en' && "flex-row-reverse"
              )}
              activeOpacity={0.8}
              onPress={handleVoiceSession}
            >
              <View className={language === 'ar' ? "mr-2" : "ml-2"}>
                <Mic size={16} color="white" />
              </View>
              <Text className={cn("text-primary-foreground text-[14px] font-bold", language === 'ar' ? "mr-3" : "ml-3")}>{t('chat.voiceSession')}</Text>
              <Animated.View
                style={{ opacity: pulseAnim }}
                className={cn("h-2 w-2 rounded-full bg-primary-foreground/90 border border-primary-foreground", language === 'ar' ? "ml-0" : "mr-0")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
