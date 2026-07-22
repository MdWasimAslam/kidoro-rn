import React, { useState, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SIZES, TYPOGRAPHY, ELEVATION } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const sampleQuizzes = [
  { id: 'q1', category: 'Space', question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], answer: 1, explanation: 'Mars looks red because of iron oxide (rust) on its surface!', icon: 'rocket' },
  { id: 'q2', category: 'Animals', question: 'What is the largest land animal on Earth?', options: ['Giraffe', 'Hippopotamus', 'African Elephant', 'Rhinoceros'], answer: 2, explanation: 'The African Elephant can weigh up to 6,000 kg!', icon: 'paw' },
  { id: 'q3', category: 'Math', question: 'What is 8 + 7?', options: ['13', '14', '15', '16'], answer: 2, explanation: '8 + 7 = 15! Great math skills!', icon: 'calculator' },
  { id: 'q4', category: 'Science', question: 'What do plants need to make their food?', options: ['Sunlight & Water', 'Milk & Sugar', 'Pizza & Juice', 'Sand & Rocks'], answer: 0, explanation: 'Plants use sunlight, water, and air in a process called Photosynthesis!', icon: 'flask' },
];

const GamesScreen = React.memo(function GamesScreen() {
  const insets = useSafeAreaInsets();
  const { colors, statusBarStyle } = useTheme();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(120);
  const [streakG, setStreakG] = useState(3);
  const [answered, setAnswered] = useState(false);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const currentQuiz = sampleQuizzes[currentIdx];
  const quizColor = [colors.purple, colors.blue, colors.green, colors.secondaryDark][currentIdx % 4];

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { padding: SIZES.md, paddingBottom: 100 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.md },
    headerTitle: { color: colors.text, ...TYPOGRAPHY.h2 },
    headerSubtitle: { color: colors.textSecondary, ...TYPOGRAPHY.caption, marginTop: 2 },
    statBadge: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
      paddingHorizontal: SIZES.md, paddingVertical: SIZES.xs, borderRadius: SIZES.radius, gap: 4, ...ELEVATION.level1,
    },
    statText: { color: colors.text, ...TYPOGRAPHY.bodyBold },
    streakCard: { backgroundColor: colors.primaryAlpha10, borderRadius: SIZES.radiusSm, padding: SIZES.md, marginBottom: SIZES.md, borderWidth: 1, borderColor: colors.primary + '20' },
    streakRow: { flexDirection: 'row', alignItems: 'center', gap: SIZES.xs },
    streakTitle: { color: colors.primary, ...TYPOGRAPHY.h4 },
    streakSub: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
    quizCard: { backgroundColor: colors.card, borderRadius: SIZES.radius, padding: SIZES.md, ...ELEVATION.level2 },
    categoryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.sm },
    iconContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: SIZES.xs },
    categoryName: { ...TYPOGRAPHY.bodyBold, flex: 1 },
    questionNum: { color: colors.textSecondary, ...TYPOGRAPHY.label },
    questionText: { color: colors.text, ...TYPOGRAPHY.h3, lineHeight: 24, marginBottom: SIZES.md },
    optionsList: { gap: SIZES.sm },
    optionBtn: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      padding: SIZES.md, borderRadius: SIZES.radiusSm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    },
    optionText: { color: colors.text, ...TYPOGRAPHY.bodyBold },
    correctOpt: { backgroundColor: colors.success + '20', borderColor: colors.success },
    correctOptText: { color: '#2E7D32' },
    wrongOpt: { backgroundColor: colors.error + '20', borderColor: colors.error },
    wrongOptText: { color: '#C62828' },
    explanationBox: { marginTop: SIZES.md, paddingTop: SIZES.md, borderTopWidth: 1, borderTopColor: colors.border },
    explanationText: { color: colors.textSecondary, ...TYPOGRAPHY.body, lineHeight: 20, marginBottom: SIZES.md },
    nextBtn: { backgroundColor: colors.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: SIZES.md, borderRadius: SIZES.radiusSm, gap: SIZES.xs },
    nextBtnText: { color: '#FFF', ...TYPOGRAPHY.bodyBold },
  }), [colors]);

  const handleSelect = (idx) => {
    if (answered) return;
    setSelectedOpt(idx);
    setAnswered(true);
    if (idx === currentQuiz.answer) {
      setScore(prev => prev + 50);
      setStreakG(prev => prev + 1);
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
        Animated.spring(bounceAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
      ]).start();
    } else { setStreakG(0); }
  };

  const handleNext = () => {
    setSelectedOpt(null); setAnswered(false);
    setCurrentIdx((prev) => (prev + 1) % sampleQuizzes.length);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={colors.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Kids Learning Games</Text>
            <Text style={styles.headerSubtitle}>Play quizzes & earn badges!</Text>
          </View>
          <View style={styles.statBadge}>
            <MaterialCommunityIcons name="lightning-bolt" size={20} color={colors.secondary} />
            <Text style={styles.statText}>{score} XP</Text>
          </View>
        </View>

        <View style={styles.streakCard}>
          <View style={styles.streakRow}>
            <MaterialCommunityIcons name="fire" size={26} color={colors.primary} />
            <Text style={styles.streakTitle}>{streakG} Day Streak!</Text>
          </View>
          <Text style={styles.streakSub}>Keep learning daily to level up your badges!</Text>
        </View>

        <Animated.View style={[styles.quizCard, { transform: [{ scale: bounceAnim }] }]}>
          <View style={styles.categoryHeader}>
            <View style={[styles.iconContainer, { backgroundColor: quizColor + '20' }]}>
              <MaterialCommunityIcons name={currentQuiz.icon} size={22} color={quizColor} />
            </View>
            <Text style={[styles.categoryName, { color: quizColor }]}>{currentQuiz.category} Challenge</Text>
            <Text style={styles.questionNum}>Q{currentIdx + 1}/{sampleQuizzes.length}</Text>
          </View>
          <Text style={styles.questionText}>{currentQuiz.question}</Text>
          <View style={styles.optionsList}>
            {currentQuiz.options.map((opt, i) => {
              let btnStyle = styles.optionBtn;
              let txtStyle = styles.optionText;
              if (answered) {
                if (i === currentQuiz.answer) { btnStyle = [styles.optionBtn, styles.correctOpt]; txtStyle = [styles.optionText, styles.correctOptText]; }
                else if (i === selectedOpt) { btnStyle = [styles.optionBtn, styles.wrongOpt]; txtStyle = [styles.optionText, styles.wrongOptText]; }
              }
              return (
                <TouchableOpacity key={i} style={btnStyle} activeOpacity={0.8} onPress={() => handleSelect(i)}>
                  <Text style={txtStyle}>{opt}</Text>
                  {answered && i === currentQuiz.answer && <MaterialCommunityIcons name="check-circle" size={20} color={colors.success} />}
                  {answered && i === selectedOpt && i !== currentQuiz.answer && <MaterialCommunityIcons name="close-circle" size={20} color={colors.error} />}
                </TouchableOpacity>
              );
            })}
          </View>
          {answered && (
            <View style={styles.explanationBox}>
              <Text style={styles.explanationText}>💡 {currentQuiz.explanation}</Text>
              <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                <Text style={styles.nextBtnText}>Next Question</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
});

export default GamesScreen;
