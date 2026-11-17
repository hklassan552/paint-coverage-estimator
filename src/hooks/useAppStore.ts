import { useCallback, useMemo, useRef, useState } from 'react';
import { ColorNote, Room, Settings } from '../game/types';
import { createRoom, duplicateRoom, newId, nextRoomName } from '../game/rooms';

export interface AppStore {
  rooms: Room[];
  notes: ColorNote[];
  settings: Settings;
  startRoom: () => Room;
  addRoom: (room: Room) => Room;
  updateRoom: (id: string, patch: Partial<Room>, invalidates: boolean) => void;
  renameRoom: (id: string, name: string) => void;
  duplicate: (id: string) => void;
  deleteRoom: (id: string) => void;
  upsertNote: (note: ColorNote) => ColorNote;
  deleteNote: (id: string) => void;
  linkNote: (roomId: string, noteId: string | null) => void;
  setSettings: (patch: Partial<Settings>) => void;
  getRoom: (id: string | null) => Room | null;
}

const DEFAULT_SETTINGS: Settings = {
  lengthUnit: 'metres',
  hapticsEnabled: true,
  reduceMotionEnabled: false,
};

/**
 * In-memory application store. A single source of truth held above the screen
 * tree; screens receive only the slices they need, so no component subscribes
 * to data it does not render.
 */
export function useAppStore(): AppStore {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [notes, setNotes] = useState<ColorNote[]>([]);
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);

  // Kept in a ref so callbacks can read current rooms without re-subscribing.
  const roomsRef = useRef<Room[]>(rooms);
  roomsRef.current = rooms;

  const sortRooms = (list: Room[]) =>
    list.slice().sort((a, b) => b.updatedAt - a.updatedAt);

  const addRoom = useCallback((room: Room) => {
    setRooms(prev => sortRooms([room, ...prev]));
    return room;
  }, []);

  const startRoom = useCallback(() => {
    const room = createRoom(nextRoomName(roomsRef.current));
    setRooms(prev => sortRooms([room, ...prev]));
    return room;
  }, []);

  const updateRoom = useCallback(
    (id: string, patch: Partial<Room>, invalidates: boolean) => {
      setRooms(prev =>
        sortRooms(
          prev.map(r =>
            r.id === id
              ? {
                  ...r,
                  ...patch,
                  updatedAt: Date.now(),
                  calculationRevision: invalidates
                    ? r.calculationRevision + 1
                    : r.calculationRevision,
                }
              : r,
          ),
        ),
      );
    },
    [],
  );

  const renameRoom = useCallback(
    (id: string, name: string) => {
      updateRoom(id, { name }, false);
    },
    [updateRoom],
  );

  const duplicate = useCallback((id: string) => {
    setRooms(prev => {
      const source = prev.find(r => r.id === id);
      if (!source) {
        return prev;
      }
      return sortRooms([duplicateRoom(source, prev), ...prev]);
    });
  }, []);

  const deleteRoom = useCallback((id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
  }, []);

  const upsertNote = useCallback((note: ColorNote) => {
    const stamped: ColorNote = {
      ...note,
      id: note.id || newId('note'),
      updatedAt: Date.now(),
      createdAt: note.createdAt || Date.now(),
    };
    setNotes(prev => {
      const exists = prev.some(n => n.id === stamped.id);
      const next = exists
        ? prev.map(n => (n.id === stamped.id ? stamped : n))
        : [stamped, ...prev];
      return next.slice().sort((a, b) => b.updatedAt - a.updatedAt);
    });
    return stamped;
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    setRooms(prev =>
      prev.map(r =>
        r.linkedColorNoteId === id ? { ...r, linkedColorNoteId: null } : r,
      ),
    );
  }, []);

  const linkNote = useCallback((roomId: string, noteId: string | null) => {
    setRooms(prev =>
      prev.map(r => (r.id === roomId ? { ...r, linkedColorNoteId: noteId } : r)),
    );
  }, []);

  const setSettings = useCallback((patch: Partial<Settings>) => {
    setSettingsState(prev => ({ ...prev, ...patch }));
  }, []);

  const getRoom = useCallback(
    (id: string | null) =>
      id ? roomsRef.current.find(r => r.id === id) || null : null,
    [],
  );

  return useMemo(
    () => ({
      rooms,
      notes,
      settings,
      startRoom,
      addRoom,
      updateRoom,
      renameRoom,
      duplicate,
      deleteRoom,
      upsertNote,
      deleteNote,
      linkNote,
      setSettings,
      getRoom,
    }),
    [
      rooms,
      notes,
      settings,
      startRoom,
      addRoom,
      updateRoom,
      renameRoom,
      duplicate,
      deleteRoom,
      upsertNote,
      deleteNote,
      linkNote,
      setSettings,
      getRoom,
    ],
  );
}
