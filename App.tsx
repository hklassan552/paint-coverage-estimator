/**
 * Paint Coverage Estimator — application shell.
 *
 * This file owns navigation and the shared state only; every measurement and
 * volume rule lives in src/game. Screen keys keep the factory names (menu,
 * game, gameover) while the product UI uses the household wording.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import theme from './src/constants/theme';
import { EditorStep, TRANSITION_MS } from './src/constants/config';
import { ColorNote, Room, SavedResult } from './src/game/types';
import { computeResult, createExampleRoom } from './src/game/rooms';
import { useAppStore } from './src/hooks/useAppStore';
import { useReducedMotion } from './src/hooks/useReducedMotion';
import { useHaptics } from './src/hooks/useHaptics';
import { ColorNoteDraft } from './src/components/ColorNoteEditorSheet';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import OpeningsScreen from './src/screens/OpeningsScreen';
import CoatsScreen from './src/screens/CoatsScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import ColorNotesScreen from './src/screens/ColorNotesScreen';
import SettingsScreen from './src/screens/SettingsScreen';

type Screen =
  | 'loader'
  | 'menu'
  | 'game'
  | 'openings'
  | 'coats'
  | 'gameover'
  | 'colorNotes'
  | 'settings';

function App(): React.JSX.Element {
  const store = useAppStore();
  const deviceReduceMotion = useReducedMotion();
  const reduceMotion = deviceReduceMotion || store.settings.reduceMotionEnabled;
  const haptic = useHaptics(store.settings.hapticsEnabled);

  const [screen, setScreen] = useState<Screen>('loader');
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [pendingResult, setPendingResult] = useState<SavedResult | null>(null);
  const [returnTo, setReturnTo] = useState<Screen>('menu');
  const [noteScopeRoomId, setNoteScopeRoomId] = useState<string | null>(null);

  const fade = useRef(new Animated.Value(1)).current;

  // Screen crossfade — opacity only, so the native driver is safe here.
  useEffect(() => {
    if (reduceMotion) {
      fade.setValue(1);
      return;
    }
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: TRANSITION_MS,
      useNativeDriver: true,
    }).start();
  }, [screen, fade, reduceMotion]);

  const activeRoom: Room | null = useMemo(
    () => store.rooms.find(r => r.id === activeRoomId) || null,
    [store.rooms, activeRoomId],
  );

  const linkedNote: ColorNote | null = useMemo(() => {
    if (!activeRoom || !activeRoom.linkedColorNoteId) {
      return null;
    }
    return store.notes.find(n => n.id === activeRoom.linkedColorNoteId) || null;
  }, [activeRoom, store.notes]);

  const goBack = useCallback((): boolean => {
    switch (screen) {
      case 'loader':
        return true;
      case 'menu':
        return false; // normal Android exit
      case 'game':
        setScreen('menu');
        return true;
      case 'openings':
        setScreen('game');
        return true;
      case 'coats':
        setScreen('openings');
        return true;
      case 'gameover':
        setScreen('coats');
        return true;
      case 'colorNotes':
      case 'settings':
        setScreen(returnTo);
        return true;
      default:
        return false;
    }
  }, [screen, returnTo]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', goBack);
    return () => sub.remove();
  }, [goBack]);

  const updateActiveRoom = useCallback(
    (patch: Partial<Room>, invalidates: boolean) => {
      if (!activeRoomId) {
        return;
      }
      store.updateRoom(activeRoomId, patch, invalidates);
    },
    [activeRoomId, store],
  );

  const handleStart = useCallback(() => {
    const room = store.startRoom();
    setActiveRoomId(room.id);
    setPendingResult(null);
    setScreen('game');
  }, [store]);

  const handleTryExample = useCallback(() => {
    const room = store.addRoom(createExampleRoom());
    setActiveRoomId(room.id);
    setPendingResult(null);
    setScreen('game');
  }, [store]);

  const handleEditRoom = useCallback((roomId: string) => {
    setActiveRoomId(roomId);
    setPendingResult(null);
    setScreen('game');
  }, []);

  const handleViewResult = useCallback(
    (roomId: string) => {
      const room = store.getRoom(roomId);
      if (!room || !room.savedResult) {
        return;
      }
      setActiveRoomId(roomId);
      setPendingResult(room.savedResult);
      setScreen('gameover');
    },
    [store],
  );

  const handleCalculate = useCallback(() => {
    if (!activeRoom) {
      return;
    }
    const result = computeResult(activeRoom);
    if (!result) {
      // Never fabricate a zero-litre plan: send the user back to the surfaces.
      setScreen('game');
      return;
    }
    setPendingResult(result);
    setScreen('gameover');
  }, [activeRoom]);

  const handleSaveEstimate = useCallback(() => {
    if (!activeRoomId || !pendingResult) {
      return;
    }
    store.updateRoom(activeRoomId, { savedResult: pendingResult }, false);
  }, [activeRoomId, pendingResult, store]);

  const handleEditStep = useCallback((step: EditorStep) => {
    if (step === 'walls') {
      setScreen('game');
    } else if (step === 'openings') {
      setScreen('openings');
    } else if (step === 'coats') {
      setScreen('coats');
    } else {
      setScreen('gameover');
    }
  }, []);

  const handleSaveNote = useCallback(
    (draft: ColorNoteDraft): ColorNote => {
      const note: ColorNote = {
        id: draft.id || '',
        name: draft.name,
        colorCode: draft.colorCode,
        brand: draft.brand || undefined,
        note: draft.note || undefined,
        createdAt: 0,
        updatedAt: 0,
      };
      const saved = store.upsertNote(note);
      haptic();
      return saved;
    },
    [store, haptic],
  );

  const openNotes = useCallback(
    (from: Screen, roomId: string | null) => {
      setReturnTo(from);
      setNoteScopeRoomId(roomId);
      setScreen('colorNotes');
    },
    [],
  );

  const openSettings = useCallback((from: Screen) => {
    setReturnTo(from);
    setScreen('settings');
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case 'loader':
        return (
          <LoaderScreen
            reduceMotion={reduceMotion}
            onReady={() => setScreen('menu')}
          />
        );

      case 'menu':
        return (
          <MenuScreen
            rooms={store.rooms}
            displayUnit={store.settings.lengthUnit}
            reduceMotion={reduceMotion}
            onStart={handleStart}
            onTryExample={handleTryExample}
            onEditRoom={handleEditRoom}
            onViewResult={handleViewResult}
            onRenameRoom={store.renameRoom}
            onDuplicateRoom={store.duplicate}
            onDeleteRoom={store.deleteRoom}
            onNotes={() => openNotes('menu', null)}
            onSettings={() => openSettings('menu')}
          />
        );

      case 'game':
        if (!activeRoom) {
          return null;
        }
        return (
          <GameScreen
            room={activeRoom}
            displayUnit={store.settings.lengthUnit}
            reduceMotion={reduceMotion}
            onUpdateRoom={updateActiveRoom}
            onRename={name => updateActiveRoom({ name }, false)}
            onBack={() => setScreen('menu')}
            onContinue={() => setScreen('openings')}
          />
        );

      case 'openings':
        if (!activeRoom) {
          return null;
        }
        return (
          <OpeningsScreen
            room={activeRoom}
            displayUnit={store.settings.lengthUnit}
            reduceMotion={reduceMotion}
            onUpdateRoom={updateActiveRoom}
            onBack={() => setScreen('game')}
            onContinue={() => setScreen('coats')}
            onStep={handleEditStep}
          />
        );

      case 'coats':
        if (!activeRoom) {
          return null;
        }
        return (
          <CoatsScreen
            room={activeRoom}
            displayUnit={store.settings.lengthUnit}
            reduceMotion={reduceMotion}
            onUpdateRoom={updateActiveRoom}
            onBack={() => setScreen('openings')}
            onCalculate={handleCalculate}
            onUnits={() => openSettings('coats')}
            onStep={handleEditStep}
          />
        );

      case 'gameover':
        if (!activeRoom || !pendingResult) {
          return null;
        }
        return (
          <GameOverScreen
            room={activeRoom}
            result={pendingResult}
            linkedNote={linkedNote}
            displayUnit={store.settings.lengthUnit}
            reduceMotion={reduceMotion}
            hapticsEnabled={store.settings.hapticsEnabled}
            onSave={handleSaveEstimate}
            onAgain={() => setScreen('game')}
            onMenu={() => setScreen('menu')}
            onBack={() => setScreen('coats')}
            onEditStep={handleEditStep}
            onColorNote={() => openNotes('gameover', activeRoom.id)}
            onHaptic={haptic}
          />
        );

      case 'colorNotes':
        return (
          <ColorNotesScreen
            notes={store.notes}
            rooms={store.rooms}
            scopedRoom={
              noteScopeRoomId
                ? store.rooms.find(r => r.id === noteScopeRoomId) || null
                : null
            }
            reduceMotion={reduceMotion}
            onSaveNote={handleSaveNote}
            onDeleteNote={store.deleteNote}
            onLinkNote={store.linkNote}
            onBack={() => setScreen(returnTo)}
          />
        );

      case 'settings':
        return (
          <SettingsScreen
            settings={store.settings}
            reduceMotion={reduceMotion}
            onChange={store.setSettings}
            onDone={() => setScreen(returnTo)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Animated.View
        pointerEvents="box-none"
        style={[styles.root, { opacity: fade }]}>
        {renderScreen()}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
});

export default App;
