import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  FlatList, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useState, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, PublicUser } from '../types';
import { friendService } from '../services';
import { useFriends } from '../hooks/useFriends';
import { Colors, Fonts } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initial = name?.[0]?.toUpperCase() ?? '?';
  return (
    <LinearGradient
      colors={[Colors.amber, Colors.amberLight]}
      style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.42 }]}>{initial}</Text>
    </LinearGradient>
  );
}

function UserRow({
  user,
  action,
  onPress,
}: {
  user: PublicUser;
  action: React.ReactNode;
  onPress: () => void;
}) {
  const level = Math.floor(user.totalPoints / 500) + 1;
  return (
    <TouchableOpacity style={styles.userRow} onPress={onPress} activeOpacity={0.75}>
      <Avatar name={user.displayName} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.displayName}</Text>
        <Text style={styles.userMeta}>@{user.username} · Nv.{level} · {user.booksCompleted} libros</Text>
      </View>
      {action}
    </TouchableOpacity>
  );
}

export default function FriendsScreen() {
  const navigation = useNavigation<Nav>();
  const { friends, requests, loading, refresh, acceptRequest, removeFriend } = useFriends();

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PublicUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<Set<string>>(new Set());

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (text.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const results = await friendService.searchUsers(text.trim());
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleSendRequest = useCallback(async (userId: string) => {
    setSendingTo(userId);
    try {
      await friendService.sendRequest(userId);
      setSentTo((prev) => new Set(prev).add(userId));
    } catch {
      // already sent or friends — ignore
      setSentTo((prev) => new Set(prev).add(userId));
    } finally {
      setSendingTo(null);
    }
  }, []);

  const isAlreadyFriend = (userId: string) => friends.some((f) => f.id === userId);
  const hasPendingRequest = (userId: string) => requests.some((r) => r.id === userId);

  const showSearch = query.trim().length >= 2;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <LinearGradient
        colors={['#142b1f', '#1e3d2c', '#243322']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>Amigos</Text>
        <Text style={styles.subtitle}>Buscá y conectá con otros lectores</Text>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por username..."
            placeholderTextColor="rgba(245,240,231,0.35)"
            value={query}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setSearchResults([]); }}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Body */}
      <View style={styles.body}>
        {showSearch ? (
          /* Search results */
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <Text style={styles.sectionTitle}>
                {searching ? 'Buscando...' : `Resultados (${searchResults.length})`}
              </Text>
            }
            ListEmptyComponent={
              searching
                ? <ActivityIndicator color={Colors.amber} style={{ marginTop: 24 }} />
                : <Text style={styles.emptyText}>Sin resultados para "{query}"</Text>
            }
            renderItem={({ item }) => {
              const alreadyFriend = isAlreadyFriend(item.id);
              const pendingReceived = hasPendingRequest(item.id);
              const sent = sentTo.has(item.id);
              const sending = sendingTo === item.id;

              let action: React.ReactNode;
              if (alreadyFriend) {
                action = <View style={[styles.chip, styles.chipGreen]}><Text style={styles.chipText}>Amigo</Text></View>;
              } else if (pendingReceived) {
                action = (
                  <TouchableOpacity
                    style={[styles.chip, styles.chipAmber]}
                    onPress={() => acceptRequest(item.id)}
                  >
                    <Text style={styles.chipText}>Aceptar</Text>
                  </TouchableOpacity>
                );
              } else if (sent) {
                action = <View style={[styles.chip, styles.chipGray]}><Text style={styles.chipText}>Enviado</Text></View>;
              } else {
                action = (
                  <TouchableOpacity
                    style={[styles.chip, styles.chipAmber]}
                    onPress={() => handleSendRequest(item.id)}
                    disabled={sending}
                  >
                    {sending
                      ? <ActivityIndicator size="small" color={Colors.white} />
                      : <Text style={styles.chipText}>+ Agregar</Text>
                    }
                  </TouchableOpacity>
                );
              }
              return (
                <UserRow
                  user={item}
                  action={action}
                  onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
                />
              );
            }}
          />
        ) : (
          <FlatList
            data={friends}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            onRefresh={refresh}
            refreshing={loading}
            ListHeaderComponent={
              <>
                {/* Incoming requests */}
                {requests.length > 0 && (
                  <View style={styles.requestsSection}>
                    <Text style={styles.sectionTitle}>Solicitudes ({requests.length})</Text>
                    {requests.map((req) => (
                      <UserRow
                        key={req.id}
                        user={req}
                        onPress={() => navigation.navigate('UserProfile', { userId: req.id })}
                        action={
                          <TouchableOpacity
                            style={[styles.chip, styles.chipAmber]}
                            onPress={() => acceptRequest(req.id)}
                          >
                            <Text style={styles.chipText}>Aceptar</Text>
                          </TouchableOpacity>
                        }
                      />
                    ))}
                  </View>
                )}
                <Text style={styles.sectionTitle}>
                  {loading ? 'Cargando...' : `Mis amigos (${friends.length})`}
                </Text>
              </>
            }
            ListEmptyComponent={
              loading ? null : (
                <Text style={styles.emptyText}>
                  Todavía no tenés amigos.{'\n'}Buscá por username para agregar.
                </Text>
              )
            }
            renderItem={({ item }) => (
              <UserRow
                user={item}
                onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
                action={
                  <TouchableOpacity
                    style={[styles.chip, styles.chipGray]}
                    onPress={() => removeFriend(item.id)}
                  >
                    <Text style={styles.chipText}>Eliminar</Text>
                  </TouchableOpacity>
                }
              />
            )}
          />
        )}
      </View>
    </KeyboardAvoidingView>
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
    paddingBottom: 20,
    gap: 4,
  },
  title: {
    fontFamily: Fonts.playfairBold,
    fontSize: 28,
    color: '#f5f0e7',
  },
  subtitle: {
    fontSize: 11,
    color: 'rgba(245,240,231,0.45)',
    letterSpacing: 0.3,
    marginBottom: 14,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#f5f0e7',
    padding: 0,
  },
  clearBtn: {
    fontSize: 13,
    color: 'rgba(245,240,231,0.5)',
    paddingHorizontal: 4,
  },
  body: {
    flex: 1,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#f5f0e7',
    marginTop: -1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontFamily: Fonts.playfairBold,
    fontSize: 15,
    color: '#1a1410',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  requestsSection: {
    marginBottom: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    color: Colors.white,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontFamily: Fonts.playfairBold,
    fontSize: 14,
    color: '#1a1410',
  },
  userMeta: {
    fontSize: 11,
    color: '#9a8868',
    marginTop: 1,
  },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  chipAmber: {
    backgroundColor: Colors.amber,
  },
  chipGreen: {
    backgroundColor: '#3a7a5a',
  },
  chipGray: {
    backgroundColor: '#d0c8bc',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9a8868',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 32,
  },
});
