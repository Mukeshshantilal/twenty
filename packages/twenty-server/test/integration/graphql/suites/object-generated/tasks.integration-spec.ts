/* global APP_PORT, APPLE_JANE_ADMIN_ACCESS_TOKEN, APPLE_JONY_MEMBER_ACCESS_TOKEN */

import request from 'supertest';

import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

const client = request(`http://localhost:${APP_PORT}`);

const JONY_WORKSPACE_MEMBER_ID = WORKSPACE_MEMBER_DATA_SEED_IDS.JONY;

describe('tasksResolver (e2e)', () => {
  it('should find many tasks for admin', () => {
    const queryData = {
      query: `
        query tasks {
          tasks {
            edges {
              node {
                position
                title
                bodyV2 {
                  markdown
                  blocknote
                }
                dueAt
                status
                id
                createdAt
                updatedAt
                deletedAt
                assigneeId
              }
            }
          }
        }
      `,
    };

    return client
      .post('/graphql')
      .set('Authorization', `Bearer ${APPLE_JANE_ADMIN_ACCESS_TOKEN}`)
      .send(queryData)
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeDefined();
        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.tasks.edges.length).toBeGreaterThan(0);
      });
  });

  it('should only find tasks assigned to the user for a non-admin member', async () => {
    const queryData = {
      query: `
        query tasks {
          tasks {
            edges {
              node {
                id
                title
                assigneeId
              }
            }
          }
        }
      `,
    };

    const response = await client
      .post('/graphql')
      .set('Authorization', `Bearer ${APPLE_JONY_MEMBER_ACCESS_TOKEN}`)
      .send(queryData)
      .expect(200);

    expect(response.body.data).toBeDefined();
    expect(response.body.errors).toBeUndefined();

    const tasks = response.body.data.tasks.edges.map((edge: any) => edge.node);

    expect(tasks.length).toBeGreaterThan(0);
    expect(
      tasks.every((task: any) => task.assigneeId === JONY_WORKSPACE_MEMBER_ID),
    ).toBe(true);
  });

  it('should not allow a non-admin member to fetch another user task by ID', async () => {
    const adminTaskQuery = {
      query: `
        query tasks {
          tasks {
            edges {
              node {
                id
                assigneeId
              }
            }
          }
        }
      `,
    };

    const adminResponse = await client
      .post('/graphql')
      .set('Authorization', `Bearer ${APPLE_JANE_ADMIN_ACCESS_TOKEN}`)
      .send(adminTaskQuery)
      .expect(200);

    const allTasks = adminResponse.body.data.tasks.edges.map(
      (edge: any) => edge.node,
    );
    const otherUserTask = allTasks.find(
      (task: any) => task.assigneeId !== JONY_WORKSPACE_MEMBER_ID,
    );

    if (!otherUserTask) {
      // No task assigned to another member in seed data, skip assertion gracefully.
      return;
    }

    const queryData = {
      query: `
        query findOneTask($id: UUID!) {
          findOneTask(filter: { id: { eq: $id } }) {
            id
            title
            assigneeId
          }
        }
      `,
      variables: {
        id: otherUserTask.id,
      },
    };

    const response = await client
      .post('/graphql')
      .set('Authorization', `Bearer ${APPLE_JONY_MEMBER_ACCESS_TOKEN}`)
      .send(queryData)
      .expect(200);

    expect(response.body.data.findOneTask).toBeNull();
  });
});
