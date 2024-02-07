import { ServiceContext } from '../../types/context';
import { VendorSurveyFilePath, VendorSurveyStatus } from '../../helper/constant';
import storeUpload from '../../helper/storeUpload';

type UploadParamType = {
  filename: string;
  createReadStream: () => any;
}

export type CreateVendorSurveyArgs = {
  vendor_company_id: string;
  company_name: string;
  company_types: string[];
  website: string;
  countries: string[];
  subspecialty_ids: string[];
  custom_specialties: string[];
  certifications: string[];
  product?: string;
  note?: string;
  logo: UploadParamType;
  attachment?: UploadParamType;
}

export const createVendorSurvey = async (args: CreateVendorSurveyArgs, context: ServiceContext) => {
  const {
    vendor_company_id,
    company_name,
    company_types,
    website,
    countries,
    subspecialty_ids,
    custom_specialties,
    certifications,
    product,
    note,
    logo,
    attachment
  } = args;

  const { bucket, key } = await storeUpload(
    logo,
    VendorSurveyFilePath.LOGO,
    true
  );

  const logo_url = `https://${bucket}.s3.amazonaws.com/${key}`;

  let attachment_key = '', attachment_file_name = '', attachment_content_type = '';
  if (attachment) {
    const { filename, key, contentType } = await storeUpload(
      attachment,
      VendorSurveyFilePath.ATTACHMENT,
    );

    attachment_key = key;
    attachment_file_name = filename;
    attachment_content_type = contentType as string;
  }

  await context.prismaCRODb!.vendorSurvey.create({
    data: {
      vendor_company_id,
      company_name,
      company_types,
      logo_url,
      website,
      countries,
      subspecialty_ids,
      custom_specialties,
      certifications,
      product,
      note,
      status: VendorSurveyStatus.PENDING,
      attachment_key,
      attachment_file_name,
      attachment_content_type,
    }
  });
}

const vendorSurveyService = {
  createVendorSurvey,
};

export default vendorSurveyService;
