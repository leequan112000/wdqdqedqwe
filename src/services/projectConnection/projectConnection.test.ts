import { expect, test, vi, beforeEach, describe } from 'vitest';
import { faker } from '@faker-js/faker';
import {
  CustomerConnection,
  Prisma,
  ProjectConnection,
  ProjectRequest,
  User,
  VendorMember,
  VendorMemberConnection,
} from '@prisma/client';
import { ServiceContext, Context } from '../../types/context';
import { MockContext, createMockContext } from '../../testContext';
import { projectConnectionService } from './projectConnection.service';
import {
  ProjectConnectionVendorStatus,
  ProjectRequestStatus,
} from '../../helper/constant';
import * as casbinModule from '../../helper/casbin';
import * as projectRequestMailerModule from '../../mailer/projectRequest';
import * as acceptRequestNotificationModule from '../../notification/acceptRequestNotification';
import * as chatService from '../chat/chat.service';

vi.mock('@sendgrid/mail');

let mockCtx: MockContext;
let ctx: Context;
let projectRequest: ProjectRequest;
let vendorMember: VendorMember;
let vendorMemberConnection: VendorMemberConnection;
let projectConnection: ProjectConnection & {
  customer_connections: CustomerConnection[];
  vendor_member_connections: VendorMemberConnection[];
  project_request: ProjectRequest;
};
let user: User;

describe('projectConnection.service', () => {
  beforeEach(() => {
    mockCtx = createMockContext();
    ctx = {
      ...mockCtx,
      req: { user_id: faker.string.uuid() },
    } as unknown as Context;
    user = {
      id: faker.string.uuid(),
      email: 'john.doe@example.com',
      first_name: 'John',
      last_name: 'Doe',
      encrypted_password: null,
      reset_password_token: null,
      reset_password_expiration: null,
      reset_password_sent_at: null,
      remember_created_at: null,
      created_at: new Date(),
      updated_at: new Date(),
      is_active: true,
      phone_number: null,
      country_code: null,
      deactivated_at: null,
    };
    projectRequest = {
      id: faker.string.uuid(),
      title: faker.lorem.words(3),
      vendor_requirement: faker.lorem.sentence(),
      objective_description: faker.lorem.sentence(),
      preparation_description: faker.lorem.sentence(),
      in_contact_with_vendor: faker.datatype.boolean(),
      existing_vendor_contact_description: faker.lorem.sentence(),
      project_challenge_description: faker.lorem.sentence(),
      vendor_search_timeframe: faker.string.sample(),
      max_budget: new Prisma.Decimal(
        faker.number.int({ min: 1000, max: 50000 }),
      ),
      vendor_location_requirement: faker.location.countryCode(),
      project_start_time_requirement: faker.date.future().toISOString(),
      project_deadline_requirement: faker.date.future().toISOString(),
      status: ProjectRequestStatus.PROCESSING,
      created_at: new Date(),
      updated_at: new Date(),
      initial_assigned_at: null,
      is_private: faker.datatype.boolean(),
      biotech_id: faker.string.uuid(),
      customer_id: faker.string.uuid(),
      sourcing_session_id: null,
    };
    vendorMember = {
      id: faker.string.uuid(),
      user_id: faker.string.uuid(),
      vendor_company_id: faker.string.uuid(),
      created_at: new Date(),
      updated_at: new Date(),
      phone: faker.phone.number(),
      title: faker.person.jobTitle(),
      department: faker.commerce.department(),
      role: 'MEMBER',
    };
    vendorMemberConnection = {
      id: faker.string.uuid(),
      vendor_member_id: vendorMember.id,
      project_connection_id: faker.string.uuid(),
      created_at: new Date(),
      updated_at: new Date(),
    };
    projectConnection = {
      id: faker.string.uuid(),
      project_request_id: projectRequest.id,
      vendor_status: ProjectConnectionVendorStatus.PENDING,
      vendor_company_id: faker.string.uuid(),
      created_at: new Date(),
      updated_at: new Date(),
      final_contract_uploaded_at: null,
      expired_at: null,
      biotech_invite_vendor_id: null,
      customer_connections: [],
      vendor_member_connections: [vendorMemberConnection],
      project_request: projectRequest,
    };
  });

  describe('checkIfUserInProjectConnection', () => {
    test('should return true if user is in project connection', async () => {
      mockCtx.prisma.customerConnection.findFirst.mockResolvedValueOnce({
        id: faker.string.uuid(),
        customer_id: faker.string.uuid(),
        project_connection_id: projectConnection.id,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result =
        await projectConnectionService.checkIfUserInProjectConnection(
          {
            user_id: ctx.req.user_id!,
            project_connection_id: projectConnection.id,
          },
          mockCtx,
        );

      expect(result).toBe(true);
    });

    test('should return false if user is not in project connection', async () => {
      mockCtx.prisma.customerConnection.findFirst.mockResolvedValueOnce(null);
      mockCtx.prisma.vendorMemberConnection.findFirst.mockResolvedValueOnce(
        null,
      );

      const result =
        await projectConnectionService.checkIfUserInProjectConnection(
          {
            user_id: ctx.req.user_id!,
            project_connection_id: projectConnection.id,
          },
          mockCtx,
        );

      expect(result).toBe(false);
    });
  });

  describe('acceptProjectConnection', () => {
    test('should accept project connection and send notifications', async () => {
      vi.spyOn(casbinModule, 'hasPermission').mockResolvedValue(true);
      vi.spyOn(chatService, 'createSystemMessage').mockResolvedValue({} as any);

      const sendVendorAcceptProjectNoticeEmailSpy = vi
        .spyOn(projectRequestMailerModule, 'sendVendorAcceptProjectNoticeEmail')
        .mockResolvedValue();

      const createAcceptRequestNotificationSpy = vi
        .spyOn(acceptRequestNotificationModule, 'default')
        .mockResolvedValue();

      mockCtx.prisma.projectConnection.findFirst.mockResolvedValueOnce(
        projectConnection,
      );
      mockCtx.prisma.projectConnection.update.mockResolvedValueOnce({
        ...projectConnection,
        vendor_status: ProjectConnectionVendorStatus.ACCEPTED,
      });
      mockCtx.prisma.vendorMember.findFirst.mockResolvedValueOnce(vendorMember);
      mockCtx.prisma.user.findMany.mockResolvedValueOnce([user]);

      const result = await projectConnectionService.acceptProjectConnection(
        { id: projectConnection.id },
        ctx,
      );

      expect(result.vendor_status).toBe(ProjectConnectionVendorStatus.ACCEPTED);
      expect(sendVendorAcceptProjectNoticeEmailSpy).toHaveBeenCalled();
      expect(createAcceptRequestNotificationSpy).toHaveBeenCalled();
    });

    test('should throw error if project connection is expired', async () => {
      vi.spyOn(casbinModule, 'hasPermission').mockResolvedValue(true);

      const expiredProjectConnection = {
        ...projectConnection,
        expired_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      };

      mockCtx.prisma.projectConnection.findFirst.mockResolvedValueOnce(
        expiredProjectConnection,
      );

      await expect(
        projectConnectionService.acceptProjectConnection(
          { id: expiredProjectConnection.id },
          ctx,
        ),
      ).rejects.toThrow('You can no longer accept this request');
    });
  });

  describe('declineProjectConnection', () => {
    test('should decline project connection', async () => {
      vi.spyOn(casbinModule, 'hasPermission').mockResolvedValue(true);

      mockCtx.prisma.projectConnection.findFirst.mockResolvedValueOnce(
        projectConnection,
      );
      mockCtx.prisma.projectConnection.update.mockResolvedValueOnce({
        ...projectConnection,
        vendor_status: ProjectConnectionVendorStatus.DECLINED,
      });

      const result = await projectConnectionService.declineProjectConnection(
        { id: projectConnection.id },
        ctx,
      );

      expect(result.vendor_status).toBe(ProjectConnectionVendorStatus.DECLINED);
    });

    test('should throw error if project connection is expired', async () => {
      vi.spyOn(casbinModule, 'hasPermission').mockResolvedValue(true);

      const expiredProjectConnection = {
        ...projectConnection,
        expired_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      };

      mockCtx.prisma.projectConnection.findFirst.mockResolvedValueOnce(
        expiredProjectConnection,
      );

      await expect(
        projectConnectionService.declineProjectConnection(
          { id: expiredProjectConnection.id },
          ctx,
        ),
      ).rejects.toThrow('You can no longer decline this request');
    });
  });

  describe('getProjectConnections', () => {
    test('should return filtered project connections', async () => {
      mockCtx.prisma.vendorMember.findFirst.mockResolvedValueOnce(vendorMember);
      mockCtx.prisma.vendorMemberConnection.findMany.mockResolvedValueOnce([
        {
          ...vendorMemberConnection,
          project_connection: {
            ...projectConnection,
            quotes: [],
          },
        },
      ]);

      const result = await projectConnectionService.getProjectConnections(
        { filter: { status: 'PENDING' } },
        ctx,
      );

      expect(result).toHaveLength(1);
      expect(result[0].vendor_status).toBe(
        ProjectConnectionVendorStatus.PENDING,
      );
    });

    test('should return empty array if no project connections match filter', async () => {
      mockCtx.prisma.vendorMember.findFirst.mockResolvedValueOnce(vendorMember);
      mockCtx.prisma.vendorMemberConnection.findMany.mockResolvedValueOnce([]);

      const result = await projectConnectionService.getProjectConnections(
        { filter: { status: 'COMPLETED' } },
        ctx,
      );

      expect(result).toHaveLength(0);
    });
  });
});
