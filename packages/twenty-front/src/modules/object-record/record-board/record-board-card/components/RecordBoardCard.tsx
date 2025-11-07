import { recordIndexActionMenuDropdownPositionComponentState } from '@/action-menu/states/recordIndexActionMenuDropdownPositionComponentState';
import { getActionMenuDropdownIdFromActionMenuId } from '@/action-menu/utils/getActionMenuDropdownIdFromActionMenuId';
import { getActionMenuIdFromRecordIndexId } from '@/action-menu/utils/getActionMenuIdFromRecordIndexId';
import { RecordBoardCardContext } from '@/object-record/record-board/record-board-card/contexts/RecordBoardCardContext';
import { isRecordBoardCardActiveComponentFamilyState } from '@/object-record/record-board/states/isRecordBoardCardActiveComponentFamilyState';
import { isRecordBoardCardFocusedComponentFamilyState } from '@/object-record/record-board/states/isRecordBoardCardFocusedComponentFamilyState';
import { isRecordBoardCardSelectedComponentFamilyState } from '@/object-record/record-board/states/isRecordBoardCardSelectedComponentFamilyState';

import { useActiveRecordBoardCard } from '@/object-record/record-board/hooks/useActiveRecordBoardCard';
import { useFocusedRecordBoardCard } from '@/object-record/record-board/hooks/useFocusedRecordBoardCard';
import { RecordBoardCardBody } from '@/object-record/record-board/record-board-card/components/RecordBoardCardBody';
import { RecordBoardCardHeader } from '@/object-record/record-board/record-board-card/components/RecordBoardCardHeader';
import { RECORD_BOARD_CARD_CLICK_OUTSIDE_ID } from '@/object-record/record-board/record-board-card/constants/RecordBoardCardClickOutsideId';
import { RecordBoardCardComponentInstanceContext } from '@/object-record/record-board/record-board-card/states/contexts/RecordBoardCardComponentInstanceContext';
import { recordBoardCardIsExpandedComponentState } from '@/object-record/record-board/record-board-card/states/recordBoardCardIsExpandedComponentState';
import { RecordBoardComponentInstanceContext } from '@/object-record/record-board/states/contexts/RecordBoardComponentInstanceContext';
import { RecordCard } from '@/object-record/record-card/components/RecordCard';
import { isDraggingRecordComponentState } from '@/object-record/record-drag/states/isDraggingRecordComponentState';
import { originalDragSelectionComponentState } from '@/object-record/record-drag/states/originalDragSelectionComponentState';
import { primaryDraggedRecordIdComponentState } from '@/object-record/record-drag/states/primaryDraggedRecordIdComponentState';
import { useOpenRecordFromIndexView } from '@/object-record/record-index/hooks/useOpenRecordFromIndexView';
import { useOpenDropdown } from '@/ui/layout/dropdown/hooks/useOpenDropdown';
import { useScrollWrapperHTMLElement } from '@/ui/utilities/scroll/hooks/useScrollWrapperHTMLElement';
import { useAvailableComponentInstanceIdOrThrow } from '@/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceIdOrThrow';
import { useRecoilComponentFamilyState } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentFamilyState';
import { useRecoilComponentFamilyValue } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentFamilyValue';
import { useRecoilComponentState } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentState';
import { useRecoilComponentValue } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValue';
import { useSetRecoilComponentState } from '@/ui/utilities/state/component-state/hooks/useSetRecoilComponentState';
import { useGetCurrentViewOnly } from '@/views/hooks/useGetCurrentViewOnly';
import styled from '@emotion/styled';
import { useContext } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDebouncedCallback } from 'use-debounce';

const StyledCardContainer = styled.div<{ isPrimaryMultiDrag?: boolean }>`
  position: relative;
  ${({ isPrimaryMultiDrag }) =>
    isPrimaryMultiDrag &&
    `
    transform: scale(1.02);
    z-index: 10;
  `}
`;

const StyledRecordBoardCardStackCard = styled.div<{ offset: number }>`
  position: absolute;
  top: ${({ offset }) => (offset === 1 ? 2 : (offset - 1) * 4 + 2)}px;
  left: 0;
  right: 0;
  height: 100%;
  background-color: ${({ theme }) => theme.accent.tertiary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  z-index: ${({ offset }) => -offset};
`;

const StyledBoardCardWrapper = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  width: 100%;
`;

export const RecordBoardCard = () => {
  const { recordId, rowIndex, columnIndex } = useContext(
    RecordBoardCardContext,
  );

  const recordBoardId = useAvailableComponentInstanceIdOrThrow(
    RecordBoardComponentInstanceContext,
  );

  const isDraggingRecord = useRecoilComponentValue(
    isDraggingRecordComponentState,
  );

  const primaryDraggedRecordId = useRecoilComponentValue(
    primaryDraggedRecordIdComponentState,
  );

  const originalDragSelection = useRecoilComponentValue(
    originalDragSelectionComponentState,
  );

  const isPrimaryMultiDrag =
    isDraggingRecord &&
    recordId === primaryDraggedRecordId &&
    originalDragSelection.length > 1;

  const isSecondaryDragged =
    isDraggingRecord &&
    originalDragSelection.includes(recordId) &&
    recordId !== primaryDraggedRecordId;

  const { currentView } = useGetCurrentViewOnly();

  const isCompactModeActive = currentView?.isCompact ?? false;

  const [isCardExpanded, setIsCardExpanded] = useRecoilComponentState(
    recordBoardCardIsExpandedComponentState,
    `record-board-card-${recordId}`,
  );

  const [isCurrentCardSelected, setIsCurrentCardSelected] =
    useRecoilComponentFamilyState(
      isRecordBoardCardSelectedComponentFamilyState,
      recordId,
    );

  const isCurrentCardFocused = useRecoilComponentFamilyValue(
    isRecordBoardCardFocusedComponentFamilyState,
    {
      rowIndex,
      columnIndex,
    },
  );

  const isCurrentCardActive = useRecoilComponentFamilyValue(
    isRecordBoardCardActiveComponentFamilyState,
    {
      rowIndex,
      columnIndex,
    },
  );

  const actionMenuId = getActionMenuIdFromRecordIndexId(recordBoardId);

  const actionMenuDropdownId =
    getActionMenuDropdownIdFromActionMenuId(actionMenuId);

  const setActionMenuDropdownPosition = useSetRecoilComponentState(
    recordIndexActionMenuDropdownPositionComponentState,
    actionMenuDropdownId,
  );

  const { openDropdown } = useOpenDropdown();

  const { openRecordFromIndexView } = useOpenRecordFromIndexView();
  const { activateBoardCard } = useActiveRecordBoardCard(recordBoardId);
  const { unfocusBoardCard } = useFocusedRecordBoardCard(recordBoardId);

  const handleContextMenuOpen = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsCurrentCardSelected(true);
    setActionMenuDropdownPosition({
      x: event.clientX,
      y: event.clientY,
    });
    openDropdown({
      dropdownComponentInstanceIdFromProps: actionMenuDropdownId,
      globalHotkeysConfig: {
        enableGlobalHotkeysWithModifiers: true,
        enableGlobalHotkeysConflictingWithKeyboard: false,
      },
    });
  };

  const handleCardClick = () => {
    activateBoardCard({ rowIndex, columnIndex });
    unfocusBoardCard();
    openRecordFromIndexView({ recordId });
  };

  const onMouseLeaveBoard = useDebouncedCallback(() => {
    if (isCompactModeActive && isCardExpanded) {
      setIsCardExpanded(false);
    }
  }, 800);

  const { scrollWrapperHTMLElement } = useScrollWrapperHTMLElement();

  const { ref: cardRef } = useInView({
    root: scrollWrapperHTMLElement,
    rootMargin: '1000px',
  });

  return (
    <RecordBoardCardComponentInstanceContext.Provider
      value={{
        instanceId: `record-board-card-${recordId}`,
      }}
    >
      <StyledBoardCardWrapper
        data-click-outside-id={RECORD_BOARD_CARD_CLICK_OUTSIDE_ID}
        onContextMenu={handleContextMenuOpen}
      >
        {/* <InView> */}
        <StyledCardContainer isPrimaryMultiDrag={isPrimaryMultiDrag}>
          {isPrimaryMultiDrag &&
            Array.from({
              length: Math.min(5, originalDragSelection.length - 1),
            }).map((_, index) => (
              <StyledRecordBoardCardStackCard key={index} offset={index + 1} />
            ))}

          <RecordCard
            ref={cardRef}
            data-selected={isCurrentCardSelected}
            data-focused={isCurrentCardFocused}
            data-active={isCurrentCardActive}
            onMouseLeave={onMouseLeaveBoard}
            onClick={handleCardClick}
            isPrimaryMultiDrag={isPrimaryMultiDrag}
            isSecondaryDragged={isSecondaryDragged}
          >
            <RecordBoardCardHeader />
            {/* <AnimatedEaseInOut
              isOpen={isCardExpanded || !isCompactModeActive}
              initial={false}
            > */}
            <RecordBoardCardBody />
            {/* </AnimatedEaseInOut> */}
          </RecordCard>
        </StyledCardContainer>
        {/* <RecordBoardCardCellHoveredPortal /> */}
        {/* <RecordBoardCardCellEditModePortal /> */}
        {/* </InView> */}
      </StyledBoardCardWrapper>
    </RecordBoardCardComponentInstanceContext.Provider>
  );
};
