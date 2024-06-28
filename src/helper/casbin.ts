import { newEnforcer, newModelFromString } from 'casbin';
import { PrismaAdapter } from 'casbin-prisma-adapter';
import { prisma } from '../prisma';
import { CasbinAct, CasbinObj, CasbinRole } from './constant';

const rbac_models = `
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && keyMatch(r.act, p.act) || checkSuperAdmin(r.sub)
`;

const createEnforcer = async () => {
  const a = await PrismaAdapter.newAdapter(prisma);
  const model = newModelFromString(rbac_models);
  const e = await newEnforcer(model, a);
  e.addFunction('checkSuperAdmin', async (args) => {
    const username = args;
    const result = await e.hasRoleForUser(username, CasbinRole.OWNER);
    return result;
  });
  return e;
};

export const addRoleForUser = async (userId: string, role: CasbinRole) => {
  const e = await createEnforcer();
  return await e.addRoleForUser(`user:${userId}`, role);
};

export const hasPermission = async (
  userId: string,
  obj: CasbinObj | CasbinObj[],
  act: CasbinAct,
) => {
  const e = await createEnforcer();

  let resources: CasbinObj[];
  if (Array.isArray(obj)) {
    resources = obj;
  } else {
    resources = [obj];
  }
  const tasks = resources.map((o) => e.enforce(`user:${userId}`, o, act));
  const allEffects = await Promise.all(tasks);

  return allEffects.filter((e) => e === false).length === 0;
};

export const frontendPermissionObject = async (userId: string) => {
  const e = await createEnforcer();
  const namedGroupingPolicy = await e.getFilteredNamedGroupingPolicy(
    'g',
    0,
    `user:${userId!}`,
  );
  const userRoles = namedGroupingPolicy.map((p) => {
    return p[1];
  });

  /**
   * Explicitly grant all permissions to OWNER role.
   * This is because casbin.js doesn't support superadmin matcher on FE.
   */
  if (userRoles.includes(CasbinRole.OWNER)) {
    const allObjs = Object.values(CasbinObj);
    return [CasbinAct.WRITE, CasbinAct.READ, CasbinAct.DELETE].reduce<{
      [act: string]: string[];
    }>((acc, action) => {
      acc[action] = allObjs;
      return acc;
    }, {});
  }

  const allPolicies = await e.getPolicy();
  const filteredPolicies = allPolicies.reduce<string[][]>((rules, rule) => {
    if (userRoles.includes(rule[0])) {
      rules.unshift(rule);
    }
    return rules;
  }, []);

  return filteredPolicies.reduce<{ [act: string]: string[] }>((acc, policy) => {
    if (acc[policy[2]]) {
      acc[policy[2]].unshift(policy[1]);
    } else {
      acc[policy[2]] = [policy[1]];
    }
    return acc;
  }, {});
};

export const updateRoleForUser = async (
  userId: string,
  newRole: CasbinRole,
) => {
  const user = `user:${userId}`;
  const e = await createEnforcer();
  await e.deleteRolesForUser(user);
  await e.addRoleForUser(user, newRole);
};

export const deleteRolesForUser = async (userId: string) => {
  const user = `user:${userId}`;
  const e = await createEnforcer();
  return await e.deleteRolesForUser(user);
};

export const addPermissionForRole = async (
  role: CasbinRole,
  obj: CasbinObj,
  act: CasbinAct,
) => {
  const e = await createEnforcer();
  await e.addPermissionForUser(role, obj, act);
};
