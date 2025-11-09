import { Module } from '@nestjs/common';

import { TaskFindManyPreQueryHook } from 'src/modules/task/query-hooks/task-find-many.pre-query.hook';
import { TaskFindOnePreQueryHook } from 'src/modules/task/query-hooks/task-find-one.pre-query.hook';
import { TaskGroupByPreQueryHook } from 'src/modules/task/query-hooks/task-group-by.pre-query.hook';
import { TaskVisibilityService } from 'src/modules/task/query-hooks/task-visibility.service';

@Module({
  providers: [
    TaskFindManyPreQueryHook,
    TaskFindOnePreQueryHook,
    TaskGroupByPreQueryHook,
    TaskVisibilityService,
  ],
})
export class TaskQueryHookModule {}

