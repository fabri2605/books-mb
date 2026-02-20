import {
  StyleSheet, View, FlatList, ActivityIndicator, Text,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { RootStackParamList, Book } from '../types';
import { useBooks } from '../hooks/useBooks';
import { useAuthStore } from '../hooks/useAuthStore';
import { bookService } from '../services';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import BookCard from '../components/BookCard';
import TrendingCard from '../components/TrendingCard';
import TrendingCardSkeleton from '../components/TrendingCardSkeleton';
import StreakModal from '../components/StreakModal';
import { useStreak } from '../hooks/useStreak';
import { Colors, Fonts } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function CatalogScreen() {
  const navigation = useNavigation<Nav>();
  const { books, loading, setSearch, difficulty, setDifficulty, includeExternal, setIncludeExternal } = useBooks();
  const user = useAuthStore((s) => s.user);
  const [importing, setImporting] = useState<string | null>(null);
  const { streak, showModal, closeModal } = useStreak();

  const initial = user?.displayName?.[0]?.toUpperCase() ?? 'U';
  const totalPoints = user?.totalPoints ?? 0;
  const level = Math.floor(totalPoints / 500) + 1;
  const xpProgress = (totalPoints % 500) / 500;

  const trendingBooks = books
    .filter((b) => !b.isExternal && (b.readerCount ?? 0) > 0)
    .slice(0, 10);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  async function handleBookPress(book: Book) {
    if (!book.isExternal) {
      navigation.navigate('BookDetail', { bookId: book.id });
      return;
    }
    if (!book.externalId) return;
    setImporting(book.externalId);
    try {
      const imported = await bookService.importBook(book.externalId);
      navigation.navigate('BookDetail', { bookId: imported.id });
    } finally {
      setImporting(null);
    }
  }

  return (
    <View style={styles.container}>
      <StreakModal streak={streak} visible={showModal} onClose={closeModal} />

      {/* Hero header */}
      <LinearGradient
        colors={['#142b1f', '#1e3d2c', '#243322']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.header}
      >
        {/* Top row */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.name}>{user?.displayName ?? 'Lector'}</Text>
          </View>
          <LinearGradient
            colors={[Colors.amber, Colors.amberLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{initial}</Text>
          </LinearGradient>
        </View>

        {/* XP bar */}
        <View style={styles.xpWrap}>
          <View style={styles.xpLabelRow}>
            <Text style={styles.xpLevelText}>Nivel {level} → {level + 1}</Text>
            <Text style={styles.xpPtsText}>⭐ {totalPoints.toLocaleString()} pts</Text>
          </View>
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${Math.max(4, xpProgress * 100)}%` as any }]}>
              <View style={styles.xpDot} />
            </View>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>{user?.booksCompleted ?? 0}</Text>
            <Text style={styles.statLabel}>Libros</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>{totalPoints.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Puntos</Text>
          </View>
          <View style={[styles.statCell, styles.statCellLast]}>
            <Text style={styles.statValue}>Nv.{level}</Text>
            <Text style={styles.statLabel}>Nivel</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Scrollable body */}
      <FlatList
        data={books}
        keyExtractor={(item) => item.externalId ?? item.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        style={styles.body}
        ListHeaderComponent={
          <View>
            {/* Search */}
            <View style={styles.searchWrap}>
              <SearchBar onSearch={setSearch} />
            </View>

            {/* Filters */}
            <View style={styles.chipsWrap}>
              <FilterChips selected={difficulty} onSelect={setDifficulty} />
            </View>

            {/* Open Library toggle */}
            <View style={styles.externalToggleWrap}>
              <TouchableOpacity
                style={[styles.externalToggle, includeExternal && styles.externalToggleActive]}
                onPress={() => setIncludeExternal(!includeExternal)}
                activeOpacity={0.8}
              >
                <Text style={[styles.externalToggleText, includeExternal && styles.externalToggleTextActive]}>
                  🌐 Buscar en Open Library
                </Text>
              </TouchableOpacity>
            </View>

            {/* Trending section */}
            {(loading || trendingBooks.length > 0) && (
              <View style={styles.trendingSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Tendencia 🔥</Text>
                  <Text style={styles.sectionLink}>Ver más</Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.trendingScroll}
                >
                  {loading
                    ? [0, 1, 2, 3].map((i) => <TrendingCardSkeleton key={i} />)
                    : trendingBooks.map((book, idx) => (
                        <TrendingCard
                          key={book.id}
                          book={book}
                          index={idx}
                          onPress={() => handleBookPress(book)}
                        />
                      ))}
                </ScrollView>
              </View>
            )}

            {/* All books label */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {loading ? 'Cargando...' : 'Todos los libros'}
              </Text>
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View
            style={{ flex: 1 }}
            entering={FadeInDown.delay(Math.min(index, 10) * 70).springify().damping(14)}
          >
            <BookCard
              book={item}
              index={index}
              onPress={() => handleBookPress(item)}
              importing={item.isExternal && importing === item.externalId}
            />
          </Animated.View>
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={styles.loader} size="large" color={Colors.amber} />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0e7',
  },
  header: {
    paddingTop: 52,
    paddingHorizontal: 22,
    paddingBottom: 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  greeting: {
    fontSize: 11,
    color: '#4a7a5f',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '500',
  },
  name: {
    fontFamily: Fonts.playfairBold,
    fontSize: 26,
    color: '#f5f0e7',
    lineHeight: 30,
    marginTop: 2,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.amberLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  xpWrap: {
    marginBottom: 18,
  },
  xpLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpLevelText: {
    fontSize: 11,
    color: 'rgba(245,240,231,0.5)',
    fontWeight: '400',
  },
  xpPtsText: {
    fontSize: 11,
    color: Colors.amberLight,
    fontWeight: '600',
  },
  xpTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 99,
    overflow: 'visible',
  },
  xpFill: {
    height: 4,
    backgroundColor: Colors.amber,
    borderRadius: 99,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  xpDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.amberLight,
    marginRight: -4,
    shadowColor: Colors.amberLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 18,
    marginBottom: 0,
  },
  statCell: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 2,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.06)',
  },
  statCellLast: {
    borderRightWidth: 0,
  },
  statValue: {
    fontFamily: Fonts.playfairBold,
    fontSize: 17,
    color: Colors.amberLight,
  },
  statLabel: {
    fontSize: 9,
    color: 'rgba(245,240,231,0.45)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '500',
  },
  body: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontFamily: Fonts.playfairBold,
    fontSize: 17,
    color: Colors.ink,
    fontStyle: 'italic',
  },
  sectionLink: {
    fontSize: 11,
    color: Colors.amber,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  trendingSection: {
    marginBottom: 4,
  },
  trendingScroll: {
    paddingHorizontal: 18,
    gap: 12,
  },
  searchWrap: {
    paddingHorizontal: 18,
    marginTop: 16,
    marginBottom: 10,
  },
  chipsWrap: {
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  externalToggleWrap: {
    paddingHorizontal: 18,
    marginBottom: 4,
  },
  externalToggle: {
    borderWidth: 1.5,
    borderColor: '#e2d9cb',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  externalToggleActive: {
    backgroundColor: 'rgba(212,130,26,0.08)',
    borderColor: Colors.amber,
  },
  externalToggleText: {
    fontSize: 12,
    color: '#3a6ab0',
    fontWeight: '600',
  },
  externalToggleTextActive: {
    color: Colors.amber,
  },
  loader: { flex: 1, marginTop: 40 },
  list: {
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  row: {
    gap: 8,
    marginBottom: 14,
  },
});
