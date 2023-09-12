import { beforeEach, describe, expect, test } from 'vitest';
import { createMockContext, MockContext } from '../../testContext';
import { ServiceContext } from '../../types/context';
import { Notification } from '@prisma/client';
import { NotificationType } from '../../helper/constant';
import notificationService from './notification.service';

let mockCtx: MockContext
let ctx: ServiceContext

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as ServiceContext;
});

describe('notification service', () => {
  describe('markNotificationAsRead', () => {
    test('should return notification with read_at', () => {
      const notifications: Notification[] = [
        {
          id: '01',
          message: 'Message',
          notification_type: NotificationType.QUOTE_ACCEPTED_NOTIFICATION,
          params: {},
          recipient_id: 'recipient-id',
          sender_id: 'sender-id',
          read_at: null,
          updated_at: new Date(),
          created_at: new Date(),
        },
      ];

      mockCtx.prisma.notification.update.mockResolvedValueOnce({
        ...notifications[0],
        read_at: new Date(),
      });

      expect(notificationService.markNotificationsAsRead({ notifications }, ctx))
        .resolves.toHaveProperty([0, 'read_at'])
    });
  });
});
