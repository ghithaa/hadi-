import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Play, Pause, RotateCcw, Volume2, X } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { patterns, BreathingPhase } from '@/constants/breathing-patterns';
import Svg, { Circle } from 'react-native-svg';
import { useLogBreathingSession, useBreathingPatterns } from '@/hooks/use-breathing';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function BreathingExercisePage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: serverPatterns } = useBreathingPatterns();
  const localId = id === 'relax' ? '4-7-8' : id === 'energize' ? 'energy' : id;
  const pattern = (serverPatterns?.find(p => p.id === id) || patterns.find(p => p.id === localId) || patterns[0]);

  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [cycle, setCycle] = useState(1);
  const [timeLeft, setTimeLeft] = useState(pattern.timings.inhale / 1000);

  // Sync timeLeft when pattern changes
  useEffect(() => {
    setTimeLeft(pattern.timings.inhale / 1000);
  }, [pattern]);

  const startTimeRef = useRef<number | null>(null);
  const logBreathingSession = useLogBreathingSession();
  
  // Animation values
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Circle configuration
  const size = 280;
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let timerInterval: ReturnType<typeof setInterval> | undefined;
    let isMounted = true;

    const runPhase = (duration: number, nextPhase: () => void, isExpand: boolean) => {
      // Reset timer for this phase
      setTimeLeft(duration / 1000);
      
      // Timer countdown
      timerInterval = setInterval(() => {
        if (!isMounted || !isActive) return;
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);

      // Scale animation
      Animated.timing(scaleAnim, {
        toValue: isExpand ? 1.3 : 1,
        duration: duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();

      // Progress animation (optional visual cue)
      Animated.timing(progressAnim, {
        toValue: 1, // Full circle? Or just pulse?
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        if (!isMounted || !isActive) return;
        clearInterval(timerInterval);
        nextPhase();
      });
    };

    const runCycle = () => {
      if (!isActive || !isMounted) return;

      // 1. Inhale
      setPhase('inhale');
      runPhase(pattern.timings.inhale, () => {
        if (!isActive || !isMounted) return;

        // 2. Hold (if > 0)
        const runHold = () => {
          setPhase('hold');
          runPhase(pattern.timings.hold, () => {
            if (!isActive || !isMounted) return;
            runExhale();
          }, false); // Hold doesn't expand/contract usually, or maintains state
        };

        const runExhale = () => {
          // 3. Exhale
          setPhase('exhale');
          runPhase(pattern.timings.exhale, () => {
            if (!isActive || !isMounted) return;

            // 4. Hold Out (if > 0)
            const runHoldOut = () => {
              setPhase('hold-out');
              runPhase(pattern.timings.holdOut, () => {
                if (!isActive || !isMounted) return;
                setCycle(c => c + 1);
                runCycle();
              }, false);
            };

            if (pattern.timings.holdOut > 0) {
              runHoldOut();
            } else {
              setCycle(c => c + 1);
              runCycle();
            }
          }, false);
        };

        if (pattern.timings.hold > 0) {
          runHold();
        } else {
          runExhale();
        }
      }, true);
    };

    if (isActive) {
      runCycle();
    } else {
      // Reset state
      scaleAnim.setValue(1);
      setPhase('inhale');
      setTimeLeft(pattern.timings.inhale / 1000);
      if (timeout) clearTimeout(timeout);
      if (timerInterval) clearInterval(timerInterval);
    }

    return () => {
      isMounted = false;
      scaleAnim.stopAnimation();
      progressAnim.stopAnimation();
      if (timeout) clearTimeout(timeout);
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isActive, pattern]);

  const toggleBreathing = () => {
    if (!isActive) {
      startTimeRef.current = Date.now();
    } else if (cycle > 1) {
      // Log session when paused after at least one cycle
      const durationSeconds = Math.round((Date.now() - (startTimeRef.current ?? Date.now())) / 1000);
      logBreathingSession.mutate({
        patternId: pattern.id,
        cyclesCompleted: cycle - 1,
        durationSeconds,
      });
    }
    setIsActive(!isActive);
  };

  const reset = () => {
    if (isActive && cycle > 1) {
      const durationSeconds = Math.round((Date.now() - (startTimeRef.current ?? Date.now())) / 1000);
      logBreathingSession.mutate({
        patternId: pattern.id,
        cyclesCompleted: cycle - 1,
        durationSeconds,
      });
    }
    setIsActive(false);
    setCycle(1);
    setPhase('inhale');
    setTimeLeft(pattern.timings.inhale / 1000);
    startTimeRef.current = null;
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'استنشق';
      case 'hold': return 'احبس';
      case 'exhale': return 'أخرج';
      case 'hold-out': return 'احبس';
      default: return '';
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ backgroundColor: '#F0FDFA' }}> 
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4">
        <TouchableOpacity onPress={() => {}} className="p-2 rounded-full bg-white/80">
          <Volume2 size={24} color="#333" />
        </TouchableOpacity>
        
        <View className="items-center">
          <Text className="text-lg font-bold text-foreground">{pattern.title}</Text>
          <Text className="text-sm text-muted-foreground">الدورة {cycle} من 6</Text>
        </View>

        <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-white/80">
          <X size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 items-center justify-center">
        <View className="relative items-center justify-center" style={{ width: size, height: size }}>
          {/* Animated Background Circle */}
          <Animated.View
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: pattern.color + '20', // 20% opacity
              transform: [{ scale: scaleAnim }],
            }}
          />
          
          {/* Text Content */}
          <View className="items-center justify-center z-10">
            <Text className="text-2xl font-bold text-foreground mb-2">{getPhaseText()}</Text>
            <Text className="text-6xl font-bold text-primary" style={{ color: pattern.color }}>
              {Math.ceil(timeLeft)}
            </Text>
          </View>

           {/* SVG Progress Ring (Static for now or animated later) */}
           <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={pattern.color + '40'}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Active Progress - Simplified for this iteration */}
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={pattern.color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={phase === 'inhale' ? 0 : circumference} // Placeholder logic
              strokeLinecap="round"
            />
          </Svg>
        </View>
      </View>

      {/* Controls */}
      <View className="pb-16 items-center flex-row justify-center gap-6">
         <TouchableOpacity 
          onPress={toggleBreathing}
          className="w-16 h-16 rounded-2xl items-center justify-center shadow-lg"
          style={{ backgroundColor: pattern.color }}
        >
          {isActive ? (
            <Pause size={32} color="white" fill="white" />
          ) : (
            <Play size={32} color="white" fill="white" className="ml-1" />
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={reset}
          className="w-16 h-16 rounded-2xl bg-white items-center justify-center shadow-sm border border-gray-100"
        >
          <RotateCcw size={28} color={pattern.color} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
