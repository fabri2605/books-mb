import { StyleSheet, Text, View } from 'react-native';
import { Fonts, coverColor } from '../theme';

interface Props {
  title: string;
  author: string;
  colorIndex: number;
}

/** Stable numeric hash from a string (djb2-like). */
function hashStr(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(33, h) ^ s.charCodeAt(i)) >>> 0;
  }
  return h;
}

export default function ProceduralCover({ title, author, colorIndex }: Props) {
  const bg = coverColor(colorIndex);
  const h = hashStr(title);
  const pattern = h % 5;

  return (
    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: bg, overflow: 'hidden' }]}>
      <Pattern type={pattern} seed={h} />
      <View style={styles.textWrap}>
        <Text style={styles.title} numberOfLines={4}>{title}</Text>
        <Text style={styles.author} numberOfLines={1}>{author}</Text>
      </View>
    </View>
  );
}

// ─── Patterns ────────────────────────────────────────────────────────────────

function Pattern({ type, seed }: { type: number; seed: number }) {
  const a = 'rgba(255,255,255,0.10)';
  const b = 'rgba(255,255,255,0.06)';

  switch (type) {
    case 0:
      // Two large circles in opposite corners
      return (
        <>
          <View style={[styles.circle, { width: 140, height: 140, top: -45, right: -45, backgroundColor: a }]} />
          <View style={[styles.circle, { width: 90,  height: 90,  bottom: -30, left: -25, backgroundColor: b }]} />
        </>
      );

    case 1:
      // Three diagonal stripes
      return (
        <>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.stripe,
                {
                  backgroundColor: i % 2 === 0 ? a : b,
                  top: -30 + i * 55,
                  left: -60,
                },
              ]}
            />
          ))}
        </>
      );

    case 2:
      // Diamond (rotated square) centered
      return (
        <View style={styles.diamondWrap}>
          <View style={[styles.diamond, { backgroundColor: a }]} />
          <View style={[styles.diamond, { backgroundColor: b, transform: [{ rotate: '45deg' }, { scale: 0.65 }] }]} />
        </View>
      );

    case 3:
      // Horizontal bands
      return (
        <>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.band,
                {
                  top: `${15 + i * 20}%` as unknown as number,
                  backgroundColor: i % 2 === 0 ? a : b,
                },
              ]}
            />
          ))}
        </>
      );

    case 4:
      // Arc from top-left corner + small accent circle bottom-right
      return (
        <>
          <View style={[styles.circle, { width: 200, height: 200, top: -80, left: -80, backgroundColor: a }]} />
          <View style={[styles.circle, { width: 50,  height: 50,  bottom: 20, right: 14, backgroundColor: b }]} />
        </>
      );

    default:
      return null;
  }
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  stripe: {
    position: 'absolute',
    width: 260,
    height: 28,
    transform: [{ rotate: '-35deg' }],
  },
  diamondWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamond: {
    position: 'absolute',
    width: 90,
    height: 90,
    transform: [{ rotate: '45deg' }],
  },
  band: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 18,
  },
  textWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.22)',
    justifyContent: 'flex-end',
  },
  title: {
    color: 'rgba(255,255,255,0.93)',
    fontFamily: Fonts.playfairBold,
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 3,
  },
  author: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 8,
  },
});
