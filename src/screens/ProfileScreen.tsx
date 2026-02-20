import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView,
  Modal, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useState, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../hooks/useAuthStore';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { userService } from '../services';
import ProceduralCover from '../components/ProceduralCover';
import { Colors, Fonts } from '../theme';
import { Difficulty } from '../types';
import { getLevelInfo, getLevelColor } from '../utils/scoring';

const USERNAME_RE = /^[a-z0-9_]{3,30}$/;

type AchievementDef = {
  id: string;
  icon: string;
  label: string;
  type: 'books' | 'points';
  req: number;
};

const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'b1', icon: '📖', label: 'Primera página', type: 'books', req: 1 },
  { id: 'b2', icon: '📚', label: 'Bibliófilo',     type: 'books', req: 5 },
  { id: 'b3', icon: '🌿', label: 'Constante',       type: 'books', req: 10 },
  { id: 'b4', icon: '🌍', label: 'Gran lector',     type: 'books', req: 25 },
  { id: 'b5', icon: '🦉', label: 'Erudito',         type: 'books', req: 50 },
  { id: 'b6', icon: '👑', label: 'Maestro',         type: 'books', req: 100 },
  { id: 'p1', icon: '⚡', label: 'Acumulador',      type: 'points', req: 50 },
  { id: 'p2', icon: '🔥', label: 'En racha',        type: 'points', req: 200 },
  { id: 'p3', icon: '💎', label: 'Diamante',        type: 'points', req: 500 },
  { id: 'p4', icon: '🏆', label: 'Campeón',         type: 'points', req: 1000 },
  { id: 'p5', icon: '🚀', label: 'Leyenda',         type: 'points', req: 5000 },
];

// Placeholder recent reads — replace with real data when backend supports it
const RECENT_READS = [
  { id: 'r1', title: '1984', author: 'G. Orwell', difficulty: 'hard' as Difficulty, stars: 5, quiz: '9/10', pts: 120 },
  { id: 'r2', title: 'El Alquimista', author: 'P. Coelho', difficulty: 'easy' as Difficulty, stars: 4, quiz: '7/10', pts: 42 },
];

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { entries } = useLeaderboard();

  const [editingUsername, setEditingUsername] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const openUsernameEdit = useCallback(() => {
    setEditValue(user?.username ?? '');
    setEditError('');
    setEditingUsername(true);
  }, [user?.username]);

  const handleEditChange = useCallback((text: string) => {
    setEditValue(text.toLowerCase().replace(/[^a-z0-9_]/g, ''));
    setEditError('');
  }, []);

  const handleEditSave = useCallback(async () => {
    if (editValue.length < 3) { setEditError('Mínimo 3 caracteres.'); return; }
    if (!USERNAME_RE.test(editValue)) { setEditError('Solo letras minúsculas, números y guion bajo.'); return; }
    setEditLoading(true);
    try {
      const updated = await userService.updateUsername(editValue);
      setUser(updated);
      setEditingUsername(false);
    } catch (e: any) {
      const msg = e?.response?.data?.error ?? '';
      setEditError(msg.includes('uso') ? 'Ese username ya está en uso.' : 'Ocurrió un error.');
    } finally {
      setEditLoading(false);
    }
  }, [editValue, setUser]);

  const initial = user?.displayName?.[0]?.toUpperCase() ?? 'U';
  const totalPoints = user?.totalPoints ?? 0;
  const booksCompleted = user?.booksCompleted ?? 0;
  const { level, xpProgress, xpInLevel, xpForNext } = getLevelInfo(totalPoints);
  const xpMax = xpForNext;
  const levelColor = getLevelColor(level);

  const xpAnim = useSharedValue(0);
  const animatedXpStyle = useAnimatedStyle(() => ({ width: (xpAnim.value + '%') as any }));

  useFocusEffect(useCallback(() => {
    xpAnim.value = 0;
    xpAnim.value = withTiming(Math.max(2, xpProgress * 100), { duration: 900 });
  }, [xpProgress]));
  const accuracy = booksCompleted ? Math.min(99, 70 + booksCompleted * 2) : 0;

  const myRank = entries.find((e) => e.userId === user?.id)?.rank ?? null;

  const isUnlocked = (a: AchievementDef) =>
    a.type === 'books'
      ? booksCompleted >= a.req
      : totalPoints >= a.req;

  return (
    <View style={styles.container}>
      {/* Hero */}
      <LinearGradient
        colors={['#142b1f', '#1e3d2c', '#243322']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.hero}
      >
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <LinearGradient
            colors={[Colors.amber, Colors.amberLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{initial}</Text>
          </LinearGradient>
          <View style={[styles.levelBadge, { backgroundColor: levelColor.bg, borderColor: levelColor.accent }]}>
            <Text style={[styles.levelText, { color: levelColor.accent }]}>Nv. {level}</Text>
          </View>
        </View>

        <Text style={styles.name}>{user?.displayName ?? 'Usuario'}</Text>
        <Text style={styles.handle}>{user?.email ?? ''}</Text>

        {/* Username con edición */}
        <TouchableOpacity style={styles.usernameRow} onPress={openUsernameEdit} activeOpacity={0.75}>
          <Text style={styles.usernameText}>@{user?.username ?? '—'}</Text>
          <View style={styles.editBadge}>
            <Text style={styles.editBadgeText}>✏️ editar</Text>
          </View>
        </TouchableOpacity>

        {/* 4-stat row */}
        <View style={styles.statsRow}>
          <View style={styles.statCell}>
            <Text style={styles.statVal}>{booksCompleted}</Text>
            <Text style={styles.statLabel}>Libros</Text>
          </View>
          <View style={[styles.statCell, styles.statBorder]}>
            <Text style={styles.statVal}>{totalPoints.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Pts</Text>
          </View>
          <View style={[styles.statCell, styles.statBorder]}>
            <Text style={styles.statVal}>{myRank ? `#${myRank}` : '—'}</Text>
            <Text style={styles.statLabel}>Rango</Text>
          </View>
          <View style={[styles.statCell, styles.statBorder]}>
            <Text style={styles.statVal}>{accuracy}%</Text>
            <Text style={styles.statLabel}>Precisión</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Body */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* XP Progress */}
        <View style={styles.card}>
          <View style={styles.xpHdr}>
            <Text style={styles.xpHdrText}>Progreso al Nivel {level + 1}</Text>
            <Text style={styles.xpHdrPts}>{xpInLevel} / {xpMax} XP</Text>
          </View>
          <View style={styles.xpTrack}>
            <Animated.View style={[styles.xpFill, { backgroundColor: levelColor.bg }, animatedXpStyle]} />
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Logros 🎖️</Text>
          <View style={styles.achieveGrid}>
            {ACHIEVEMENTS.map((a) => {
              const unlocked = isUnlocked(a);
              return (
                <View
                  key={a.id}
                  style={[styles.achieveItem, unlocked ? styles.achieveUnlocked : styles.achieveLocked]}
                >
                  <Text style={styles.achieveIcon}>{a.icon}</Text>
                  <Text style={styles.achieveLabel}>{a.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Recent reads */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Leídos recientemente</Text>
          {RECENT_READS.map((item, idx) => (
            <View key={item.id} style={[styles.readItem, idx > 0 && styles.readItemBorder]}>
              <View style={styles.miniCover}>
                <ProceduralCover title={item.title} author={item.author} colorIndex={idx} />
              </View>
              <View style={styles.readInfo}>
                <Text style={styles.readTitle}>{item.title} — {item.author}</Text>
                <Text style={styles.readStars}>{'★'.repeat(item.stars)}{'☆'.repeat(5 - item.stars)}</Text>
                <Text style={styles.readQuiz}>{item.quiz} correctas</Text>
              </View>
              <Text style={styles.readPts}>+{item.pts}</Text>
            </View>
          ))}
        </View>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={clearAuth}>
          <Text style={styles.signOutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal edición de username */}
      <Modal
        visible={editingUsername}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingUsername(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setEditingUsername(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Cambiar username</Text>

            <View style={[
              styles.modalInputWrap,
              editError ? styles.inputError : USERNAME_RE.test(editValue) ? styles.inputOk : null,
            ]}>
              <Text style={styles.modalAt}>@</Text>
              <TextInput
                style={styles.modalInput}
                value={editValue}
                onChangeText={handleEditChange}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
                maxLength={30}
                placeholder="nuevo_username"
                placeholderTextColor="#c0b8a8"
              />
              {USERNAME_RE.test(editValue) && !editError && (
                <Text style={styles.checkMark}>✓</Text>
              )}
            </View>

            {editError
              ? <Text style={styles.modalError}>{editError}</Text>
              : <Text style={styles.modalHint}>3-30 caracteres · letras minúsculas, números y _</Text>
            }

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setEditingUsername(false)}
                disabled={editLoading}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveBtn, (!USERNAME_RE.test(editValue) || editLoading) && styles.btnDisabled]}
                onPress={handleEditSave}
                disabled={!USERNAME_RE.test(editValue) || editLoading}
              >
                {editLoading
                  ? <ActivityIndicator size="small" color={Colors.white} />
                  : <Text style={styles.modalSaveText}>Guardar</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0e7',
  },
  hero: {
    paddingTop: 52,
    paddingHorizontal: 22,
    paddingBottom: 20,
    alignItems: 'center',
    gap: 8,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.amber,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  avatarText: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '700',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    right: -6,
    backgroundColor: '#1a3a2a',
    borderWidth: 1.5,
    borderColor: Colors.amber,
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  levelText: {
    fontSize: 10,
    color: Colors.amberLight,
    fontWeight: '700',
  },
  name: {
    fontFamily: Fonts.playfairBold,
    fontSize: 22,
    color: '#f5f0e7',
    lineHeight: 26,
  },
  handle: {
    fontSize: 11,
    color: 'rgba(245,240,231,0.4)',
    letterSpacing: 0.5,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  usernameText: {
    fontSize: 13,
    color: Colors.amberLight,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  editBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  editBadgeText: {
    fontSize: 10,
    color: 'rgba(245,240,231,0.55)',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 4,
  },
  statCell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    gap: 2,
  },
  statBorder: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.05)',
  },
  statVal: {
    fontFamily: Fonts.playfairBold,
    fontSize: 15,
    color: Colors.amberLight,
  },
  statLabel: {
    fontSize: 9,
    color: 'rgba(245,240,231,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  body: {
    flex: 1,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
  },
  bodyContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontFamily: Fonts.playfairBold,
    fontSize: 15,
    color: '#1a1410',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  xpHdr: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpHdrText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2a2018',
  },
  xpHdrPts: {
    fontSize: 12,
    color: Colors.amber,
    fontWeight: '700',
  },
  xpTrack: {
    height: 6,
    backgroundColor: '#f0ead8',
    borderRadius: 99,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: Colors.amber,
    borderRadius: 99,
  },
  achieveGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  achieveItem: {
    width: '22%',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 10,
  },
  achieveUnlocked: {
    backgroundColor: 'rgba(201,122,26,0.08)',
  },
  achieveLocked: {
    opacity: 0.35,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  achieveIcon: {
    fontSize: 21,
    lineHeight: 26,
  },
  achieveLabel: {
    fontSize: 9,
    color: '#5a4a38',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 12,
  },
  readItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  readItemBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f0e8d8',
  },
  miniCover: {
    width: 32,
    height: 44,
    borderRadius: 5,
    overflow: 'hidden',
    flexShrink: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  readInfo: {
    flex: 1,
    minWidth: 0,
  },
  readTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1410',
    marginBottom: 2,
  },
  readStars: {
    fontSize: 11,
    color: Colors.amber,
    marginBottom: 2,
  },
  readQuiz: {
    fontSize: 10,
    color: '#9a8868',
  },
  readPts: {
    fontFamily: Fonts.playfairBold,
    fontSize: 16,
    color: Colors.sage,
  },
  signOutBtn: {
    borderWidth: 1.5,
    borderColor: Colors.dust,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: Colors.white,
  },
  signOutText: {
    color: '#7a6f5e',
    fontSize: 14,
    fontWeight: '600',
  },
  // --- Modal username ---
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalSheet: {
    backgroundColor: '#f5f0e7',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d0c8bc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 4,
  },
  modalTitle: {
    fontFamily: Fonts.playfairBold,
    fontSize: 18,
    color: '#1a1410',
  },
  modalInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: '#e2d9cb',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
  },
  inputError: {
    borderColor: '#c0594a',
  },
  inputOk: {
    borderColor: '#3a7a5a',
  },
  modalAt: {
    fontSize: 16,
    color: '#9a8868',
    fontWeight: '600',
  },
  modalInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1410',
    padding: 0,
  },
  checkMark: {
    fontSize: 16,
    color: '#3a7a5a',
    fontWeight: '700',
  },
  modalHint: {
    fontSize: 11,
    color: '#9a8868',
  },
  modalError: {
    fontSize: 12,
    color: '#c0594a',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.dust,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  modalCancelText: {
    color: '#7a6f5e',
    fontWeight: '600',
    fontSize: 14,
  },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: Colors.amber,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.45,
  },
  modalSaveText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
