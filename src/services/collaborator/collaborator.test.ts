import { describe, test, beforeEach, expect, vi, afterEach } from 'vitest';
import { Customer, User, VendorMember } from '@prisma/client';
import { ServiceContext } from '../../types/context';
import { MockContext, createMockContext } from '../../testContext';
import collaboratorService from './collaborator.service';
import { CompanyCollaboratorRoleType } from '../../helper/constant';
import { hasPermission } from '../../helper/__mocks__/casbin'
import { PermissionDeniedError } from '../../graphql/errors/PermissionDeniedError';

let mockCtx: MockContext;
let ctx: ServiceContext;

vi.mock('../../helper/casbin.ts');

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as ServiceContext;
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('collaborator.service', () => {
  describe('updateUserRole', () => {
    describe('Setting customer as admin role', () => {
      test('Should pass without error', async () => {
        const user: User & { customer: Customer } = {
          id: 'user-id',
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
          customer: {
            id: 'customer-id',
            biotech_id: 'biotech_id',
            has_setup_profile: true,
            job_title: 'title',
            role: 'role',
            team: 'team',
            user_id: 'user-id',
            created_at: new Date(),
            updated_at: new Date(),
          },
        };

        mockCtx.prisma.user.findFirst.mockResolvedValueOnce(user);
        mockCtx.prisma.projectConnection.findMany.mockResolvedValueOnce([]);
        mockCtx.prisma.customer.update.mockResolvedValueOnce({
          ...user.customer,
        });

        expect(collaboratorService.updateUserRole(
          {
            role: CompanyCollaboratorRoleType.ADMIN,
            user_id: 'user-id',
          },
          ctx
        )).resolves.not.toThrowError();
      });
    });

    describe('Setting customer as user role', () => {
      test('Should pass without error', async () => {
        const user: User & { customer: Customer } = {
          id: 'user-id',
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
          customer: {
            id: 'customer-id',
            biotech_id: 'biotech_id',
            has_setup_profile: true,
            job_title: 'title',
            role: 'role',
            team: 'team',
            user_id: 'user-id',
            created_at: new Date(),
            updated_at: new Date(),
          },
        };

        mockCtx.prisma.user.findFirst.mockResolvedValueOnce(user);
        mockCtx.prisma.projectConnection.findMany.mockResolvedValueOnce([]);
        mockCtx.prisma.customer.update.mockResolvedValueOnce({
          ...user.customer,
        });

        expect(collaboratorService.updateUserRole(
          {
            role: CompanyCollaboratorRoleType.USER,
            user_id: 'user-id',
          },
          ctx
        )).resolves.not.toThrowError();
      });
    });

    describe('Setting vendor member as admin role', () => {
      test('Should pass without error', async () => {
        const user: User & { vendor_member: VendorMember } = {
          id: 'user-id',
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
          vendor_member: {
            id: 'customer-id',
            vendor_company_id: 'biotech_id',
            department: 'department',
            title: 'title',
            role: 'role',
            phone: '1234567890',
            user_id: 'user-id',
            created_at: new Date(),
            updated_at: new Date(),
          },
        };

        mockCtx.prisma.user.findFirst.mockResolvedValueOnce(user);
        mockCtx.prisma.projectConnection.findMany.mockResolvedValueOnce([]);
        mockCtx.prisma.vendorMember.update.mockResolvedValueOnce({
          ...user.vendor_member,
        });

        expect(collaboratorService.updateUserRole(
          {
            role: CompanyCollaboratorRoleType.ADMIN,
            user_id: 'user-id',
          },
          ctx
        )).resolves.not.toThrowError();
      });
    });

    describe('Setting vendor member as user role', () => {
      test('Should pass without error', async () => {
        const user: User & { vendor_member: VendorMember } = {
          id: 'user-id',
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
          vendor_member: {
            id: 'customer-id',
            vendor_company_id: 'biotech_id',
            department: 'department',
            title: 'title',
            role: 'role',
            phone: '1234567890',
            user_id: 'user-id',
            created_at: new Date(),
            updated_at: new Date(),
          },
        };

        mockCtx.prisma.user.findFirst.mockResolvedValueOnce(user);
        mockCtx.prisma.projectConnection.findMany.mockResolvedValueOnce([]);
        mockCtx.prisma.vendorMember.update.mockResolvedValueOnce({
          ...user.vendor_member,
        });

        expect(collaboratorService.updateUserRole(
          {
            role: CompanyCollaboratorRoleType.USER,
            user_id: 'user-id',
          },
          ctx
        )).resolves.not.toThrowError();
      });
    });
  });

  describe('checkPermissionToEditRole', () => {
    describe('Given the user doesn\'t has permission', () => {
      test('Should throw permission denied error', async () => {
        vi.mocked(hasPermission).mockResolvedValueOnce(false);

        expect(collaboratorService.checkPermissionToEditRole({
          role: CompanyCollaboratorRoleType.USER,
          user_id: 'user-id',
        })).rejects.toThrowError(PermissionDeniedError);
      });
    });

    describe('Given the user has permission', () => {
      test('Should pass without throw', async () => {
        vi.mocked(hasPermission).mockResolvedValueOnce(true);

        expect(collaboratorService.checkPermissionToEditRole({
          role: CompanyCollaboratorRoleType.USER,
          user_id: 'user-id',
        })).resolves.not.toThrowError();
      });
    });

    describe('Given invalid role', () => {
      test('Should throw error', async () => {
        vi.mocked(hasPermission).mockResolvedValueOnce(true);

        expect(collaboratorService.checkPermissionToEditRole({
          role: 'invalid-role' as CompanyCollaboratorRoleType,
          user_id: 'user-id',
        })).rejects.toThrowError();
      });
    })
  });
})
