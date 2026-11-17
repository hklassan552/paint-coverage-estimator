import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import theme from '../constants/theme';
import {
  BOARD_BORDER,
  BOARD_FRAME,
  BOARD_MAX_W,
  BOARD_PAD,
  IS_SHORT_PHONE,
  PREVIEW_H,
} from '../constants/config';
import { LengthUnit, areaSuffix, m2ToDisplay } from '../utils/units';
import { fixed2, formatLength } from '../utils/format';

const DRAW_W = BOARD_MAX_W - 2 * BOARD_FRAME;

export interface SurfacePreviewProps {
  widthM: number | null;
  heightM: number | null;
  label: string;
  displayUnit: LengthUnit;
}

/**
 * Illustrative proportional rectangle. It never feeds back into the
 * measurements; it only draws what has already been entered.
 */
function SurfacePreview({
  widthM,
  heightM,
  label,
  displayUnit,
}: SurfacePreviewProps) {
  const valid = widthM != null && heightM != null && widthM > 0 && heightM > 0;
  const areaM2 = valid ? widthM * heightM : 0;

  if (IS_SHORT_PHONE) {
    return (
      <View style={styles.strip}>
        <Text style={styles.stripLabel} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.stripValue} numberOfLines={1}>
          {valid
            ? fixed2(m2ToDisplay(areaM2, displayUnit)) +
              ' ' +
              areaSuffix(displayUnit)
            : 'Enter both dimensions'}
        </Text>
      </View>
    );
  }

  const ratio = valid ? widthM / heightM : 1.6;
  let w = DRAW_W;
  let h = w / ratio;
  if (h > PREVIEW_H) {
    h = PREVIEW_H;
    w = h * ratio;
  }
  w = Math.max(24, Math.min(w, DRAW_W));
  h = Math.max(24, Math.min(h, PREVIEW_H));

  return (
    <View style={styles.frame}>
      <View style={styles.canvas}>
        <Svg width={DRAW_W} height={PREVIEW_H}>
          <Rect
            x={(DRAW_W - w) / 2}
            y={(PREVIEW_H - h) / 2}
            width={w}
            height={h}
            rx={6}
            fill={valid ? 'rgba(40,224,180,0.18)' : 'rgba(221,176,187,0.18)'}
            stroke={valid ? theme.colors.primary : theme.colors.secondary}
            strokeWidth={2}
          />
          <Line
            x1={(DRAW_W - w) / 2}
            y1={PREVIEW_H / 2}
            x2={(DRAW_W + w) / 2}
            y2={PREVIEW_H / 2}
            stroke={theme.colors.secondary}
            strokeWidth={1}
            strokeDasharray="4 5"
          />
        </Svg>
      </View>
      <View style={styles.legend}>
        <Text style={styles.legendLabel} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.legendValue} numberOfLines={1}>
          {valid
            ? formatLength(widthM as number, displayUnit) +
              ' x ' +
              formatLength(heightM as number, displayUnit) +
              '  ·  ' +
              fixed2(m2ToDisplay(areaM2, displayUnit)) +
              ' ' +
              areaSuffix(displayUnit)
            : 'Enter both dimensions to see the shape'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: BOARD_MAX_W,
    alignSelf: 'center',
    padding: BOARD_PAD,
    borderWidth: BOARD_BORDER,
    borderColor: theme.colors.ui.border,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.card,
  },
  canvas: { width: DRAW_W, height: PREVIEW_H, alignSelf: 'center' },
  legend: { marginTop: theme.spacing.sm, gap: 2 },
  legendLabel: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: theme.colors.primary,
  },
  legendValue: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.secondary,
  },
  strip: {
    height: 64,
    width: '100%',
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    gap: 2,
  },
  stripLabel: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: theme.colors.primary,
  },
  stripValue: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.secondary,
  },
});

export default React.memo(SurfacePreview);
