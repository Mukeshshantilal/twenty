import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { RecoilRoot, useSetRecoilState } from 'recoil';

import { useEndRecordDrag } from '@/object-record/record-drag/hooks/useEndRecordDrag';
import { draggedRecordIdsComponentState } from '@/object-record/record-drag/states/draggedRecordIdsComponentState';
import { isMultiDragActiveComponentState } from '@/object-record/record-drag/states/isMultiDragActiveComponentState';
import { originalDragSelectionComponentState } from '@/object-record/record-drag/states/originalDragSelectionComponentState';
import { primaryDraggedRecordIdComponentState } from '@/object-record/record-drag/states/primaryDraggedRecordIdComponentState';
import { useRecoilComponentValue } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValue';

describe('useEndRecordDrag', () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <RecoilRoot>{children}</RecoilRoot>
  );

  describe('Board context', () => {
    it('should clear all board drag states', () => {
      const instanceId = 'test-instance';

      const { result } = renderHook(
        () => {
          const isMultiDragActive = useRecoilComponentValue(
            isMultiDragActiveComponentState,
            instanceId,
          );
          const draggedRecordIds = useRecoilComponentValue(
            draggedRecordIdsComponentState,
            instanceId,
          );
          const primaryDraggedRecordId = useRecoilComponentValue(
            primaryDraggedRecordIdComponentState,
            instanceId,
          );
          const originalSelection = useRecoilComponentValue(
            originalDragSelectionComponentState,
            instanceId,
          );

          const setIsMultiDragActive = useSetRecoilState(
            isMultiDragActiveComponentState.atomFamily({
              instanceId,
            }),
          );
          const setDraggedRecordIds = useSetRecoilState(
            draggedRecordIdsComponentState.atomFamily({
              instanceId,
            }),
          );
          const setPrimaryDraggedRecordId = useSetRecoilState(
            primaryDraggedRecordIdComponentState.atomFamily({
              instanceId,
            }),
          );
          const setOriginalSelection = useSetRecoilState(
            originalDragSelectionComponentState.atomFamily({
              instanceId,
            }),
          );

          const { endRecordDrag } = useEndRecordDrag();

          return {
            endRecordDrag,
            isMultiDragActive,
            draggedRecordIds,
            primaryDraggedRecordId,
            originalSelection,
            setIsMultiDragActive,
            setDraggedRecordIds,
            setPrimaryDraggedRecordId,
            setOriginalSelection,
          };
        },
        { wrapper: Wrapper },
      );

      act(() => {
        result.current.setIsMultiDragActive(true);
        result.current.setDraggedRecordIds(['record-1', 'record-2']);
        result.current.setPrimaryDraggedRecordId('record-1');
        result.current.setOriginalSelection([
          'record-1',
          'record-2',
          'record-3',
        ]);
      });

      expect(result.current.isMultiDragActive).toBe(true);
      expect(result.current.draggedRecordIds).toEqual(['record-1', 'record-2']);
      expect(result.current.primaryDraggedRecordId).toBe('record-1');
      expect(result.current.originalSelection).toEqual([
        'record-1',
        'record-2',
        'record-3',
      ]);

      act(() => {
        result.current.endRecordDrag();
      });

      expect(result.current.isMultiDragActive).toBe(false);
      expect(result.current.draggedRecordIds).toEqual([]);
      expect(result.current.primaryDraggedRecordId).toBeNull();
      expect(result.current.originalSelection).toEqual([]);
    });
  });

  describe('Table context', () => {
    it('should clear all table drag states', () => {
      const instanceId = 'test-instance';

      const { result } = renderHook(
        () => {
          const isMultiDragActive = useRecoilComponentValue(
            isMultiDragActiveComponentState,
            instanceId,
          );
          const draggedRecordIds = useRecoilComponentValue(
            draggedRecordIdsComponentState,
            instanceId,
          );
          const primaryDraggedRecordId = useRecoilComponentValue(
            primaryDraggedRecordIdComponentState,
            instanceId,
          );
          const originalSelection = useRecoilComponentValue(
            originalDragSelectionComponentState,
            instanceId,
          );

          const setIsMultiDragActive = useSetRecoilState(
            isMultiDragActiveComponentState.atomFamily({
              instanceId,
            }),
          );
          const setDraggedRecordIds = useSetRecoilState(
            draggedRecordIdsComponentState.atomFamily({
              instanceId,
            }),
          );
          const setPrimaryDraggedRecordId = useSetRecoilState(
            primaryDraggedRecordIdComponentState.atomFamily({
              instanceId,
            }),
          );
          const setOriginalSelection = useSetRecoilState(
            originalDragSelectionComponentState.atomFamily({
              instanceId,
            }),
          );

          const { endRecordDrag } = useEndRecordDrag();

          return {
            endRecordDrag,
            isMultiDragActive,
            draggedRecordIds,
            primaryDraggedRecordId,
            originalSelection,
            setIsMultiDragActive,
            setDraggedRecordIds,
            setPrimaryDraggedRecordId,
            setOriginalSelection,
          };
        },
        { wrapper: Wrapper },
      );

      act(() => {
        result.current.setIsMultiDragActive(true);
        result.current.setDraggedRecordIds(['record-1', 'record-2']);
        result.current.setPrimaryDraggedRecordId('record-1');
        result.current.setOriginalSelection([
          'record-1',
          'record-2',
          'record-3',
        ]);
      });

      expect(result.current.isMultiDragActive).toBe(true);
      expect(result.current.draggedRecordIds).toEqual(['record-1', 'record-2']);
      expect(result.current.primaryDraggedRecordId).toBe('record-1');
      expect(result.current.originalSelection).toEqual([
        'record-1',
        'record-2',
        'record-3',
      ]);

      act(() => {
        result.current.endRecordDrag();
      });

      expect(result.current.isMultiDragActive).toBe(false);
      expect(result.current.draggedRecordIds).toEqual([]);
      expect(result.current.primaryDraggedRecordId).toBeNull();
      expect(result.current.originalSelection).toEqual([]);
    });
  });
});
