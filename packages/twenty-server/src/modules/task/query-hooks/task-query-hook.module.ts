import { Module } from '@nestjs/common';

import { TaskFindManyPreQueryHook } from 'src/modules/task/query-hooks/task-find-many.pre-query.hook';
import { TaskFindOnePreQueryHook } from 'src/modules/task/query-hooks/task-find-one.pre-query.hook';
import { TaskGroupByPreQueryHook } from 'src/modules/task/query-hooks/task-group-by.pre-query.hook';
import { TaskVisibilityService } from 'src/modules/task/query-hooks/task-visibility.service';
import { UserRoleModule } from 'src/engine/metadata-modules/user-role/user-role.module';

@Module({
  imports: [UserRoleModule],
  providers: [
    TaskFindManyPreQueryHook,
    TaskFindOnePreQueryHook,
    TaskGroupByPreQueryHook,
    TaskVisibilityService,
  ],
})
export class TaskQueryHookModule {}

