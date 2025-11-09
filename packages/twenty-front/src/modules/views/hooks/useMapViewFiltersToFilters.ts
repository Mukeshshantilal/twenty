import { currentUserState } from '@/auth/states/currentUserState';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { useRecordIndexContextOrThrow } from '@/object-record/record-index/contexts/RecordIndexContext';
import { type RecordFilter } from '@/object-record/record-filter/types/RecordFilter';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { t } from '@lingui/core/macro';
import { useRecoilValue } from 'recoil';
import { type CoreViewFilter } from '~/generated/graphql';
import { ViewFilterOperand } from 'twenty-shared/types';
import { getFilterTypeFromFieldType, isDefined } from 'twenty-shared/utils';

import { type ViewFilter } from '../types/ViewFilter';
import { getFilterableFieldsWithVectorSearch } from '../utils/getFilterableFieldsWithVectorSearch';
import { mapViewFiltersToFilters } from '../utils/mapViewFiltersToFilters';

const LOCKED_ASSIGNEE_FILTER_ID = 'locked-assignee-filter';

export const useMapViewFiltersToFilters = () => {
  const { objectMetadataItem } = useRecordIndexContextOrThrow();
  const currentUser = useRecoilValue(currentUserState);
  const currentWorkspaceMember = useRecoilValue(currentWorkspaceMemberState);

  const mapViewFiltersToRecordFilters = (
    viewFilters: ViewFilter[] | CoreViewFilter[],
  ) => {
    const filterableFieldMetadataItems =
      getFilterableFieldsWithVectorSearch(objectMetadataItem);

    const mappedFilters = mapViewFiltersToFilters(
      viewFilters,
      filterableFieldMetadataItems,
    );

    const isTaskObject =
      objectMetadataItem.nameSingular === CoreObjectNameSingular.Task;
    const isCurrentUserAdmin = currentUser?.canAccessFullAdminPanel;

    if (
      !isTaskObject ||
      isCurrentUserAdmin ||
      !isDefined(currentWorkspaceMember?.id)
    ) {
      return mappedFilters;
    }

    const assigneeField = filterableFieldMetadataItems.find(
      (field) => field.name === 'assignee',
    );

    if (!isDefined(assigneeField)) {
      return mappedFilters;
    }

    const lockedAssigneeFilter: RecordFilter = {
      id: LOCKED_ASSIGNEE_FILTER_ID,
      fieldMetadataId: assigneeField.id,
      value: JSON.stringify({
        isCurrentWorkspaceMemberSelected: true,
        selectedRecordIds: [],
      }),
      displayValue: t`Me`,
      operand: ViewFilterOperand.IS,
      type: getFilterTypeFromFieldType(assigneeField.type),
      label: t`Assignee`,
      isLocked: true,
    };

    const filtersWithoutLockedAssignee = mappedFilters.filter(
      (filter) => filter.id !== LOCKED_ASSIGNEE_FILTER_ID,
    );

    return [lockedAssigneeFilter, ...filtersWithoutLockedAssignee];
  };

  return { mapViewFiltersToRecordFilters };
};
