import { Biotech, Customer, User, VendorCompany, VendorMember } from "@prisma/client";
import moment from 'moment';
import * as PandaDocApi from "pandadoc-node-client";

const configuration = PandaDocApi.createConfiguration(
    { authMethods: {apiKey: `API-Key ${process.env.PANDADOC_API_KEY}`} }
);

export const pandaDocClient = new PandaDocApi.DocumentsApi(configuration);

const BIOTECH_CDA_TEMPLATE_ID = 'gm8v9BFuJYqf5R3UsUx3Rj';
const BIOTECH_CDA_FOLDER_ID = '8FjdKph2ycZaksnUr5pYjV';
const VENDOR_COMPANY_CDA_TEMPLATE_ID = 'ikPbiqeiJCC8gRKfVGZq25';
const VENDOR_COMPANY_CDA_FOLDER_ID = 'gHkVo2E8xgL3d7rNzkZRfR';

export const createBiotechCda = async (user: User & {customer: (Customer & { biotech: Biotech }) | null}): Promise<PandaDocApi.DocumentCreateResponse> => {
  try {
    const customer = user.customer;
    if (!customer) {
      throw new Error("Customer not found")
    }

    const biotech = customer.biotech;
    const result = await pandaDocClient.createDocument({
      documentCreateRequest: {
        name: `Cromatic <> ${biotech.name}`,
        templateUuid: BIOTECH_CDA_TEMPLATE_ID,
        folderUuid: BIOTECH_CDA_FOLDER_ID,
        recipients: [
          {
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: 'Client',
          },
        ],
        metadata: {
          recipient_type: 'client',
        },
        tokens: [
          {
            name: 'Client.Company',
            value: biotech.name,
          },
          {
            name: 'Client.StreetAddress',
            value: biotech.address || "",
          },
          {
            name: 'Client.Title',
            value: customer.job_title || "",
          },
        ],
        "fields": {
          "client_signatory_name": { "value": `${user.first_name} ${user.last_name}` },
          "client_signatory_title": { "value": customer.job_title },
        },
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
}

export const createVendorCompanyCda = async (user: User  & {vendor_member: (VendorMember & { vendor_company: VendorCompany | null}) | null}): Promise<PandaDocApi.DocumentCreateResponse> => {
  try {
    const vendor_member = user.vendor_member;
    if (!vendor_member || !vendor_member.vendor_company) {
      throw new Error("Vendor not found")
    }
    const vendor_company = vendor_member.vendor_company;
    const result = await pandaDocClient.createDocument({
      documentCreateRequest: {
        name: `Cromatic <> ${vendor_company.name}`,
        templateUuid: VENDOR_COMPANY_CDA_TEMPLATE_ID,
        folderUuid: VENDOR_COMPANY_CDA_FOLDER_ID,
        recipients: [
          {
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: 'Client',
          },
        ],
        metadata: {
          recipient_type: 'vendor',
        },
        tokens: [
          {
            name: 'Client.Company',
            value: vendor_company.name,
          },
          {
            name: 'Client.StreetAddress',
            value: vendor_company.address || "",
          },
          {
            name: 'Client.Title',
            value: vendor_member.title || "",
          },
        ],
        "fields": {
          "client_signatory_name": { "value": `${user.first_name} ${user.last_name}` },
          "client_signatory_title": { "value": vendor_member.title },
        },
      },
    });

    return result;
  } catch (error) {
    throw error;
  }
}

export const sendCda = async (file_id: string): Promise<PandaDocApi.DocumentSendResponse> => {
  try {
    const result = await pandaDocClient.sendDocument({
      id: file_id,
      documentSendRequest: {
        silent: true,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
}

export const createBiotechViewCdaSession = async (email: string, file_id: string): Promise<PandaDocApi.DocumentCreateLinkResponse> => {
  try {
    const one_day_in_seconds = Math.round(moment.duration(1, 'day').asSeconds());
    const result = await pandaDocClient.createDocumentLink({
      id: file_id,
      documentCreateLinkRequest: {
        recipient: email,
        lifetime: one_day_in_seconds,
      },
    });

    return result;
  } catch (error) {
    throw error;
  }
}

export const createVendorCompanyViewCdaSession = async (email: string, file_id: string): Promise<PandaDocApi.DocumentCreateLinkResponse> => {
  try {
    const one_day_in_seconds = Math.round(moment.duration(1, 'day').asSeconds());
    const result = await pandaDocClient.createDocumentLink({
      id: file_id,
      documentCreateLinkRequest: {
        recipient: email,
        lifetime: one_day_in_seconds,
      },
    });

    return result;
  } catch (error) {
    throw error;
  }
}