import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView, Image, Modal, FlatList } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState, useEffect, useCallback } from 'react';
import { RootStackParamList, Book, QuizStatus, PublicUser } from '../types';
import { bookService, quizService, friendService, challengeService } from '../services';
import { POINTS_PER_CORRECT } from '../utils/scoring';
import DifficultyBadge from '../components/DifficultyBadge';
import { Colors, coverColor } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

type RouteProps = NativeStackScreenProps<RootStackParamList, 'BookDetail'>['route'];
type Nav = NativeStackNavigationProp<RootStackParamList>;

function formatCooldown(endsAt: string): string {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return '';
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function BookDetailScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<Nav>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<QuizStatus | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [friends, setFriends] = useState<PublicUser[]>([]);
  const [challengingSent, setChallengingSent] = useState<Set<string>>(new Set());

  useEffect(() => {
    bookService.getBookById(route.params.bookId).then((b) => {
      setBook(b);
      setLoading(false);
    });
    friendService.getFriends().then(setFriends).catch(() => {});
  }, [route.params.bookId]);

  const handleChallenge = useCallback(async (friendId: string) => {
    if (!book) return;
    setChallengingSent((prev) => new Set(prev).add(friendId));
    try {
      await challengeService.createChallenge(book.id, friendId);
    } catch { /* already sent or error */ }
  }, [book]);

  useFocusEffect(
    useCallback(() => {
      quizService.getQuizStatus(route.params.bookId).then(setStatus).catch(() => {});
    }, [route.params.bookId]),
  );

  if (loading || !book) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.amber} />
      </View>
    );
  }

  const pointsPerQuestion = POINTS_PER_CORRECT[book.difficulty];
  const canAttempt = status?.canAttempt !== false;
  const cooldownLabel = status?.cooldownEndsAt ? formatCooldown(status.cooldownEndsAt) : '';
  const readerCount = book.readerCount ?? 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Cover */}
      <View style={[styles.cover, { backgroundColor: coverColor(book.id.charCodeAt(0) % 8) }]}>
        {book.coverUrl ? (
          <Image source={{ uri: book.coverUrl }} style={StyleSheet.absoluteFillObject} resizeMode="cover" blurRadius={2} />
        ) : null}
        <View style={styles.coverOverlay}>
          <Text style={styles.coverTitle}>{book.title}</Text>
          <Text style={styles.coverAuthor}>{book.author}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.infoCard}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>

        <View style={styles.metaRow}>
          <DifficultyBadge difficulty={book.difficulty} />
          <Text style={styles.pages}>{book.pageCount} págs.</Text>
          <Text style={styles.ptsTag}>{pointsPerQuestion * 10} pts/quiz</Text>
          {readerCount > 0 && (
            <Text style={styles.readerTag}>👤 {readerCount} {readerCount === 1 ? 'lector' : 'lectores'}</Text>
          )}
        </View>

        <Text style={styles.description}>{book.description}</Text>

        {status && status.bestPoints > 0 && (
          <View style={styles.bestScoreRow}>
            <Text style={styles.bestScoreLabel}>Mejor puntaje</Text>
            <Text style={styles.bestScoreValue}>{status.bestPoints} pts</Text>
          </View>
        )}

        {/* Daily book indicator */}
        {status?.isDailyBook && (
          <View style={styles.dailyBanner}>
            <Text style={styles.dailyBannerText}>⭐ Libro del día · 2× puntos hoy</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.quizButton, !canAttempt && styles.quizButtonDisabled]}
          onPress={() => navigation.navigate('Quiz', { bookId: book.id })}
          activeOpacity={canAttempt ? 0.85 : 1}
          disabled={!canAttempt}
        >
          {canAttempt ? (
            <Text style={styles.quizButtonText}>Empezar Quiz</Text>
          ) : (
            <>
              <Text style={styles.quizButtonText}>Disponible en {cooldownLabel}</Text>
              <Text style={styles.cooldownSubtext}>Volvé a intentarlo mañana</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Challenge a friend button */}
        {friends.length > 0 && (
          <TouchableOpacity
            style={styles.challengeButton}
            onPress={() => setShowChallengeModal(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.challengeButtonText}>⚔️ Retar a un amigo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Challenge modal */}
      <Modal
        visible={showChallengeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowChallengeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowChallengeModal(false)}
        />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>⚔️ Elegí un amigo para retar</Text>
          <FlatList
            data={friends}
            keyExtractor={(f) => f.id}
            renderItem={({ item }) => {
              const sent = challengingSent.has(item.id);
              return (
                <View style={styles.friendRow}>
                  <LinearGradient
                    colors={[Colors.amber, Colors.amberLight]}
                    style={styles.friendAvatar}
                  >
                    <Text style={styles.friendAvatarText}>{item.displayName[0]?.toUpperCase()}</Text>
                  </LinearGradient>
                  <Text style={styles.friendName}>{item.displayName}</Text>
                  <TouchableOpacity
                    style={[styles.challengeChip, sent && styles.challengeChipSent]}
                    onPress={() => handleChallenge(item.id)}
                    disabled={sent}
                  >
                    <Text style={styles.challengeChipText}>{sent ? '✓ Enviado' : 'Retar'}</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  content: {
    paddingBottom: 32,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cream,
  },
  cover: {
    height: 260,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  coverOverlay: {
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  coverTitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 4,
  },
  coverAuthor: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: Colors.cream,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.ink,
  },
  author: {
    fontSize: 15,
    color: '#7a6f5e',
    marginTop: -6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  pages: {
    fontSize: 12,
    color: '#9a8f7e',
  },
  ptsTag: {
    fontSize: 12,
    color: Colors.amber,
    fontWeight: '600',
  },
  readerTag: {
    fontSize: 12,
    color: '#7a6f5e',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#5a4f3e',
    lineHeight: 22,
  },
  bestScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(212,130,26,0.08)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(212,130,26,0.2)',
  },
  bestScoreLabel: {
    fontSize: 13,
    color: '#7a6f5e',
    fontWeight: '600',
  },
  bestScoreValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.amber,
  },
  quizButton: {
    backgroundColor: Colors.amber,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.amber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  quizButtonDisabled: {
    backgroundColor: '#c0b8ad',
    shadowOpacity: 0,
    elevation: 0,
  },
  quizButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  cooldownSubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 3,
  },
  dailyBanner: {
    backgroundColor: 'rgba(212,130,26,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212,130,26,0.3)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  dailyBannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.amber,
  },
  challengeButton: {
    borderWidth: 1.5,
    borderColor: Colors.sage,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(74,124,95,0.06)',
  },
  challengeButtonText: {
    color: Colors.sage,
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalSheet: {
    backgroundColor: '#f5f0e7',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '60%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d0c8bc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1410',
    marginBottom: 16,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e0d0',
  },
  friendAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendAvatarText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  friendName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1410',
  },
  challengeChip: {
    backgroundColor: Colors.sage,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  challengeChipSent: {
    backgroundColor: '#a0b0a0',
  },
  challengeChipText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
