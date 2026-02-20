import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useEffect, useState, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList, PublicUser, FriendshipStatus } from '../types';
import { friendService } from '../services';
import { useAuthStore } from '../hooks/useAuthStore';
import { Colors, Fonts } from '../theme';
import { getLevelInfo, getLevelColor } from '../utils/scoring';

type Route = RouteProp<RootStackParamList, 'UserProfile'>;

export default function UserProfileScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation();
  const currentUserId = useAuthStore((s) => s.user?.id);

  const [user, setUser] = useState<PublicUser | null>(null);
  const [status, setStatus] = useState<FriendshipStatus>('none');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const isOwnProfile = currentUserId === params.userId;

  const xpAnim = useSharedValue(0);
  const animatedXpStyle = useAnimatedStyle(() => ({ width: (xpAnim.value + '%') as any }));

  const load = useCallback(async () => {
    setLoadingProfile(true);
    try {
      const [profile, friendStatus] = await Promise.all([
        friendService.getUserProfile(params.userId),
        isOwnProfile ? Promise.resolve<FriendshipStatus>('none') : friendService.getFriendshipStatus(params.userId),
      ]);
      setUser(profile);
      setStatus(friendStatus);
    } catch {
      // handled below via null check
    } finally {
      setLoadingProfile(false);
    }
  }, [params.userId, isOwnProfile]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!user) return;
    const target = Math.max(2, (user.totalPoints % 500) / 500 * 100);
    xpAnim.value = 0;
    xpAnim.value = withTiming(target, { duration: 900 });
  }, [user]);

  const handleAction = useCallback(async () => {
    if (!user) return;
    setActionLoading(true);
    try {
      if (status === 'none') {
        await friendService.sendRequest(user.id);
        setStatus('pending_sent');
      } else if (status === 'pending_received') {
        await friendService.acceptRequest(user.id);
        setStatus('friends');
      } else if (status === 'friends') {
        await friendService.removeFriend(user.id);
        setStatus('none');
      }
    } finally {
      setActionLoading(false);
    }
  }, [user, status]);

  if (loadingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.amber} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No se pudo cargar el perfil.</Text>
      </View>
    );
  }

  const { level, xpProgress, xpInLevel, xpForNext } = getLevelInfo(user.totalPoints);
  const levelColor = getLevelColor(level);
  const initial = user.displayName?.[0]?.toUpperCase() ?? '?';

  const actionLabel = () => {
    if (isOwnProfile) return null;
    switch (status) {
      case 'none': return '+ Agregar amigo';
      case 'pending_sent': return 'Solicitud enviada';
      case 'pending_received': return 'Aceptar solicitud';
      case 'friends': return 'Eliminar amigo';
    }
  };

  const actionStyle = () => {
    switch (status) {
      case 'none': return styles.btnPrimary;
      case 'pending_sent': return styles.btnGray;
      case 'pending_received': return styles.btnPrimary;
      case 'friends': return styles.btnDestructive;
    }
  };

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

        <Text style={styles.name}>{user.displayName}</Text>
        <Text style={styles.username}>@{user.username}</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCell}>
            <Text style={styles.statVal}>{user.booksCompleted}</Text>
            <Text style={styles.statLabel}>Libros</Text>
          </View>
          <View style={[styles.statCell, styles.statBorder]}>
            <Text style={styles.statVal}>{user.totalPoints.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Pts</Text>
          </View>
          <View style={[styles.statCell, styles.statBorder]}>
            <Text style={styles.statVal}>Nv.{level}</Text>
            <Text style={styles.statLabel}>Nivel</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Body */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* XP progress */}
        <View style={styles.card}>
          <View style={styles.xpHdr}>
            <Text style={styles.xpHdrText}>Progreso al Nivel {level + 1}</Text>
            <Text style={styles.xpHdrPts}>{xpInLevel} / {xpForNext} XP</Text>
          </View>
          <View style={styles.xpTrack}>
            <Animated.View style={[styles.xpFill, { backgroundColor: levelColor.bg }, animatedXpStyle]} />
          </View>
        </View>

        {/* Friend action */}
        {!isOwnProfile && (
          <TouchableOpacity
            style={[styles.actionBtn, actionStyle()]}
            onPress={handleAction}
            disabled={actionLoading || status === 'pending_sent'}
            activeOpacity={0.85}
          >
            {actionLoading
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={styles.actionBtnText}>{actionLabel()}</Text>
            }
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0e7',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f0e7',
  },
  errorText: {
    color: '#9a8868',
    fontSize: 14,
  },
  hero: {
    paddingTop: 16,
    paddingHorizontal: 22,
    paddingBottom: 20,
    alignItems: 'center',
    gap: 8,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 4,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
    fontSize: 28,
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
  },
  username: {
    fontSize: 12,
    color: 'rgba(245,240,231,0.45)',
    letterSpacing: 0.5,
    marginBottom: 4,
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
    paddingBottom: 40,
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
  actionBtn: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: Colors.amber,
  },
  btnGray: {
    backgroundColor: '#c8bfb0',
  },
  btnDestructive: {
    backgroundColor: '#c0594a',
  },
  actionBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
