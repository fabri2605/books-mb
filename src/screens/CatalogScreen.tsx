import { StyleSheet, View, FlatList, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useBooks } from '../hooks/useBooks';
import { useAuthStore } from '../hooks/useAuthStore';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import BookCard from '../components/BookCard';
import { Colors } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function CatalogScreen() {
  const navigation = useNavigation<Nav>();
  const { books, loading, setSearch, difficulty, setDifficulty } = useBooks();
  const user = useAuthStore((s) => s.user);

  const initial = user?.displayName?.[0]?.toUpperCase() ?? 'U';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Buenos días,</Text>
            <Text style={styles.name}>{user?.displayName ?? 'Lector'} 📚</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
        </View>
        <View style={styles.pointsPill}>
          <Text style={styles.pointsText}>⭐ {user?.totalPoints ?? 0} puntos</Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.searchWrap}>
          <SearchBar onSearch={setSearch} />
        </View>
        <View style={styles.chipsWrap}>
          <FilterChips selected={difficulty} onSelect={setDifficulty} />
        </View>

        {loading ? (
          <ActivityIndicator style={styles.loader} size="large" color={Colors.amber} />
        ) : (
          <FlatList
            data={books}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            renderItem={({ item, index }) => (
              <BookCard
                book={item}
                index={index}
                onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
              />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  header: {
    backgroundColor: Colors.forest,
    paddingTop: 52,
    paddingHorizontal: 22,
    paddingBottom: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  greeting: {
    fontSize: 11,
    color: Colors.sage,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.cream,
    marginTop: 2,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  pointsPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(212,130,26,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(212,130,26,0.4)',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  pointsText: {
    fontSize: 12,
    color: Colors.amberLight,
    fontWeight: '600',
  },
  body: {
    flex: 1,
    paddingTop: 18,
  },
  searchWrap: {
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  chipsWrap: {
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  loader: { flex: 1 },
  list: {
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  row: {
    gap: 12,
    marginBottom: 18,
  },
});
