import React, { useEffect, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import assets from '../assets';
import { LengthUnit } from '../utils/units';
import DimensionControl from './DimensionControl';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

export interface RectangleRoomSheetProps {
  visible: boolean;
  existingSurfaceCount: number;
  displayUnit: LengthUnit;
  reduceMotion?: boolean;
  onApply: (lengthM: number, widthM: number, heightM: number) => void;
  onCancel: () => void;
}

/** Creates four walls (length, width, length, width) at one common height. */
function RectangleRoomSheet({
  visible,
  existingSurfaceCount,
  displayUnit,
  reduceMotion,
  onApply,
  onCancel,
}: RectangleRoomSheetProps) {
  const [lengthM, setLengthM] = useState<number | null>(4);
  const [widthM, setWidthM] = useState<number | null>(3);
  const [heightM, setHeightM] = useState<number | null>(2.5);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (visible) {
      setConfirming(false);
    }
  }, [visible]);

  const ready = lengthM != null && widthM != null && heightM != null;
  const replaces = existingSurfaceCount > 0;

  const commit = () => {
    if (!ready) {
      return;
    }
    onApply(lengthM as number, widthM as number, heightM as number);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable
          style={styles.backdropFill}
          accessibilityLabel="Close"
          onPress={onCancel}
        />
        <View style={styles.sheet}>
          <View style={styles.headRow}>
            <View style={styles.headText}>
              <Text style={styles.title}>Rectangular room</Text>
              <Text style={styles.helper}>
                Four walls are created at one common height.
              </Text>
            </View>
            <Image
              source={assets.sprite2}
              style={styles.art}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          </View>

          {confirming ? (
            <View style={styles.confirmBox}>
              <Text style={styles.confirmText}>
                This replaces {existingSurfaceCount} existing wall
                {existingSurfaceCount === 1 ? '' : 's'} and any openings
                attached to them.
              </Text>
              <PrimaryButton
                label="REPLACE WALLS"
                onPress={commit}
                reduceMotion={reduceMotion}
              />
              <SecondaryButton
                label="Keep my walls"
                onPress={() => setConfirming(false)}
                reduceMotion={reduceMotion}
              />
            </View>
          ) : (
            <>
              <DimensionControl
                label="Room length"
                valueM={lengthM}
                displayUnit={displayUnit}
                reduceMotion={reduceMotion}
                onCommit={setLengthM}
              />
              <DimensionControl
                label="Room width"
                valueM={widthM}
                displayUnit={displayUnit}
                reduceMotion={reduceMotion}
                onCommit={setWidthM}
              />
              <DimensionControl
                label="Wall height"
                valueM={heightM}
                displayUnit={displayUnit}
                reduceMotion={reduceMotion}
                onCommit={setHeightM}
              />
              <Text style={styles.note}>
                Ceiling length and width are filled in too. Ceiling paint stays
                switched off until you choose it.
              </Text>
              <PrimaryButton
                label="APPLY DIMENSIONS"
                onPress={replaces ? () => setConfirming(true) : commit}
                disabled={!ready}
                reduceMotion={reduceMotion}
              />
              <SecondaryButton
                label="Cancel"
                onPress={onCancel}
                reduceMotion={reduceMotion}
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  backdropFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.ui.overlay,
  },
  sheet: {
    maxHeight: '85%',
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.card,
    borderTopRightRadius: theme.radius.card,
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  headText: { flex: 1, minWidth: 0 },
  art: { width: 64, height: 64 },
  title: {
    fontSize: theme.typography.cardHeading.fontSize,
    lineHeight: theme.typography.cardHeading.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  helper: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.tertiary,
  },
  note: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.tertiary,
  },
  confirmBox: { gap: theme.spacing.md },
  confirmText: {
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
});

export default React.memo(RectangleRoomSheet);
