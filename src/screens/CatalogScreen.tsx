import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useBooks } from '../hooks/useBooks';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import BookCard from '../components/BookCard';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function CatalogScreen() {
  const navigation = useNavigation<Nav>();
  const { books, loading, setSearch, difficulty, setDifficulty } = useBooks();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SearchBar onSearch={setSearch} />
        <FilterChips selected={difficulty} onSelect={setDifficulty} />
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#4A90D9" />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: { backgroundColor: '#fff', paddingTop: 50 },
  loader: { flex: 1, justifyContent: 'center' },
  list: { paddingVertical: 8 },
});
