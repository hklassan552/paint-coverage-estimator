import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { MoreHorizontal, PaintRoller } from 'lucide-react-native';
import theme from '../constants/theme';
import { TOUCH_MIN } from '../constants/config';
import { LengthUnit } from '../utils/units';
import { ceil2, formatArea, formatLiters } from '../utils/format';
import { Room } from '../game/types';
import { STATUS_LABEL, roomStatus } from '../game/rooms';
import { areaBreakdown } from '../game/estimate';
import { usePressScale } from '../hooks/usePressScale';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export interface RoomCardProps {
  room: Room;
  displayUnit: LengthUnit;
  reduceMotion?: boolean;
  onEdit: () => void;
  onViewResult: () => void;
  onActions: () => void;
}

function RoomCard({
  room,
  displayUnit,
  reduceMotion,
  onEdit,
  onViewResult,
  onActions,
}: RoomCardProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(!!reduceMotion);
  const status = roomStatus(room);
  const area = areaBreakdown(room);
  const scope =
    room.walls.length > 0
      ? room.ceiling.enabled
        ? room.walls.length + ' walls + ceiling'
        : room.walls.length + ' walls'
      : 'Ceiling only';
  const resultCurrent = status === 'estimated' && !!room.savedResult;

  return (
    <Pressable
      onPress={onEdit}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={room.name + ', ' + STATUS_LABEL[status]}
      accessibilityHint="Opens the wall measurements"
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.card, { transform: [{ scale }] }]}>
        <View style={styles.topRow}>
          <View style={styles.iconWrap}>
            <PaintRoller size={22} color={theme.colors.primary} strokeWidth={1.5} />
          </View>
          <View style={styles.titleCol}>
            <Text style={styles.name} numberOfLines={1}>
              {room.name}
            </Text>
            <Text style={styles.scope} numberOfLines={1}>
              {scope}
            </Text>
          </View>
          <Pressable
            onPress={onActions}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel={'Room actions for ' + room.name}
            style={styles.actionsButton}>
            <MoreHorizontal size={24} color={theme.colors.text.secondary} strokeWidth={1.5} />
          </Pressable>
        </View>

        <View style={styles.metaRow}>
          <View
            style={[
              styles.statusPill,
              status === 'estimated'
                ? styles.statusEstimated
                : status === 'needs-update'
                ? styles.statusNeedsUpdate
                : styles.statusDraft,
            ]}>
            <Text style={styles.statusText}>{STATUS_LABEL[status]}</Text>
          </View>
          {area.paintableM2 > 0 ? (
            <Text style={styles.areaText} numberOfLines={1}>
              {formatArea(area.paintableM2, displayUnit)} paintable
            </Text>
          ) : null}
        </View>

        {resultCurrent && room.savedResult ? (
          <View style={styles.resultRow}>
            <Text style={styles.resultValue}>
              {formatLiters(ceil2(room.savedResult.requiredLiters))}
            </Text>
            <Pressable
              onPress={onViewResult}
              hitSlop={HIT}
              accessibilityRole="button"
              accessibilityLabel={'View result for ' + room.name}
              style={styles.viewResult}>
              <Text style={styles.viewResultLabel}>View result</Text>
            </Pressable>
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%' },
  card: {
    width: '100%',
    minHeight: 112,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    ...theme.shadows.card,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.plumTint,
  },
  titleCol: { flex: 1, minWidth: 0 },
  name: {
    fontSize: theme.typography.cardHeading.fontSize,
    lineHeight: theme.typography.cardHeading.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  scope: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.tertiary,
  },
  actionsButton: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  statusPill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
  },
  statusDraft: {
    backgroundColor: 'rgba(221,176,187,0.22)',
    borderColor: theme.colors.secondary,
  },
  statusEstimated: {
    backgroundColor: theme.colors.ui.mintTint,
    borderColor: theme.colors.accent,
  },
  statusNeedsUpdate: {
    backgroundColor: theme.colors.ui.plumTint,
    borderColor: theme.colors.ui.borderStrong,
  },
  statusText: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  areaText: {
    flex: 1,
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.secondary,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.divider,
    paddingTop: theme.spacing.md,
  },
  resultValue: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  viewResult: {
    height: TOUCH_MIN,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
  },
  viewResultLabel: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: 20,
    fontWeight: '700',
    color: theme.colors.primary,
  },
});

export default React.memo(RoomCard);
