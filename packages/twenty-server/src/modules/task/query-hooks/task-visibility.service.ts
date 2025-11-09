import { Injectable } from '@nestjs/common';

import { AuthContext } from 'src/engine/core-modules/auth/types/auth-context.type';
import { UserRoleService } from 'src/engine/metadata-modules/user-role/user-role.service';
import { ADMIN_ROLE } from 'src/engine/workspace-manager/workspace-sync-metadata/standard-roles/roles/admin-role';
import { type ObjectRecordFilter } from 'src/engine/api/graphql/workspace-query-builder/interfaces/object-record.interface';

import { isDefined } from 'twenty-shared/utils';

@Injectable()
export class TaskVisibilityService {
  constructor(private readonly userRoleService: UserRoleService) {}

  public async getAssigneeFilterForNonAdminUser(
    authContext: AuthContext,
  ): Promise<ObjectRecordFilter | undefined> {
    const { userWorkspaceId, workspace, workspaceMemberId } = authContext;

    if (!isDefined(userWorkspaceId) || !isDefined(workspace)) {
      return undefined;
    }

    const roles = await this.userRoleService.getRolesByUserWorkspaces({
      userWorkspaceIds: [userWorkspaceId],
      workspaceId: workspace.id,
    });

    const userRole = roles.get(userWorkspaceId)?.[0];

    if (userRole?.standardId === ADMIN_ROLE.standardId) {
      return undefined;
    }

    return {
      assigneeId: {
        eq: workspaceMemberId,
      },
    };
  }
}

