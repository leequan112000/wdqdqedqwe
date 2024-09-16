import { describe, test, beforeEach, expect, vi, afterEach } from 'vitest';
import {
  Customer,
  User,
  VendorMember,
  ProjectConnection,
} from '@prisma/client';
import { Context } from '../../types/context';
import { MockContext, createMockContext } from '../../testContext';
import collaboratorService from './collaborator.service';
import {
  CompanyCollaboratorRoleType,
  ProjectConnectionVendorStatus,
} from '../../helper/constant';
import { hasPermission } from '../../helper/__mocks__/casbin';
import { PermissionDeniedError } from '../../graphql/errors/PermissionDeniedError';
import * as accessControlModule from '../../helper/accessControl';
import * as emailModule from '../../helper/email';
import * as mailerModule from '../../mailer';
import * as notificationModule from '../../notification/collaboratedNotification';
import { faker } from '@faker-js/faker';
import { mockDeep } from 'vitest-mock-extended';
import { PrismaClientMainDb } from '../../prisma';

let mockCtx: MockContext;
let ctx: Context;
let newUser: User & { customer: Customer; vendor_member: VendorMember };
vi.mock('../../helper/casbin.ts');
vi.mock('../../helper/accessControl');
vi.mock('../../helper/email');
vi.mock('../../mailer');
vi.mock('../../notification/collaboratedNotification');

afterEach(() => {
  vi.resetAllMocks();
});

describe('collaborator.service', () => {
  beforeEach(() => {
    newUser = {
      id: faker.string.uuid(),
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@example.com',
      encrypted_password: null,
      is_active: true,
      remember_created_at: null,
      reset_password_expiration: new Date(),
      reset_password_sent_at: null,
      reset_password_token: 'reset-token',
      created_at: new Date(),
      updated_at: new Date(),
      phone_number: null,
      country_code: null,
      deactivated_at: null,
      customer: {
        id: faker.string.uuid(),
        biotech_id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        has_setup_profile: false,
        job_title: null,
        role: 'USER',
        team: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      vendor_member: {
        id: faker.string.uuid(),
        vendor_company_id: faker.string.uuid(),
        department: 'department',
        title: 'title',
        role: 'role',
        phone: '1234567890',
        user_id: faker.string.uuid(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    };
    mockCtx = createMockContext();
    mockCtx.prisma.$transaction.mockImplementation(async (callback) => {
      const trx = {
        user: {
          findFirst: vi.fn().mockResolvedValue({} as any),
          create: vi.fn().mockResolvedValue(newUser),
        },
      } as unknown as Omit<
        PrismaClientMainDb,
        | '$connect'
        | '$disconnect'
        | '$on'
        | '$transaction'
        | '$use'
        | '$extends'
      >;
      return callback(trx);
    });
    ctx = mockCtx as unknown as Context;
    ctx = {
      ...mockCtx,
      req: { user_id: faker.string.uuid() },
    } as unknown as Context;
  });

  describe('updateUserRole', () => {
    describe('Setting customer as admin role', () => {
      test('Should pass without error', async () => {
        const user: User & { customer: Customer } = {
          id: faker.string.uuid(),
          first_name: 'John',
          last_name: 'Doe',
          email: 'email@email.com',
          encrypted_password: 'encrpyted',
          is_active: true,
          remember_created_at: null,
          reset_password_expiration: null,
          reset_password_sent_at: null,
          reset_password_token: null,
          phone_number: '5555551234',
          country_code: '1',
          created_at: new Date(),
          updated_at: new Date(),
          customer: {
            id: faker.string.uuid(),
            biotech_id: faker.string.uuid(),
            has_setup_profile: true,
            job_title: 'title',
            role: 'role',
            team: 'team',
            user_id: faker.string.uuid(),
            created_at: new Date(),
            updated_at: new Date(),
          },
          deactivated_at: null,
        };

        mockCtx.prisma.user.findFirst.mockResolvedValueOnce(user);
        mockCtx.prisma.projectConnection.findMany.mockResolvedValueOnce([]);
        mockCtx.prisma.customer.update.mockResolvedValueOnce({
          ...user.customer,
        });

        expect(
          collaboratorService.updateUserRole(
            {
              role: CompanyCollaboratorRoleType.ADMIN,
              user_id: faker.string.uuid(),
            },
            ctx,
          ),
        ).resolves.not.toThrowError();
      });
    });

    describe('Setting customer as user role', () => {
      test('Should pass without error', async () => {
        const user: User & { customer: Customer } = {
          id: faker.string.uuid(),
          first_name: 'John',
          last_name: 'Doe',
          email: 'email@email.com',
          encrypted_password: 'encrpyted',
          is_active: true,
          remember_created_at: null,
          reset_password_expiration: null,
          reset_password_sent_at: null,
          reset_password_token: null,
          phone_number: '5555551234',
          country_code: '1',
          created_at: new Date(),
          updated_at: new Date(),
          customer: {
            id: faker.string.uuid(),
            biotech_id: faker.string.uuid(),
            has_setup_profile: true,
            job_title: 'title',
            role: 'role',
            team: 'team',
            user_id: faker.string.uuid(),
            created_at: new Date(),
            updated_at: new Date(),
          },
          deactivated_at: null,
        };

        mockCtx.prisma.user.findFirst.mockResolvedValueOnce(user);
        mockCtx.prisma.projectConnection.findMany.mockResolvedValueOnce([]);
        mockCtx.prisma.customer.update.mockResolvedValueOnce({
          ...user.customer,
        });

        expect(
          collaboratorService.updateUserRole(
            {
              role: CompanyCollaboratorRoleType.USER,
              user_id: faker.string.uuid(),
            },
            ctx,
          ),
        ).resolves.not.toThrowError();
      });
    });

    describe('Setting vendor member as admin role', () => {
      test('Should pass without error', async () => {
        const user: User & { vendor_member: VendorMember } = {
          id: faker.string.uuid(),
          first_name: 'John',
          last_name: 'Doe',
          email: 'email@email.com',
          encrypted_password: 'encrpyted',
          is_active: true,
          remember_created_at: null,
          reset_password_expiration: null,
          reset_password_sent_at: null,
          reset_password_token: null,
          created_at: new Date(),
          updated_at: new Date(),
          phone_number: '5555551234',
          country_code: '1',
          vendor_member: {
            id: faker.string.uuid(),
            vendor_company_id: faker.string.uuid(),
            department: 'department',
            title: 'title',
            role: 'role',
            phone: '1234567890',
            user_id: faker.string.uuid(),
            created_at: new Date(),
            updated_at: new Date(),
          },
          deactivated_at: null,
        };

        mockCtx.prisma.user.findFirst.mockResolvedValueOnce(user);
        mockCtx.prisma.projectConnection.findMany.mockResolvedValueOnce([]);
        mockCtx.prisma.vendorMember.update.mockResolvedValueOnce({
          ...user.vendor_member,
        });

        expect(
          collaboratorService.updateUserRole(
            {
              role: CompanyCollaboratorRoleType.ADMIN,
              user_id: faker.string.uuid(),
            },
            ctx,
          ),
        ).resolves.not.toThrowError();
      });
    });

    describe('Setting vendor member as user role', () => {
      test('Should pass without error', async () => {
        const user: User & { vendor_member: VendorMember } = {
          id: faker.string.uuid(),
          first_name: 'John',
          last_name: 'Doe',
          email: 'email@email.com',
          encrypted_password: 'encrpyted',
          is_active: true,
          remember_created_at: null,
          reset_password_expiration: null,
          reset_password_sent_at: null,
          reset_password_token: null,
          created_at: new Date(),
          updated_at: new Date(),
          phone_number: '5555551234',
          country_code: '1',
          vendor_member: {
            id: faker.string.uuid(),
            vendor_company_id: faker.string.uuid(),
            department: 'department',
            title: 'title',
            role: 'role',
            phone: '1234567890',
            user_id: faker.string.uuid(),
            created_at: new Date(),
            updated_at: new Date(),
          },
          deactivated_at: null,
        };

        mockCtx.prisma.user.findFirst.mockResolvedValueOnce(user);
        mockCtx.prisma.projectConnection.findMany.mockResolvedValueOnce([]);
        mockCtx.prisma.vendorMember.update.mockResolvedValueOnce({
          ...user.vendor_member,
        });

        expect(
          collaboratorService.updateUserRole(
            {
              role: CompanyCollaboratorRoleType.USER,
              user_id: faker.string.uuid(),
            },
            ctx,
          ),
        ).resolves.not.toThrowError();
      });
    });
  });

  describe('checkPermissionToEditRole', () => {
    describe("Given the user doesn't has permission", () => {
      test('Should throw permission denied error', async () => {
        vi.mocked(hasPermission).mockResolvedValueOnce(false);

        expect(
          collaboratorService.checkPermissionToEditRole({
            role: CompanyCollaboratorRoleType.USER,
            user_id: faker.string.uuid(),
          }),
        ).rejects.toThrowError(PermissionDeniedError);
      });
    });

    describe('Given the user has permission', () => {
      test('Should pass without throw', async () => {
        vi.mocked(hasPermission).mockResolvedValueOnce(true);

        expect(
          collaboratorService.checkPermissionToEditRole({
            role: CompanyCollaboratorRoleType.USER,
            user_id: faker.string.uuid(),
          }),
        ).resolves.not.toThrowError();
      });
    });

    describe('Given invalid role', () => {
      test('Should throw error', async () => {
        vi.mocked(hasPermission).mockResolvedValueOnce(true);

        expect(
          collaboratorService.checkPermissionToEditRole({
            role: 'invalid-role' as CompanyCollaboratorRoleType,
            user_id: faker.string.uuid(),
          }),
        ).rejects.toThrowError();
      });
    });
  });

  describe('addProjectCollaborator', () => {
    test('should add a customer as project collaborator', async () => {
      const projectConnection: ProjectConnection = {
        id: faker.string.uuid(),
        project_request_id: faker.string.uuid(),
        vendor_status: ProjectConnectionVendorStatus.ACCEPTED,
        vendor_company_id: faker.string.uuid(),
        created_at: new Date(),
        updated_at: new Date(),
        final_contract_uploaded_at: null,
        expired_at: null,
        biotech_invite_vendor_id: null,
      };

      const currentUser: User = {
        id: faker.string.uuid(),
        first_name: 'Current',
        last_name: 'User',
        email: 'current@example.com',
        encrypted_password: 'encrypted',
        is_active: true,
        remember_created_at: null,
        reset_password_expiration: null,
        reset_password_sent_at: null,
        reset_password_token: null,
        created_at: new Date(),
        updated_at: new Date(),
        phone_number: '1234567890',
        country_code: '1',
        deactivated_at: null,
      };

      const collaboratorUser: User & {
        customer: Customer;
        vendor_member: null;
        notifications: Notification[];
      } = {
        id: faker.string.uuid(),
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        encrypted_password: 'encrypted',
        is_active: true,
        remember_created_at: null,
        reset_password_expiration: null,
        reset_password_sent_at: null,
        reset_password_token: null,
        created_at: new Date(),
        updated_at: new Date(),
        phone_number: '1234567890',
        country_code: '1',
        deactivated_at: null,
        customer: {
          id: faker.string.uuid(),
          biotech_id: faker.string.uuid(),
          user_id: faker.string.uuid(),
          has_setup_profile: true,
          job_title: 'Manager',
          role: 'USER',
          team: 'Sales',
          created_at: new Date(),
          updated_at: new Date(),
        },
        vendor_member: null,
        notifications: [],
      };

      vi.mocked(
        accessControlModule.checkAllowAddProjectCollaborator,
      ).mockResolvedValueOnce();

      // Mock both user.findFirst calls
      mockCtx.prisma.user.findFirst.mockResolvedValueOnce(currentUser);
      mockCtx.prisma.user.findFirst.mockResolvedValueOnce(collaboratorUser);

      mockCtx.prisma.customerConnection.upsert.mockResolvedValueOnce({} as any);
      mockCtx.prisma.projectConnection.findFirst.mockResolvedValueOnce({
        ...projectConnection,
        project_request: { title: 'Test Project' },
      } as any);

      const result = await collaboratorService.addProjectCollaborator(
        {
          project_connection_id: projectConnection.id,
          user_id: collaboratorUser.id,
        },
        ctx,
      );

      expect(result).toEqual(collaboratorUser);
      expect(mockCtx.prisma.customerConnection.upsert).toHaveBeenCalled();
      expect(
        mailerModule.projectCollaboratorInvitationEmail,
      ).toHaveBeenCalled();
      expect(notificationModule.default).toHaveBeenCalled();
    });
  });
  describe('removeProjectCollaborator', () => {
    test('should remove a customer as project collaborator', async () => {
      const user: User & { customer: Customer } = {
        id: faker.string.uuid(),
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        encrypted_password: 'encrypted',
        is_active: true,
        remember_created_at: null,
        reset_password_expiration: null,
        reset_password_sent_at: null,
        reset_password_token: null,
        created_at: new Date(),
        updated_at: new Date(),
        phone_number: '1234567890',
        country_code: '1',
        deactivated_at: null,
        customer: {
          id: faker.string.uuid(),
          biotech_id: faker.string.uuid(),
          user_id: faker.string.uuid(),
          has_setup_profile: true,
          job_title: 'Manager',
          role: 'USER',
          team: 'Sales',
          created_at: new Date(),
          updated_at: new Date(),
        },
      };

      vi.mocked(
        accessControlModule.checkAllowRemoveProjectCollaborator,
      ).mockResolvedValueOnce();
      mockCtx.prisma.user.findFirst.mockResolvedValueOnce(user);
      mockCtx.prisma.customerConnection.delete.mockResolvedValueOnce({} as any);

      const result = await collaboratorService.removeProjectCollaborator(
        {
          project_connection_id: faker.string.uuid(),
          user_id: faker.string.uuid(),
        },
        ctx,
      );

      expect(result).toEqual(user);
      expect(mockCtx.prisma.customerConnection.delete).toHaveBeenCalled();
    });
  });

  describe('inviteProjectCollaboratorViaEmail', () => {
    test('should invite a new customer collaborator via email', async () => {
      vi.mocked(
        accessControlModule.checkAllowAddProjectCollaborator,
      ).mockResolvedValueOnce();
      vi.spyOn(
        collaboratorService,
        'checkPermissionToEditRole',
      ).mockResolvedValueOnce();

      mockCtx.prisma.user.findFirst.mockResolvedValueOnce(newUser); // Current User
      mockCtx.prisma.user.findFirst.mockResolvedValueOnce(null); // No existing user
      mockCtx.prisma.user.create.mockResolvedValueOnce(newUser);
      vi.mocked(emailModule.getUserFullName).mockReturnValue('Jane Doe');
      vi.mocked(emailModule.createResetPasswordUrl).mockReturnValue(
        'http://reset-password-url',
      );
      const result =
        await collaboratorService.inviteProjectCollaboratorViaEmail(
          {
            project_connection_id: faker.string.uuid(),
            email: 'jane@example.com',
            name: 'Jane Doe',
            role: CompanyCollaboratorRoleType.USER,
          },
          ctx,
        );
      expect(result).toEqual(newUser);
      expect(mailerModule.customerInvitationEmail).toHaveBeenCalled();
      expect(notificationModule.default).toHaveBeenCalled();
    });
  });
});
