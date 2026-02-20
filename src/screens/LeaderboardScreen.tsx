import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useAuthStore } from '../hooks/useAuthStore';
import LeaderboardRow from '../components/LeaderboardRow';
import { Colors, Fonts } from '../theme';

type Tab = 'global' | 'amigos' | 'mensual';

const TABS: { key: Tab; label: string }[] = [
  { key: 'global', label: 'Global' },
  { key: 'amigos', label: 'Amigos' },
  { key: 'mensual', label: 'Mensual' },
];

export default function LeaderboardScreen() {
  const { entries, loading } = useLeaderboard();
  const userId = useAuthStore((s) => s.user?.id);
  const [activeTab, setActiveTab] = useState<Tab>('global');

  const showPodium = entries.length >= 3;
  const top3 = entries.slice(0, 3);
  const rest = showPodium ? entries.slice(3) : entries;

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.amber} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Hero with warm dark gradient */}
      <LinearGradient
        colors={['#1a1508', '#2a2010', '#3a2d15']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.heroTitle}>Tabla de Posiciones</Text>
        <Text style={styles.heroSubtitle}>Semana actual · Top 100</Text>

        {showPodium && (
          <View style={styles.podium}>
            {/* 2nd place */}
            <View style={styles.podiumCol}>
              <View style={[styles.podiumAvatar, styles.podiumSecond]}>
                <Text style={styles.podiumAvatarText}>
                  {top3[1].displayName[0].toUpperCase()}
                </Text>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{top3[1].displayName}</Text>
              <Text style={styles.podiumPts}>{top3[1].totalPoints.toLocaleString()}</Text>
              <View style={[styles.podiumBlock, styles.podiumBlockSecond]}>
                <Text style={styles.podiumBlockNum}>2</Text>
              </View>
            </View>

            {/* 1st place */}
            <View style={styles.podiumCol}>
              <Text style={styles.crown}>👑</Text>
              <LinearGradient
                colors={[Colors.amber, Colors.amberLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.podiumAvatar, styles.podiumFirst]}
              >
                <Text style={[styles.podiumAvatarText, styles.podiumFirstText]}>
                  {top3[0].displayName[0].toUpperCase()}
                </Text>
              </LinearGradient>
              <Text style={styles.podiumName} numberOfLines={1}>{top3[0].displayName}</Text>
              <Text style={styles.podiumPts}>{top3[0].totalPoints.toLocaleString()}</Text>
              <View style={[styles.podiumBlock, styles.podiumBlockFirst]}>
                <Text style={styles.podiumBlockNum}>1</Text>
              </View>
            </View>

            {/* 3rd place */}
            <View style={styles.podiumCol}>
              <View style={[styles.podiumAvatar, styles.podiumThird]}>
                <Text style={styles.podiumAvatarText}>
                  {top3[2].displayName[0].toUpperCase()}
                </Text>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{top3[2].displayName}</Text>
              <Text style={styles.podiumPts}>{top3[2].totalPoints.toLocaleString()}</Text>
              <View style={[styles.podiumBlock, styles.podiumBlockThird]}>
                <Text style={styles.podiumBlockNum}>3</Text>
              </View>
            </View>
          </View>
        )}
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
            {activeTab === tab.key && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={rest}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <View>
            {item.userId === userId && (
              <View style={styles.meSeparator}>
                <View style={styles.sepLine} />
                <Text style={styles.sepText}>TU POSICIÓN</Text>
                <View style={styles.sepLine} />
              </View>
            )}
            <LeaderboardRow entry={item} isCurrentUser={item.userId === userId} />
          </View>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        style={styles.body}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0e7',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f0e7',
  },
  hero: {
    paddingTop: 52,
    paddingHorizontal: 22,
    paddingBottom: 0,
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: Fonts.playfairBold,
    fontSize: 22,
    color: Colors.amberLight,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  heroSubtitle: {
    fontSize: 10,
    color: 'rgba(245,240,231,0.4)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 0,
  },
  podiumCol: {
    alignItems: 'center',
    gap: 4,
    width: 90,
  },
  crown: {
    fontSize: 14,
    marginBottom: 2,
  },
  podiumAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumFirst: {
    width: 46,
    height: 46,
    borderRadius: 23,
    shadowColor: Colors.amberLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 6,
  },
  podiumSecond: {
    backgroundColor: '#b0b0c8',
  },
  podiumThird: {
    backgroundColor: '#c08050',
  },
  podiumAvatarText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  podiumFirstText: {
    fontSize: 17,
  },
  podiumName: {
    fontSize: 10,
    color: 'rgba(245,240,231,0.7)',
    fontWeight: '500',
    maxWidth: 70,
    textAlign: 'center',
  },
  podiumPts: {
    fontFamily: Fonts.playfairBold,
    fontSize: 11,
    color: Colors.amberLight,
  },
  podiumBlock: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  podiumBlockFirst: {
    height: 54,
    backgroundColor: 'rgba(201,168,76,0.25)',
  },
  podiumBlockSecond: {
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  podiumBlockThird: {
    height: 26,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  podiumBlockNum: {
    fontFamily: Fonts.playfairBold,
    fontSize: 18,
    color: 'rgba(255,255,255,0.5)',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e0d0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#a09080',
  },
  tabTextActive: {
    color: Colors.amber,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: Colors.amber,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  body: {
    flex: 1,
    backgroundColor: '#f5f0e7',
  },
  list: {
    paddingVertical: 8,
    paddingBottom: 80,
  },
  meSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    gap: 8,
  },
  sepLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e8dece',
  },
  sepText: {
    fontSize: 10,
    color: '#b0a080',
    fontWeight: '600',
    letterSpacing: 1,
  },
});
