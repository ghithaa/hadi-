import { DEMO_REFRESH_TOKEN, getAccessToken, getRefreshToken, setTokens, clearTokens, getItem, setItem } from './token-storage';

const PROD_API_URL = 'https://hadee.sa/apis/api/v1';
const BASE_URL = (__DEV__
  ? (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1')
  : (process.env.EXPO_PUBLIC_API_URL || PROD_API_URL)
).replace(/\/$/, '');

// Helper to ensure endpoint has leading slash
const normalizeEndpoint = (endpoint: string) => endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

const mockUser = {
  id: "6ebef00d-0c15-4e8a-bc2a-a6bc6b195dcb",
  email: "test@test.com",
  fullName: "Demo User",
  full_name: "Demo User",
  phone: null,
  avatarUrl: null,
  avatar_url: null,
  dateOfBirth: null,
  date_of_birth: null,
  gender: null,
  authProvider: "local",
  auth_provider: "local",
  role: {
    id: "42ba5740-5c27-4d7c-adcf-7aab96dd0190",
    name: "user",
    permissions: {},
    created_at: "2026-04-09T11:05:45.829Z",
    createdAt: "2026-04-09T11:05:45.829Z"
  },
  is_active: true,
  isActive: true,
  isVerified: true,
  is_verified: true,
  last_login_at: "2026-05-18T16:18:13.357Z",
  lastLoginAt: "2026-05-18T16:18:13.357Z",
  created_at: "2026-04-10T20:13:21.681Z",
  createdAt: "2026-04-10T20:13:21.681Z",
  updated_at: "2026-05-18T16:18:13.364Z",
  updatedAt: "2026-05-18T16:18:13.364Z"
};

async function getMockMoods(): Promise<any[]> {
  const data = await getItem('hadi_mock_moods');
  return data ? JSON.parse(data) : [];
}

async function saveMockMoods(moods: any[]) {
  await setItem('hadi_mock_moods', JSON.stringify(moods));
}

async function getMockGratitude(): Promise<any[]> {
  const data = await getItem('hadi_mock_gratitude');
  return data ? JSON.parse(data) : [
    {
      id: "mock-gratitude-1",
      items: ["الصحة والعافية", "قضاء وقت مع العائلة", "فنجان قهوة دافئ في الصباح"],
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    }
  ];
}

async function saveMockGratitude(entries: any[]) {
  await setItem('hadi_mock_gratitude', JSON.stringify(entries));
}

async function getMockSleep(): Promise<any[]> {
  const data = await getItem('hadi_mock_sleep');
  return data ? JSON.parse(data) : [];
}

async function saveMockSleep(entries: any[]) {
  await setItem('hadi_mock_sleep', JSON.stringify(entries));
}

async function getMockBreathing(): Promise<any[]> {
  const data = await getItem('hadi_mock_breathing');
  return data ? JSON.parse(data) : [];
}

async function saveMockBreathing(sessions: any[]) {
  await setItem('hadi_mock_breathing', JSON.stringify(sessions));
}

async function getMockAssessments(): Promise<any[]> {
  const data = await getItem('hadi_mock_assessments');
  return data ? JSON.parse(data) : [];
}

async function saveMockAssessments(assessments: any[]) {
  await setItem('hadi_mock_assessments', JSON.stringify(assessments));
}

async function getMockDrawings(): Promise<any[]> {
  const data = await getItem('hadi_mock_drawings');
  return data ? JSON.parse(data) : [];
}

async function saveMockDrawings(drawings: any[]) {
  await setItem('hadi_mock_drawings', JSON.stringify(drawings));
}

async function getMockPlans(): Promise<any[]> {
  const data = await getItem('hadi_mock_plans');
  return data ? JSON.parse(data) : [];
}

async function saveMockPlans(plans: any[]) {
  await setItem('hadi_mock_plans', JSON.stringify(plans));
}

async function getMockChatSessions(): Promise<any[]> {
  const data = await getItem('hadi_mock_chat_sessions');
  return data ? JSON.parse(data) : [];
}

async function saveMockChatSessions(sessions: any[]) {
  await setItem('hadi_mock_chat_sessions', JSON.stringify(sessions));
}

async function getMockChatMessages(sessionId: string): Promise<any[]> {
  const data = await getItem(`hadi_mock_chat_messages_${sessionId}`);
  return data ? JSON.parse(data) : [];
}

function shouldAllowDemoFallback(endpoint: string) {
  const cleanEndpoint = endpoint.split('?')[0].replace(/\/$/, '');
  
  // Exclude auth endpoints other than login
  if (cleanEndpoint.startsWith('/auth') && cleanEndpoint !== '/auth/login') {
    return false;
  }
  
  return true;
}

async function getMockDataForEndpoint(endpoint: string, method: string, body: any): Promise<any> {
  const cleanEndpoint = endpoint.split('?')[0].replace(/\/$/, '');
  
  if (cleanEndpoint === '/auth/login') {
    return {
      accessToken: "mock-demo-jwt-token",
      refreshToken: "mock-demo-refresh-jwt-token",
      user: mockUser
    };
  }

  if (cleanEndpoint === '/users/me') {
    if (method === 'PATCH') {
      const persistedStr = await getItem('hadi_user_data');
      const persisted = persistedStr ? JSON.parse(persistedStr) : mockUser;
      const updated = {
        ...persisted,
        ...body,
        fullName: body.fullName !== undefined ? body.fullName : (persisted.fullName || persisted.full_name),
        full_name: body.fullName !== undefined ? body.fullName : (persisted.full_name || persisted.fullName),
        dateOfBirth: body.dateOfBirth !== undefined ? body.dateOfBirth : (persisted.dateOfBirth || persisted.date_of_birth),
        date_of_birth: body.dateOfBirth !== undefined ? body.dateOfBirth : (persisted.date_of_birth || persisted.dateOfBirth),
        phone: body.phone !== undefined ? body.phone : persisted.phone,
        gender: body.gender !== undefined ? body.gender : persisted.gender,
        updatedAt: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await setItem('hadi_user_data', JSON.stringify(updated));
      return updated;
    }
    if (method === 'DELETE') {
      await clearTokens();
      return {};
    }
    const persistedStr = await getItem('hadi_user_data');
    return persistedStr ? JSON.parse(persistedStr) : mockUser;
  }

  if (cleanEndpoint === '/auth/change-password') {
    return {};
  }

  if (cleanEndpoint === '/auth/refresh') {
    return {
      accessToken: "mock-demo-jwt-token",
      refreshToken: "mock-demo-refresh-jwt-token"
    };
  }
  if (cleanEndpoint === '/notifications/unread-count') {
    return { unreadCount: 0 };
  }

  if (cleanEndpoint === '/notifications') {
    return [];
  }

  if (cleanEndpoint === '/notifications/read-all') {
    return {};
  }

  if (cleanEndpoint === '/assessments/types') {
    return [
      { id: "burnout", name: "مقياس الاحتراق الوظيفي" },
      { id: "gad7", name: "اختبار القلق (GAD-7)" },
      { id: "phq9", name: "اختبار الاكتئاب (PHQ-9)" },
      { id: "self_esteem", name: "مقياس تقدير الذات" },
      { id: "social_anxiety", name: "القلق الاجتماعي" }
    ];
  }



  if (cleanEndpoint === '/chat/sessions') {
    if (method === 'POST') {
      const newSession = {
        id: `mock-session-${Date.now()}`,
        title: body?.title || "جلسة الدعم",
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString(),
        messages: []
      };
      const sessions = await getMockChatSessions();
      sessions.unshift(newSession);
      await saveMockChatSessions(sessions);
      return newSession;
    }
    return await getMockChatSessions();
  }

  if (cleanEndpoint.startsWith('/chat/sessions/') && method === 'DELETE') {
    const parts = cleanEndpoint.split('/');
    const sessionId = parts[parts.length - 1];
    const sessions = await getMockChatSessions();
    const filtered = sessions.filter(s => s.id !== sessionId);
    await saveMockChatSessions(filtered);
    await setItem(`hadi_mock_chat_messages_${sessionId}`, JSON.stringify([]));
    return {};
  }

  if (cleanEndpoint.startsWith('/chat/sessions/') && cleanEndpoint.endsWith('/messages') && method === 'GET') {
    const parts = cleanEndpoint.split('/');
    const sessionId = parts[parts.length - 2];
    return await getMockChatMessages(sessionId);
  }

  if (cleanEndpoint.includes('/chat/sessions/') && (cleanEndpoint.endsWith('/test-results') || cleanEndpoint.endsWith('/test-result'))) {
    return {};
  }

  // --- Mock Database Endpoints ---

  // Mood Endpoints
  if (cleanEndpoint === '/mood/today') {
    const todayStr = new Date().toISOString().split('T')[0];
    const moods = await getMockMoods();
    const entry = moods.find((m: any) => m.date === todayStr);
    return {
      logged: !!entry,
      entry: entry || undefined
    };
  }

  if (cleanEndpoint === '/mood/stats') {
    const moods = await getMockMoods();
    const totalEntries = moods.length;
    const averageMood = totalEntries > 0 
      ? Math.round((moods.reduce((sum: number, m: any) => sum + m.moodScore, 0) / totalEntries) * 10) / 10 
      : 3;
    
    let streak = 0;
    if (totalEntries > 0) {
      const sortedMoods = [...moods].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const uniqueDates = Array.from(new Set(sortedMoods.map((m: any) => m.date)));
      
      const todayStr = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (uniqueDates[0] === todayStr || uniqueDates[0] === yesterdayStr) {
        streak = 1;
        let checkDate = new Date(uniqueDates[0]);
        while (true) {
          checkDate.setDate(checkDate.getDate() - 1);
          const prevDateStr = checkDate.toISOString().split('T')[0];
          if (uniqueDates.includes(prevDateStr)) {
            streak++;
          } else {
            break;
          }
        }
      }
    }
    return {
      averageMood,
      streak,
      totalEntries
    };
  }

  if (cleanEndpoint === '/mood/chart') {
    const moods = await getMockMoods();
    const points = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const entry = moods.find((m: any) => m.date === dateStr);
      points.push({
        date: dateStr,
        score: entry ? entry.moodScore : 0
      });
    }
    return points;
  }

  if (cleanEndpoint === '/mood') {
    if (method === 'POST') {
      const newEntry = {
        id: `mock-mood-${Date.now()}`,
        moodScore: body?.moodScore ?? 3,
        note: body?.note,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };
      const moods = await getMockMoods();
      const filteredMoods = moods.filter((m: any) => m.date !== newEntry.date);
      filteredMoods.unshift(newEntry);
      await saveMockMoods(filteredMoods);
      return newEntry;
    }
    return await getMockMoods();
  }

  // Gratitude Endpoints
  if (cleanEndpoint === '/gratitude/today') {
    const todayStr = new Date().toISOString().split('T')[0];
    const entries = await getMockGratitude();
    const entry = entries.find((e: any) => e.date === todayStr);
    return {
      logged: !!entry,
      entry: entry || undefined
    };
  }

  if (cleanEndpoint === '/gratitude/stats') {
    const entries = await getMockGratitude();
    const totalEntries = entries.length;
    const totalItems = entries.reduce((sum: number, e: any) => sum + (e.items?.length ?? 0), 0);
    return {
      totalEntries,
      streak: totalEntries > 0 ? 1 : 0,
      totalItems
    };
  }

  if (cleanEndpoint === '/gratitude') {
    if (method === 'POST') {
      const todayStr = new Date().toISOString().split('T')[0];
      const entries = await getMockGratitude();
      let existingEntry = entries.find((e: any) => e.date === todayStr);
      
      if (existingEntry) {
        existingEntry.items = [...(existingEntry.items || []), ...(body?.items || [])];
      } else {
        existingEntry = {
          id: `mock-gratitude-${Date.now()}`,
          items: body?.items || [],
          date: todayStr,
          createdAt: new Date().toISOString()
        };
        entries.unshift(existingEntry);
      }
      await saveMockGratitude(entries);
      return existingEntry;
    }
    return await getMockGratitude();
  }

  // Sleep Endpoints
  if (cleanEndpoint === '/sleep/today') {
    const todayStr = new Date().toISOString().split('T')[0];
    const entries = await getMockSleep();
    const entry = entries.find((e: any) => e.date === todayStr);
    return {
      logged: !!entry,
      entry: entry || undefined
    };
  }

  if (cleanEndpoint === '/sleep/stats') {
    const entries = await getMockSleep();
    const totalEntries = entries.length;
    const averageHours = totalEntries > 0
      ? entries.reduce((sum: number, e: any) => sum + e.hours, 0) / totalEntries
      : 8;
    const averageQuality = totalEntries > 0
      ? entries.reduce((sum: number, e: any) => sum + e.quality, 0) / totalEntries
      : 4;
    return {
      averageHours,
      averageQuality,
      streak: totalEntries > 0 ? 1 : 0,
      totalEntries
    };
  }

  if (cleanEndpoint === '/sleep/chart') {
    const entries = await getMockSleep();
    const points = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const entry = entries.find((e: any) => e.date === dateStr);
      points.push({
        date: dateStr,
        hours: entry ? entry.hours : 0
      });
    }
    return points;
  }

  if (cleanEndpoint === '/sleep') {
    if (method === 'POST') {
      const newEntry = {
        id: `mock-sleep-${Date.now()}`,
        hours: body?.hours ?? 8,
        quality: body?.quality ?? 4,
        note: body?.note,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };
      const entries = await getMockSleep();
      const filteredEntries = entries.filter((e: any) => e.date !== newEntry.date);
      filteredEntries.unshift(newEntry);
      await saveMockSleep(filteredEntries);
      return newEntry;
    }
    return await getMockSleep();
  }

  // Breathing Endpoints
  if (cleanEndpoint === '/breathing/patterns') {
    return [
      {
        id: 'box',
        title: 'تنفس الصندوق',
        subtitle: 'Box Breathing',
        description: 'تقنية فعالة للتهدئة السريعة',
        color: '#A855F7',
        timings: { inhale: 4000, hold: 4000, exhale: 4000, holdOut: 4000 },
        instructions: 'استنشق 4ث • احبس 4ث • أخرج 4ث • احبس 4ث',
      },
      {
        id: '4-7-8',
        title: 'تنفس 8-7-4',
        subtitle: 'Breathing 4-7-8',
        description: 'مثالي للنوم والاسترخاء العميق',
        color: '#EC4899',
        timings: { inhale: 4000, hold: 7000, exhale: 8000, holdOut: 0 },
        instructions: 'استنشق 4ث • احبس 7ث • أخرج 8ث',
      },
      {
        id: 'calm',
        title: 'تنفس الهدوء',
        subtitle: 'Calming Breath',
        description: 'بسيط وفعال للتوتر اليومي',
        color: '#14B8A6',
        timings: { inhale: 5000, hold: 0, exhale: 5000, holdOut: 0 },
        instructions: 'استنشق 5ث • أخرج 5ث',
      },
      {
        id: 'energy',
        title: 'تنفس الطاقة',
        subtitle: 'Energizing Breath',
        description: 'لتنشيط الجسم والعقل',
        color: '#F97316',
        timings: { inhale: 2000, hold: 0, exhale: 2000, holdOut: 0 },
        instructions: 'استنشق 2ث • أخرج 2ث',
      },
    ];
  }

  if (cleanEndpoint === '/breathing/stats') {
    const sessions = await getMockBreathing();
    const totalSessions = sessions.length;
    const totalMinutes = Math.round(sessions.reduce((sum: number, s: any) => sum + s.duration_seconds, 0) / 60);
    return {
      totalSessions,
      totalMinutes,
      favoritePattern: "4-7-8"
    };
  }

  if (cleanEndpoint === '/breathing/sessions' && method === 'POST') {
    const newSession = {
      id: `mock-breath-${Date.now()}`,
      pattern_id: body?.patternId || "box",
      cycles_completed: body?.cyclesCompleted || 4,
      duration_seconds: body?.durationSeconds || 120,
      created_at: new Date().toISOString()
    };
    const sessions = await getMockBreathing();
    sessions.unshift(newSession);
    await saveMockBreathing(sessions);
    return newSession;
  }

  // Assessment Endpoints
  if (cleanEndpoint === '/assessments/history') {
    return await getMockAssessments();
  }

  if (cleanEndpoint === '/assessments/submit' && method === 'POST') {
    const newResult = {
      id: `mock-ass-${Date.now()}`,
      assessment_id: body?.assessmentId || "gad7",
      score: body?.score ?? 10,
      level: "قلق خفيف",
      advice: "تمارين التنفس قد تساعدك.",
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    const assessments = await getMockAssessments();
    assessments.unshift(newResult);
    await saveMockAssessments(assessments);
    return newResult;
  }

  // Reports / Insights Endpoints
  if (cleanEndpoint === '/reports/overview') {
    const moods = await getMockMoods();
    const sleep = await getMockSleep();
    const gratitude = await getMockGratitude();
    const breathing = await getMockBreathing();
    
    // Calculate mood average
    const moodCount = moods.length;
    const moodAverage = moodCount > 0 
      ? moods.reduce((sum: number, m: any) => sum + m.moodScore, 0) / moodCount 
      : 0;

    // Calculate sleep average
    const sleepCount = sleep.length;
    const sleepAverage = sleepCount > 0
      ? sleep.reduce((sum: number, s: any) => sum + s.hours, 0) / sleepCount
      : 0;

    // Calculate gratitude streak
    let gratitudeStreak = 0;
    if (gratitude.length > 0) {
      const sorted = [...gratitude].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const uniqueDates = Array.from(new Set(sorted.map((g: any) => g.date)));
      const todayStr = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (uniqueDates[0] === todayStr || uniqueDates[0] === yesterdayStr) {
        gratitudeStreak = 1;
        let checkDate = new Date(uniqueDates[0]);
        while (true) {
          checkDate.setDate(checkDate.getDate() - 1);
          const prevStr = checkDate.toISOString().split('T')[0];
          if (uniqueDates.includes(prevStr)) {
            gratitudeStreak++;
          } else {
            break;
          }
        }
      }
    }

    // Calculate breathing sessions this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const breathingSessionsThisWeek = breathing.filter((b: any) => new Date(b.created_at).getTime() >= oneWeekAgo.getTime()).length;

    return {
      moodAverage,
      sleepAverage,
      gratitudeStreak,
      breathingSessionsThisWeek,
      lastAssessment: undefined,
      activePlan: undefined
    };
  }

  if (cleanEndpoint === '/reports/mood-trends') {
    const moods = await getMockMoods();
    const trends = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const entry = moods.find((m: any) => m.date === dateStr);
      trends.push({
        date: dateStr,
        score: entry ? entry.moodScore : 0
      });
    }
    return trends;
  }

  // Drawing Endpoints
  if (cleanEndpoint === '/drawing/history') {
    return await getMockDrawings();
  }

  if (cleanEndpoint === '/drawing/analyze' && method === 'POST') {
    const childName = (body && typeof body.get === 'function') ? body.get('childName') : body?.childName;
    const childAge = (body && typeof body.get === 'function') ? body.get('childAge') : body?.childAge;
    const file = (body && typeof body.get === 'function') ? body.get('file') : body?.file;
    const fileUri = (file && typeof file === 'object' && 'uri' in file) ? (file as any).uri : 'https://picsum.photos/300/300';
    
    const newDrawing = {
      id: `mock-draw-${Date.now()}`,
      status: 'completed',
      childName: childName || "الطفل",
      childAge: childAge || "7",
      image_url: fileUri,
      analysis: {
        emotionalTone: "الرسمة تعكس مشاعر إيجابية واستقراراً عاطفياً. استخدام الألوان الدافئة مثل البرتقالي والأخضر يدل على الفضول وحب الاستكشاف والتواصل الاجتماعي الجيد مع البيئة المحيطة.",
        observations: [
          "استخدام ألوان دافئة ومتوازنة يعكس الحيوية والنشاط.",
          "الخطوط واضحة ومستقرة مما يدل على الثقة بالنفس.",
          "توزيع العناصر في وسط الصفحة يشير إلى التوازن العاطفي."
        ]
      },
      createdAt: new Date().toISOString()
    };
    const drawings = await getMockDrawings();
    drawings.unshift(newDrawing);
    await saveMockDrawings(drawings);
    return newDrawing;
  }

  if (cleanEndpoint.startsWith('/drawing/') && !cleanEndpoint.endsWith('/history') && !cleanEndpoint.endsWith('/analyze')) {
    const parts = cleanEndpoint.split('/');
    const id = parts[parts.length - 1];
    const drawings = await getMockDrawings();
    const drawing = drawings.find((d: any) => d.id === id);
    return drawing || { id, status: 'failed' };
  }

  if (cleanEndpoint === '/plans/active') {
    const plans = await getMockPlans();
    const active = plans.find((p: any) => p.is_active || p.isActive);
    return active || null;
  }

  if (cleanEndpoint === '/plans' && method === 'GET') {
    return await getMockPlans();
  }

  if (cleanEndpoint === '/plans/generate' && method === 'POST') {
    const stress = body?.questionnaireData?.stress || 'medium';
    const goal = body?.questionnaireData?.goals || 'anxiety';
    
    let title = 'خطة توازن الحياة وتقليل التوتر';
    let desc = 'خطة مخصصة مدتها ١٤ يوماً تهدف لتقليل مستويات التوتر وبناء عادات استرخاء صحية.';
    let tasks = [
      {
        id: `mock-task-1-${Date.now()}`,
        title: 'تنفس هادئ لمدة ٥ دقائق',
        description: 'خذ شهيقاً وزفيراً بعمق في الصباح الباكر متبعاً نمط تنفس ٤-٧-٨.',
        is_completed: false,
        frequency: 'يومي صباحاً'
      },
      {
        id: `mock-task-2-${Date.now()}`,
        title: 'كتابة ٣ أشياء ممتن لها',
        description: 'افتح دفتر الامتنان وسجل ثلاثة أمور إيجابية حدثت في يومك.',
        is_completed: false,
        frequency: 'يومي مساءً'
      },
      {
        id: `mock-task-3-${Date.now()}`,
        title: 'المشي لمدة ٢٠ دقيقة',
        description: 'ممارسة المشي الخفيف في الهواء الطلق لتجديد الطاقة الجسدية والنفسية.',
        is_completed: false,
        frequency: 'يومي'
      }
    ];

    if (goal === 'depression') {
      title = 'خطة تعزيز المزاج والأنشطة الإيجابية';
      desc = 'خطة ذكية تهدف لتنشيط السلوك الإيجابي ومحاربة مشاعر الخمول والاكتئاب.';
      tasks = [
        {
          id: `mock-task-1-${Date.now()}`,
          title: 'تسجيل حالتك المزاجية',
          description: 'تتبع مشاعرك ثلاث مرات اليوم في سجل تتبع المزاج.',
          is_completed: false,
          frequency: '٣ مرات يومياً'
        },
        {
          id: `mock-task-2-${Date.now()}`,
          title: 'التواصل مع صديق أو مقرب',
          description: 'اتصل أو أرسل رسالة لشخص ترتاح للتحدث معه لمشاركة لحظة إيجابية.',
          is_completed: false,
          frequency: 'مرة يومياً'
        },
        {
          id: `mock-task-3-${Date.now()}`,
          title: 'ممارسة تمارين امتداد العضلات ( Stretching )',
          description: 'تمارين تمدد خفيفة لمدة ١٠ دقائق لتنشيط دورتك الدموية.',
          is_completed: false,
          frequency: 'يومي صباحاً'
        }
      ];
    } else if (goal === 'confidence') {
      title = 'خطة بناء الثقة بالنفس والحديث الإيجابي';
      desc = 'تركز هذه الخطة على تغيير الحديث الداخلي السلبي وبناء صورة ذاتية قوية.';
      tasks = [
        {
          id: `mock-task-1-${Date.now()}`,
          title: 'جلسة توكيدات إيجابية مع هادي',
          description: 'تحدث مع هادي عن نقاط قوتك وراجع الإنجازات اليومية.',
          is_completed: false,
          frequency: 'مرة يومياً'
        },
        {
          id: `mock-task-2-${Date.now()}`,
          title: 'تسجيل تحدي الأفكار في CBT',
          description: 'قم بتسجيل فكرة سلبية واحدة وتفنيدها باستخدام تمارين العلاج المعرفي السلوكي.',
          is_completed: false,
          frequency: 'عند الحاجة'
        }
      ];
    }

    const newPlan = {
      id: `mock-plan-${Date.now()}`,
      title,
      description: desc,
      is_active: true,
      tasks,
      created_at: new Date().toISOString()
    };

    const plans = await getMockPlans();
    plans.forEach((p: any) => {
      p.is_active = false;
      p.isActive = false;
    });
    plans.unshift(newPlan);
    await saveMockPlans(plans);
    return newPlan;
  }

  if (cleanEndpoint.startsWith('/plans/tasks/') && cleanEndpoint.endsWith('/toggle') && method === 'PUT') {
    const parts = cleanEndpoint.split('/');
    const taskId = parts[parts.length - 2];
    const isCompleted = body?.is_completed ?? true;

    const plans = await getMockPlans();
    let taskFound = false;

    for (const plan of plans) {
      const task = plan.tasks?.find((t: any) => t.id === taskId);
      if (task) {
        task.is_completed = isCompleted;
        task.isCompleted = isCompleted;
        taskFound = true;
        break;
      }
    }

    if (taskFound) {
      await saveMockPlans(plans);
      return {
        id: taskId,
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null
      };
    }
    return { error: 'Task not found' };
  }

  if (
    cleanEndpoint.includes('/history') || 
    cleanEndpoint.includes('/sessions') || 
    cleanEndpoint.includes('/entries') || 
    cleanEndpoint.includes('/logs') || 
    cleanEndpoint.includes('/exercises') || 
    cleanEndpoint.includes('/patterns') ||
    cleanEndpoint === '/emotions' ||
    cleanEndpoint.startsWith('/cbt/') ||
    cleanEndpoint.startsWith('/emergency/') ||
    cleanEndpoint.startsWith('/reports/')
  ) {
    if (method === 'POST') {
      return {};
    }
    return [];
  }

  return {};
}

export class ApiClientError extends Error {
  statusCode: number;
  errorBody: any;

  constructor(statusCode: number, message: string, errorBody?: any) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.errorBody = errorBody;
  }
}

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

function processQueue(error: any, token: string | null = null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  refreshQueue = [];
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    throw new ApiClientError(401, 'No refresh token available');
  }

  if (refreshToken === DEMO_REFRESH_TOKEN) {
    throw new ApiClientError(401, 'Demo session is no longer supported. Please sign in again.');
  }

  const response = await fetch(`${BASE_URL}${normalizeEndpoint('/auth/refresh')}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${refreshToken}`,
    },
  });

  if (!response.ok) {
    await clearTokens();
    throw new ApiClientError(401, 'Token refresh failed');
  }

  const json = await response.json();
  const data = json.data || json;
  await setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  isMultipart?: boolean;
  skipAuth?: boolean;
  rawResponse?: boolean;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    params,
    isMultipart = false,
    skipAuth = false,
    rawResponse = false,
  } = options;

  const isDemoSession = getAccessToken() === 'mock-demo-jwt-token';
  if (isDemoSession && shouldAllowDemoFallback(endpoint)) {
    return (await getMockDataForEndpoint(endpoint, method, body)) as T;
  }

  let url = `${BASE_URL}${normalizeEndpoint(endpoint)}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const requestHeaders: Record<string, string> = { ...headers };

  if (!skipAuth) {
    const token = isRefreshing
      ? await new Promise<string>((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
      : getAccessToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  if (!isMultipart) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    fetchOptions.body = isMultipart ? body : JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (fetchError: any) {
    const isDemoEmail = endpoint === '/auth/login' && body && typeof body === 'object' && body.email && (body.email.includes('test') || body.email.includes('apple'));
    const isDemoSession = getAccessToken() === 'mock-demo-jwt-token';
    
    if ((isDemoEmail || isDemoSession) && shouldAllowDemoFallback(endpoint)) {
      return (await getMockDataForEndpoint(endpoint, method, body)) as T;
    }
    throw fetchError;
  }

  // Handle 401 - attempt token refresh
  if (response.status === 401 && !skipAuth) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        processQueue(null, newToken);

        // Retry the original request with new token
        requestHeaders['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, { ...fetchOptions, headers: requestHeaders });
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);
        throw refreshError;
      }
    } else {
      const newToken = await new Promise<string>((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      });
      requestHeaders['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, { ...fetchOptions, headers: requestHeaders });
    }
  }

  if (rawResponse) {
    return response as any;
  }

  if (!response.ok) {
    const isDemoEmail = endpoint === '/auth/login' && body && typeof body === 'object' && body.email && (body.email.includes('test') || body.email.includes('apple'));
    const isDemoSession = getAccessToken() === 'mock-demo-jwt-token';
    
    if ((isDemoEmail || isDemoSession) && shouldAllowDemoFallback(endpoint)) {
      return (await getMockDataForEndpoint(endpoint, method, body)) as T;
    }

    let errorBody;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = null;
    }
    throw new ApiClientError(
      response.status,
      errorBody?.message || `Request failed with status ${response.status}`,
      errorBody
    );
  }

  if (response.status === 204) {
    return undefined as any;
  }

  const json = await response.json();

  // Unwrap { success: true, data: T } wrapper
  if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
    return json.data;
  }

  return json;
}

export const apiClient = {
  get<T>(endpoint: string, params?: Record<string, any>, options?: Omit<RequestOptions, 'method' | 'params'>) {
    return request<T>(endpoint, { ...options, method: 'GET', params });
  },

  post<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return request<T>(endpoint, { ...options, method: 'POST', body });
  },

  put<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return request<T>(endpoint, { ...options, method: 'PUT', body });
  },

  patch<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return request<T>(endpoint, { ...options, method: 'PATCH', body });
  },

  delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  },

  /** Returns the raw Response for SSE streaming */
  stream(endpoint: string, body?: any): Promise<Response> {
    return request<Response>(endpoint, {
      method: 'POST',
      body,
      rawResponse: true,
    });
  },
};
