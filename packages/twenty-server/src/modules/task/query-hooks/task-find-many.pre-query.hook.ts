import { Injectable } from '@nestjs/common';
import merge from 'lodash.merge';

import { type FindManyResolverArgs } from 'src/engine/api/graphql/workspace-resolver-builder/interfaces/workspace-resolvers-builder.interface';
import { type WorkspacePreQueryHookInstance } from 'src/engine/api/graphql/workspace-query-runner/workspace-query-hook/interfaces/workspace-query-hook.interface';
import { WorkspaceQueryHook } from 'src/engine/api/graphql/workspace-query-runner/workspace-query-hook/decorators/workspace-query-hook.decorator';
import { AuthContext } from 'src/engine/core-modules/auth/types/auth-context.type';
import { TaskVisibilityService } from 'src/modules/task/query-hooks/task-visibility.service';

@Injectable()
@WorkspaceQueryHook('task.findMany')
export class TaskFindManyPreQueryHook implements WorkspacePreQueryHookInstance {
  constructor(private readonly taskVisibilityService: TaskVisibilityService) {}

  async execute(
    authContext: AuthContext,
    _objectName: string,
    payload: FindManyResolverArgs,
  ): Promise<FindManyResolverArgs> {
    const assigneeFilter =
      await this.taskVisibilityService.getAssigneeFilterForNonAdminUser(
        authContext,
      );

    if (!assigneeFilter) {
      return payload;
    }

    return merge({}, payload, {
      filter: assigneeFilter,
    });
  }
}

