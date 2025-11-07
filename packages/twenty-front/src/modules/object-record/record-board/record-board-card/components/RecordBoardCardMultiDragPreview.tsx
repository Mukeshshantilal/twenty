import { RecordBoardCardContext } from '@/object-record/record-board/record-board-card/contexts/RecordBoardCardContext';
import { originalDragSelectionComponentState } from '@/object-record/record-drag/states/originalDragSelectionComponentState';
import { useRecoilComponentValue } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValue';
import styled from '@emotion/styled';
import { useContext } from 'react';
import { NotificationCounter } from 'twenty-ui/navigation';

const StyledNotificationCounter = styled(NotificationCounter)`
  position: absolute;
  top: -7px;
  right: -7px;
  z-index: 1000;
`;

type RecordBoardCardMultiDragPreviewProps = {
  isDragging: boolean;
};

export const RecordBoardCardMultiDragPreview = ({
  isDragging,
}: RecordBoardCardMultiDragPreviewProps) => {
  const { recordId } = useContext(RecordBoardCardContext);

  const originalDragSelection = useRecoilComponentValue(
    originalDragSelectionComponentState,
  );

  const isCurrentCardSelected =
    originalDragSelection.includes(recordId) || false;

  const selectedCount = originalDragSelection.length || 0;

  const shouldShow = isDragging && isCurrentCardSelected && selectedCount > 1;

  if (!shouldShow) {
    return null;
  }

  return <StyledNotificationCounter count={selectedCount} />;
};
