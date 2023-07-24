import { newEnforcer, newModelFromString } from 'casbin';
import { PrismaAdapter } from 'casbin-prisma-adapter';
import { prisma } from '../connectDB';
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
  })
  return e;
}

export const addRoleForUser = async (userId: string, role: CasbinRole) => {
  const e = await createEnforcer();
  return await e.addRoleForUser(userId, role);
}

export const hasPermission = async (userId: string, obj: CasbinObj, act: CasbinAct) => {
  const e = await createEnforcer();
  const effect = await e.enforce(userId, obj, act);
  return effect;
}

export const frontendPermissionObject = async (userId: string) => {
  const e = await createEnforcer();
  const namedGroupingPolicy = await e.getFilteredNamedGroupingPolicy('g', 0, userId!);
  const userRoles = namedGroupingPolicy.map((p) => {
    return p[1]
  });

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
  }, {})
}
