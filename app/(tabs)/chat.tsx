import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Modal, Image, Keyboard } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { AppHeader } from '@/components/app-header';
import { Send, Smile, Mic, History, Plus, X } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';
import { useQueryClient } from '@tanstack/react-query';
import { useChatSessions, useChatMessages, useCreateSession } from '@/hooks/use-chat';
import { chatService } from '@/services/chat.service';
import { assessmentsService } from '@/services/assessments.service';
import { TestModal } from '@/components/chat/TestModal';
import { TestRequestCard } from '@/components/chat/TestRequestCard';
import { availableTests } from '@/constants/tests-data';
import { useLocalSearchParams } from 'expo-router';
import { buildAssessmentAnswersPayload, computeAssessmentResult } from '@/lib/assessment-analysis';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getChatConsent, setChatConsent } from '@/lib/token-storage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  testRequest?: {
    id: string;
    title: string;
    description: string;
    completed?: boolean;
  };
}





export default function ChatPage() {
  const { t, language, isRTL, flexDir, textAlign, alignItems, justifyContent, l, r } = useLocalization();
  const params = useLocalSearchParams<{ sessionId?: string; autoMessage?: string }>();
  const requestedSessionId = typeof params.sessionId === 'string' ? params.sessionId : undefined;
  const requestedAutoMessage = typeof params.autoMessage === 'string' ? params.autoMessage : undefined;
  
  const { data: sessions, isLoading: isLoadingSessions } = useChatSessions();
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
  const [currentLoadedSessionId, setCurrentLoadedSessionId] = useState<string | undefined>();
  const [isHistoryModalVisible, setHistoryModalVisible] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isConsentModalVisible, setIsConsentModalVisible] = useState(false);
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  const { data: historyMessages, isLoading: isLoadingHistory, isFetching: isFetchingHistory } = useChatMessages(activeSessionId);
  const { mutateAsync: createSession } = useCreateSession();
  const queryClient = useQueryClient();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);

  const [activeTest, setActiveTest] = useState<any>(null);
  const [testModalVisible, setTestModalVisible] = useState(false);
  const [currentTestMessageId, setCurrentTestMessageId] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  const flatListRef = useRef<FlatList>(null);
  const opacity = useSharedValue(0.4);
  const autoSentRef = useRef<Record<string, boolean>>({});
  const insets = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }));

  useEffect(() => {
    if (!requestedSessionId) return;
    if (activeSessionId === requestedSessionId) return;
    setActiveSessionId(requestedSessionId);
  }, [requestedSessionId, activeSessionId]);

  // Set default session if none selected and sessions exist (only on initial load)
  useEffect(() => {
    if (requestedSessionId) return;
    if (sessions && sessions.length > 0 && !hasInitialized && !isLoadingSessions) {
      setActiveSessionId(sessions[0].id);
      setHasInitialized(true);
    } else if (sessions && sessions.length === 0 && !hasInitialized && !isLoadingSessions) {
      setHasInitialized(true);
    }
  }, [sessions, hasInitialized, isLoadingSessions, requestedSessionId]);

  // Initialize messages from history ONLY when we explicitly switch sessions
  useEffect(() => {
    if (activeSessionId !== currentLoadedSessionId) {
      if (isFetchingHistory || isLoadingHistory) return;

      const welcomeMsg: Message = {
        id: 'welcome-msg',
        role: 'assistant',
        content: t('chat.welcome'),
      };

      if (historyMessages && historyMessages.length > 0) {
        const formattedHistory: Message[] = historyMessages.map(msg => {
          const foundTest = parseTestRequest(msg.content);
          return {
            id: msg.id,
            role: msg.role.toUpperCase() === 'USER' ? 'user' : 'assistant',
            content: msg.content.replace(/\[TEST_REQUEST:.*?\]/g, ''),
            testRequest: foundTest ? {
              id: foundTest.id,
              title: foundTest.title,
              description: foundTest.description,
              completed: msg.test_result !== undefined || msg.testResult !== undefined // Assume if there's a result, it's completed
            } : undefined
          };
        });
        setMessages([welcomeMsg, ...formattedHistory]);
        setCurrentLoadedSessionId(activeSessionId);
      } else if (historyMessages?.length === 0) {
        setMessages([welcomeMsg]);
        setCurrentLoadedSessionId(activeSessionId);
      } else if (!activeSessionId && !isLoadingSessions) {
        setMessages([welcomeMsg]);
        setCurrentLoadedSessionId(undefined);
      }
    }
  }, [historyMessages, activeSessionId, currentLoadedSessionId, isFetchingHistory, isLoadingHistory, t, isLoadingSessions]);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.4, { duration: 1000 })
      ),
      -1, // infinite
      false
    );
  }, []);

  // Check consent on mount
  useEffect(() => {
    const checkConsent = async () => {
      const consent = await getChatConsent();
      if (!consent) {
        setIsConsentModalVisible(true);
      }
      setHasConsent(consent);
    };
    checkConsent();
  }, []);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event) => {
      const nextHeight = Math.max(0, (event.endCoordinates?.height || 0) - (Platform.OS === 'android' ? insets.bottom : 0));
      setKeyboardHeight(nextHeight);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [insets.bottom]);

  const handleNewChat = () => {
    setActiveSessionId(undefined);
    setCurrentLoadedSessionId(undefined);
    setMessages([{ id: 'welcome-msg', role: 'assistant', content: t('chat.welcome') }]);
    setHistoryModalVisible(false);
  };

  const sendMessageContent = async (content: string, clearInput = false) => {
    if (!content.trim() || isSending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (clearInput) setInput('');
    setIsSending(true);

    try {
      let currentSessionId = activeSessionId;
      
      // Auto-create session if none exists
      if (!currentSessionId) {
         // Use the first 35 characters of the user's message as the title instead of "محادثة جديدة"
         const chatTitle = userMessage.content.length > 35 ? userMessage.content.slice(0, 35) + '...' : userMessage.content;
         const newSession = await createSession({ title: chatTitle });
         currentSessionId = newSession.id;
         setCurrentLoadedSessionId(newSession.id); // Prevent history sync from wiping local state
         setActiveSessionId(newSession.id);
      }

      const botMessageId = (Date.now() + 1).toString();
      let currentBotContent = '';

      // Add empty bot message that we will stream into
      setMessages((prev) => [...prev, { id: botMessageId, role: 'assistant', content: '' }]);

      await chatService.sendMessageStream(
        currentSessionId,
        { content: userMessage.content },
        (token) => {
          currentBotContent += token;
          const foundTest = parseTestRequest(currentBotContent);
          
          setMessages((prev) => 
            prev.map(msg => msg.id === botMessageId 
              ? { 
                  ...msg, 
                  content: currentBotContent.replace(/\[TEST_REQUEST:.*?\]/g, ''),
                  testRequest: foundTest ? {
                    id: foundTest.id,
                    title: foundTest.title,
                    description: foundTest.description,
                    completed: false
                  } : msg.testRequest
                } 
              : msg)
          );
        },
        () => {
          setIsSending(false);
          queryClient.invalidateQueries({ queryKey: ['chat', 'sessions'] });
        },
        (error) => {
          setIsSending(false);
          console.error("Chat Stream Error:", error);
          setMessages((prev) => 
            prev.map(msg => msg.id === botMessageId ? { ...msg, content: currentBotContent + `\n\n[Error: ${error.message}]` } : msg)
          );
        }
      );
    } catch (err) {
      setIsSending(false);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleSend = async () => {
    await sendMessageContent(input, true);
  };

  useEffect(() => {
    if (!requestedSessionId || !requestedAutoMessage) return;
    if (activeSessionId !== requestedSessionId) return;
    if (autoSentRef.current[requestedSessionId]) return;
    if (isSending) return;
    if (isFetchingHistory || isLoadingHistory) return;

    autoSentRef.current[requestedSessionId] = true;
    void sendMessageContent(requestedAutoMessage, false);
  }, [requestedSessionId, requestedAutoMessage, activeSessionId, isSending, isFetchingHistory, isLoadingHistory]);

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleVoiceSession = () => {
    Alert.alert(t('common.soon'), t('chat.voiceSessionSoon'));
  };

  const buildChatAssessmentQuestions = (testData: any) => {
    return ((testData?.questions || []) as any[]).map((question: any) => ({
      id: question.id,
      text: isRTL ? question.text_ar : question.text_en,
      options: (question.options || testData?.options || []).map((option: any) => ({
        label: isRTL ? option.text_ar : option.text_en,
        value: option.value,
      })),
    }));
  };

  const parseTestRequest = (content: string) => {
    // 1. Look for [TEST_REQUEST:testId] - most reliable
    const testMatch = content.match(/\[TEST_REQUEST:(.*?)\]/);
    if (testMatch) {
      const testId = testMatch[1].trim();
      const test = availableTests[testId];
      if (test) {
        return {
          id: testId,
          title: isRTL ? test.full_name_ar : test.full_name_en,
          description: isRTL ? test.purpose_ar : test.purpose_en
        };
      }
    }
    
    // 2. Look for standalone mentions of test IDs (e.g. "GAD7", "PHQ9")
    // Only if they appear as whole words
    const words = content.split(/[\s,.;:!?\[\](){}]+/);
    for (const word of words) {
      const normalizedWord = word.toUpperCase().replace(/[-_]/g, "");
      // Special case for common variations
      const testId = Object.keys(availableTests).find(id => 
        id === normalizedWord || id === word.toUpperCase()
      );
      
      if (testId) {
        const test = availableTests[testId];
        return {
          id: testId,
          title: isRTL ? test.full_name_ar : test.full_name_en,
          description: isRTL ? test.purpose_ar : test.purpose_en
        };
      }
    }

    return null;
  };

  const handleAcceptConsent = async () => {
    await setChatConsent(true);
    setHasConsent(true);
    setIsConsentModalVisible(false);
  };

  const handleDeclineConsent = () => {
    setIsConsentModalVisible(false);
    Alert.alert(
      isRTL ? 'الموافقة مطلوبة' : 'Consent Required',
      isRTL ? 'يجب موافقتك لاستخدام ميزة المحادثة مع هادي' : 'You must agree to use the chat feature with Hadee',
      [{ text: isRTL ? 'موافق' : 'Agree', onPress: handleAcceptConsent }]
    );
  };

  const handleTestSubmit = async (answers: any[]) => {
    if (!activeSessionId || !currentTestMessageId) return;

    try {
      const chatQuestions = buildChatAssessmentQuestions(activeTest);
      const answerScores = answers.map((answer) => Number(answer.score ?? 0));
      const localResult = computeAssessmentResult(language === 'ar' ? 'ar' : 'en', activeTest, chatQuestions, answerScores, null);
      const totalScore = answerScores.reduce((sum, score) => sum + score, 0);

      // Submit via the assessments API (the real endpoint)
      await assessmentsService.submitAssessment({
        assessmentType: activeTest.test_id,
        answers: answers,
      });

      try {
        await chatService.submitTestResult(activeSessionId, {
          testId: activeTest.test_id,
          title: isRTL ? activeTest.full_name_ar : activeTest.full_name_en,
          description: isRTL ? activeTest.purpose_ar : activeTest.purpose_en,
          scoringType: activeTest.scoring_type,
          totalScore,
          result: localResult,
          answers: buildAssessmentAnswersPayload(chatQuestions, answerScores),
        });
      } catch (err) {
        console.warn('Failed to submit test result to chat history (endpoint not supported by backend):', err);
      }

      // Mark test as completed in local state
      setMessages(prev => prev.map(msg => 
        msg.id === currentTestMessageId 
          ? { ...msg, testRequest: msg.testRequest ? { ...msg.testRequest, completed: true } : undefined }
          : msg
      ));

      // Send a follow-up message to ask the backend for analysis using the submitted test context
      const completionText = isRTL
        ? `لقد أنهيت اختبار ${isRTL ? activeTest.full_name_ar : activeTest.full_name_en}. أرجو تحليل النتائج وإعطائي شرحاً واضحاً وخطوات عملية مناسبة.\n\nالنتيجة الأولية: ${localResult.level}\nمجموع النقاط: ${totalScore}`
        : `I finished the ${isRTL ? activeTest.full_name_ar : activeTest.full_name_en} assessment. Please analyze the results and give me a clear explanation with practical next steps.\n\nPreliminary result: ${localResult.level}\nTotal score: ${totalScore}`;
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: completionText,
      };
      setMessages(prev => [...prev, userMessage]);
      setIsSending(true);

      const botMessageId = (Date.now() + 1).toString();
      let currentBotContent = '';
      setMessages(prev => [...prev, { id: botMessageId, role: 'assistant', content: '' }]);

      await chatService.sendMessageStream(
        activeSessionId,
        { content: completionText },
        (token) => {
          currentBotContent += token;
          setMessages(prev =>
            prev.map(msg => msg.id === botMessageId
              ? { ...msg, content: currentBotContent.replace(/\[TEST_REQUEST:.*?\]/g, '') }
              : msg)
          );
        },
        () => {
          setIsSending(false);
          queryClient.invalidateQueries({ queryKey: ['chat', 'sessions'] });
        },
        (error) => {
          setIsSending(false);
          console.error('Assessment follow-up error:', error);
        }
      );

    } catch (error) {
      console.error("Test submission failed:", error);
      Alert.alert(isRTL ? 'خطأ' : 'Error', isRTL ? 'فشل إرسال نتائج التقييم.' : 'Failed to submit assessment results.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Top Navigation Header - Fixed */}
      <View className="bg-background border-b border-border/40 z-10">
        <AppHeader />
      </View>

      <View className="flex-1">
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 40 + (keyboardHeight > 0 ? keyboardHeight : insets.bottom),
            paddingTop: 10,
            flexGrow: 1,
          }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={true}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
             /* Chat Sub-Header - Now scrolls with content */
             <View className={cn("items-center justify-between py-3 mb-4", flexDir())}>
               <TouchableOpacity 
                 onPress={() => setHistoryModalVisible(true)}
                 className={cn("items-center gap-2 bg-secondary/80 px-4 py-2 rounded-full border border-border/50", flexDir())}
               >
                 <History size={16} color="#64748b" />
                 <Text className="text-sm font-semibold text-foreground">{t('chat.history') || "السجل"}</Text>
               </TouchableOpacity>
               
               <TouchableOpacity 
                 onPress={handleNewChat}
                 className={cn("items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20", flexDir())}
               >
                 <Text className="text-sm font-semibold text-primary">{t('chat.newChat') || "محادثة جديدة"}</Text>
                 <Plus size={16} color="#0f766e" />
               </TouchableOpacity>
             </View>
           }
           renderItem={({ item }) => {
             const isUser = item.role === 'user';
             return (
               <View className={cn("mb-8", flexDir(), isUser ? justifyContent('end') : justifyContent('start'))}>
                {!isUser && (
                  <View className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 items-center justify-center mt-1 text-primary">
                    {/* <Smile className="text-primary" size={20} /> */}
                       <Image
                                      source={require('../../assets/images/logoTrans.png')}
                                      className="h-9 w-9"
                                      resizeMode="contain"
                                    />
                  </View>
                )}

                <View className={cn("max-w-[80%]", !isUser && (isRTL ? "mr-3" : "ml-3"))}>
                  <View
                    className={cn(
                      "bg-card border border-border rounded-[24px] p-5",
                      isUser ? "bg-primary border-primary" : "bg-card",
                      isUser ? (isRTL ? "rounded-tr-[4px]" : "rounded-tl-[4px]") : (isRTL ? "rounded-tl-[4px]" : "rounded-tr-[4px]")
                    )}
                  >
                    <Text className={cn("text-[14px] leading-6 font-bold", isUser ? "text-primary-foreground" : "text-foreground", textAlign())}>
                      {item.content}
                    </Text>
                  </View>

                  {item.testRequest && (
                    <TestRequestCard
                      title={item.testRequest.title}
                      description={item.testRequest.description}
                      isCompleted={item.testRequest.completed}
                      onPress={() => {
                        setActiveTest(availableTests[item.testRequest!.id]);
                        setCurrentTestMessageId(item.id);
                        setTestModalVisible(true);
                      }}
                    />
                  )}
                </View>
              </View>
            );
          }}
        />

        <View
          className="bg-background/98 border-t border-border p-5"
          style={{ paddingBottom: Math.max(insets.bottom, 12) + keyboardHeight }}
        >
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            className="mb-4"
            contentContainerStyle={{ gap: 10, flexDirection: isRTL ? 'row-reverse' : 'row' }}
          >
            <TouchableOpacity
              onPress={() => handlePromptClick(t('chat.suggested.anxiety'))}
              className="bg-card border border-border px-4 py-2.5 rounded-full flex-row items-center justify-center"
            >
              <Text className="text-[11px] font-bold text-muted-foreground">{t('chat.suggested.anxiety')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePromptClick(t('chat.suggested.sleep'))}
              className="bg-card border border-border px-4 py-2.5 rounded-full flex-row items-center justify-center"
            >
              <Text className="text-[11px] font-bold text-muted-foreground">{t('chat.suggested.sleep')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePromptClick(t('chat.suggested.stress'))}
              className="bg-card border border-border px-4 py-2.5 rounded-full flex-row items-center justify-center"
            >
              <Text className="text-[11px] font-bold text-muted-foreground">{t('chat.suggested.stress')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePromptClick(t('chat.suggested.relax'))}
              className="bg-card border border-border px-4 py-2.5 rounded-full flex-row items-center justify-center"
            >
              <Text className="text-[11px] font-bold text-muted-foreground">{t('chat.suggested.relax')}</Text>
            </TouchableOpacity>
          </ScrollView>

          <View className={cn("items-center bg-muted rounded-full px-5 border border-border h-14", flexDir())}>
            <TextInput
              className={cn("flex-1 text-[15px] text-foreground px-4 font-semibold max-h-32", textAlign())}
              placeholder={t('chat.placeholder')}
              placeholderTextColor="#94a3b8"
              value={input}
              onChangeText={setInput}
              multiline
              textAlignVertical="center"
            />

            {input.trim() ? (
              <TouchableOpacity
                onPress={handleSend}
                disabled={isSending}
                activeOpacity={0.8}
                className="h-10 w-10 rounded-full items-center justify-center bg-primary"
              >
                {isSending ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <View style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}>
                    <Send size={18} color="#ffffff" strokeWidth={2.5} />
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleVoiceSession}
                activeOpacity={0.8}
                className="h-10 w-10 rounded-full items-center justify-center bg-primary shadow-sm shadow-primary/20"
              >
                <Mic size={18} color="#ffffff" strokeWidth={2.5} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

        {/* Chat History Modal */}
        <Modal
          visible={isHistoryModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setHistoryModalVisible(false)}
        >
          <View className="flex-1 bg-black/60 justify-end">
            <View className="bg-background h-3/4 rounded-t-[32px] p-6 shadow-xl">
              <View className={cn("items-center justify-between mb-6", flexDir())}>
                <Text className="text-xl font-bold text-foreground">{t('chat.history') || "سجل المحادثات"}</Text>
                <TouchableOpacity onPress={() => setHistoryModalVisible(false)} className="h-8 w-8 items-center justify-center rounded-full bg-secondary">
                  <X size={20} color="#64748b" />
                </TouchableOpacity>
              </View>
              
              {isLoadingSessions ? (
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator size="large" color="#0f766e" />
                </View>
              ) : (
                <FlatList
                  data={sessions}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={true}
                  contentContainerStyle={{ paddingBottom: 40 }}
                  ListEmptyComponent={
                    <View className="items-center justify-center py-10">
                      <Text className="text-muted-foreground text-center font-medium">{t('chat.noHistory') || "لا توجد محادثات سابقة"}</Text>
                    </View>
                  }
                  renderItem={({ item }) => {
                    const dateStr = item.createdAt || item.created_at;
                    const date = dateStr ? new Date(dateStr) : new Date();
                    const formattedDate = date.toLocaleDateString();
                    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const displayDate = `${formattedDate} ${formattedTime}`;
                    const msgCount = item.messageCount ?? (item as any).messagesCount ?? item.message_count ?? 0;
  
                    return (
                      <TouchableOpacity 
                        className={cn(
                          "p-4 mb-3 border border-border/40 rounded-2xl items-center justify-between", 
                          activeSessionId === item.id ? "bg-primary/10 border-primary/30" : "bg-card",
                          flexDir()
                        )}
                        onPress={() => {
                          setActiveSessionId(item.id);
                          setHistoryModalVisible(false);
                        }}
                      >
                      <View className={cn("flex-1", alignItems('start'))}>
                          <Text className={cn("text-foreground font-bold mb-1", textAlign())} numberOfLines={1}>
                            {item.title || "محادثة"}
                          </Text>
                          <Text className={cn("text-xs text-muted-foreground font-medium", textAlign())}>
                            {displayDate}
                          </Text>
                        </View>
                      {activeSessionId === item.id && (
                        <View className="h-2.5 w-2.5 rounded-full bg-primary mx-3" />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>
        </View>
      </Modal>

      {activeTest && (
        <TestModal
          visible={testModalVisible}
          testData={activeTest}
          onClose={() => setTestModalVisible(false)}
          onSubmit={handleTestSubmit}
        />
      )}

      {/* Consent Modal */}
      <Modal
        visible={isConsentModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {}}
      >
        <View className="flex-1 bg-black/60 justify-center items-center p-6">
          <View className="bg-background rounded-3xl p-6 w-full max-w-md shadow-xl">
            <Text className="text-2xl font-bold text-foreground text-center mb-6">
              {t('consent.title')}
            </Text>

            <ScrollView className="mb-6" showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="text-lg font-semibold text-foreground mb-2">
                  {t('consent.whatData')}
                </Text>
                <Text className="text-muted-foreground leading-6">
                  {t('consent.whatDataDesc')}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-lg font-semibold text-foreground mb-2">
                  {t('consent.toWhom')}
                </Text>
                <Text className="text-muted-foreground leading-6">
                  {t('consent.toWhomDesc')}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-lg font-semibold text-foreground mb-2">
                  {t('consent.why')}
                </Text>
                <Text className="text-muted-foreground leading-6">
                  {t('consent.whyDesc')}
                </Text>
              </View>

              <View className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                <Text className="text-primary font-semibold leading-6 text-center">
                  ⚠️ {t('consent.disclaimer')}
                </Text>
              </View>
            </ScrollView>

            <View className={cn("gap-3", flexDir())}>
              <TouchableOpacity
                onPress={handleDeclineConsent}
                className="flex-1 py-4 rounded-2xl border border-border"
              >
                <Text className="text-center font-semibold text-muted-foreground">
                  {t('consent.decline')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAcceptConsent}
                className="flex-1 py-4 rounded-2xl bg-primary"
              >
                <Text className="text-center font-bold text-primary-foreground">
                  {t('consent.accept')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
