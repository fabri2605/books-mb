import { StyleSheet, Text, View, Image } from 'react-native';
import { Colors } from '../theme';

interface Props {
  avatarUrl: string | null;
  displayName: string;
  size?: number;
}

export default function UserAvatar({ avatarUrl, displayName, size = 60 }: Props) {
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }

  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.initials, { fontSize: size * 0.35 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: Colors.paper },
  fallback: {
    backgroundColor: Colors.amber,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: { color: Colors.white, fontWeight: '700' },
});
