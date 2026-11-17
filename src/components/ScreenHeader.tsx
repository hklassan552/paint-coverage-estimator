import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import theme from '../constants/theme';
import { HEADER_BODY_H, HEADER_TOP_PAD, TOUCH_MIN } from '../constants/config';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string | null;
  onBack?: (() => void) | null;
  actionLabel?: string | null;
  onAction?: (() => void) | null;
  rightSlot?: React.ReactNode;
}

/**
 * The one header used by every screen. Screens differ only through
 * title / subtitle / left / right slots, never through their own markup.
 */
function ScreenHeader({
  title,
  subtitle,
  onBack,
  actionLabel,
  onAction,
  rightSlot,
}: ScreenHeaderProps) {
  return (
    <LinearGradient
      colors={theme.gradients.header as unknown as string[]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.wrap}>
      <View style={styles.scrim}>
        <View style={styles.row}>
          <View style={styles.side}>
            {onBack ? (
              <Pressable
                onPress={onBack}
                hitSlop={HIT}
                accessibilityRole="button"
                accessibilityLabel="Go back"
                style={styles.iconButton}>
                <ArrowLeft size={24} color={theme.colors.text.inverse} strokeWidth={1.5} />
              </Pressable>
            ) : null}
          </View>

          <View style={styles.center}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>

          <View style={styles.sideRight}>
            {rightSlot ? (
              rightSlot
            ) : actionLabel && onAction ? (
              <Pressable
                onPress={onAction}
                hitSlop={HIT}
                accessibilityRole="button"
                accessibilityLabel={actionLabel}
                style={styles.actionButton}>
                <Text style={styles.actionLabel} numberOfLines={1}>
                  {actionLabel}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: HEADER_TOP_PAD,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary,
  },
  scrim: { backgroundColor: theme.colors.ui.scrim },
  row: {
    minHeight: HEADER_BODY_H,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  side: { width: TOUCH_MIN, alignItems: 'flex-start', justifyContent: 'center' },
  sideRight: {
    minWidth: TOUCH_MIN,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  center: { flex: 1, paddingHorizontal: theme.spacing.sm },
  iconButton: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    color: theme.colors.text.inverse,
  },
  subtitle: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.inverseSoft,
    marginTop: 2,
  },
  actionButton: {
    height: TOUCH_MIN,
    minWidth: TOUCH_MIN,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(250,250,250,0.45)',
  },
  actionLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: theme.colors.text.inverse,
  },
});

export default React.memo(ScreenHeader);
