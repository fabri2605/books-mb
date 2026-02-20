import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../theme';

export default function TrendingCardSkeleton() {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.55, 1]),
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.cover} />
      <View style={styles.titleLine} />
      <View style={styles.authorLine} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 110,
  },
  cover: {
    width: 110,
    height: 158,
    borderRadius: 12,
    backgroundColor: Colors.dust,
    marginBottom: 8,
  },
  titleLine: {
    width: 90,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.dust,
    marginBottom: 5,
  },
  authorLine: {
    width: 60,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.paper,
  },
});
