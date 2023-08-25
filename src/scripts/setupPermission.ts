import { addPermissionForRole } from "../helper/casbin";
import { CasbinAct, CasbinObj, CasbinRole } from "../helper/constant";

const main = async () => {
  try {
    const promises = [
      { role: CasbinRole.ADMIN, obj: CasbinObj.PROJECT_REQUEST, act: CasbinAct.WRITE },
      { role: CasbinRole.ADMIN, obj: CasbinObj.COMPANY_COLLABORATOR_USER, act: CasbinAct.WRITE },
      { role: CasbinRole.ADMIN, obj: CasbinObj.COMPANY_COLLABORATOR_USER, act: CasbinAct.DELETE },
      { role: CasbinRole.ADMIN, obj: CasbinObj.COMPANY_COLLABORATOR_ADMIN, act: CasbinAct.WRITE },
      { role: CasbinRole.ADMIN, obj: CasbinObj.COMPANY_INFO, act: CasbinAct.WRITE },
      { role: CasbinRole.ADMIN, obj: CasbinObj.PAYOUT_ACCOUNT, act: CasbinAct.WRITE },
      { role: CasbinRole.ADMIN, obj: CasbinObj.MILESTONE_PAYMENT, act: CasbinAct.WRITE },
      { role: CasbinRole.ADMIN, obj: CasbinObj.PROJECT_COLLABORATOR, act: CasbinAct.WRITE },
      { role: CasbinRole.ADMIN, obj: CasbinObj.PROJECT_COLLABORATOR, act: CasbinAct.DELETE },
    ].map(async (d) => {
      await addPermissionForRole(d.role, d.obj, d.act);
    });

    await Promise.all(promises);
  } catch (error) {
    console.log('Operation failed.')
    console.log(error);
  }
  process.exit(0);
}

main();
