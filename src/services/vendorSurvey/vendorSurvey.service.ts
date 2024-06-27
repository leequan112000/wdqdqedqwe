import { ServiceContext } from '../../types/context';
import {
  AdminTeam,
  VendorSurveyFilePath,
  VendorSurveyStatus,
} from '../../helper/constant';
import storeUpload from '../../helper/storeUpload';
import { sendAdminGeneralNoticeEmail } from '../../mailer/admin';
import Sentry from '../../sentry';

type UploadParamType = {
  filename: string;
  createReadStream: () => any;
};

export type CreateVendorSurveyArgs = {
  vendor_company_id?: string | null;
  company_name: string;
  company_types: string[];
  company_description: string;
  company_ipo_status: string;
  company_revenue: string;
  company_size: string;
  website: string;
  countries: string[];
  subspecialty_ids: string[];
  custom_specialties: string[];
  certifications?: string[];
  products?: string[];
  email: string;
  note?: string;
  logo: UploadParamType;
  attachment?: UploadParamType;
};

export const createVendorSurvey = async (
  args: CreateVendorSurveyArgs,
  context: ServiceContext,
) => {
  const {
    vendor_company_id,
    company_name,
    company_description,
    company_ipo_status,
    company_revenue,
    company_size,
    company_types,
    website,
    countries,
    subspecialty_ids,
    custom_specialties,
    certifications,
    products,
    email,
    note,
    logo,
    attachment,
  } = args;

  const { bucket, key } = await storeUpload(
    logo,
    VendorSurveyFilePath.LOGO,
    true,
  );

  const logo_url = `https://${bucket}.s3.amazonaws.com/${key}`;

  let attachment_key = '',
    attachment_file_name = '',
    attachment_content_type = '';
  if (attachment) {
    const { filename, key, contentType } = await storeUpload(
      attachment,
      VendorSurveyFilePath.ATTACHMENT,
    );

    attachment_key = key;
    attachment_file_name = filename;
    attachment_content_type = contentType as string;
  }

  const vendorSurvey = await context.prismaCRODb!.vendorSurvey.create({
    data: {
      vendor_company_id,
      company_name,
      company_description,
      company_ipo_status,
      company_revenue,
      company_size,
      company_types,
      logo_url,
      website,
      countries,
      subspecialty_ids,
      custom_specialties,
      certifications,
      products,
      email,
      note,
      status: VendorSurveyStatus.PENDING,
      attachment_key,
      attachment_file_name,
      attachment_content_type,
    },
  });

  try {
    const admins = await context.prisma.admin.findMany({
      where: {
        team: AdminTeam.SCIENCE,
      },
    });

    await Promise.all(
      admins.map((admin) =>
        sendAdminGeneralNoticeEmail(admin, {
          subject: `New Vendor Survey Response Received`,
          preheader:
            "We've just received a new vendor survey response. Please review the details below.",
          button_label: 'View response',
          button_url:
            'https://cromatic.retool.com/apps/f3938150-ca1e-11ee-82b5-e3f66a469af9/Cromatic%20Web/Manage%20Vendor%20Survey',
          content_title: `New Response Received`,
          content_body: `We have received a new vendor survey response from ${company_name} on ${vendorSurvey.created_at}.`,
          content_footer:
            'Please kindly reach out to the engineering team if any problem.',
        }),
      ),
    );
  } catch (error) {
    Sentry.captureException(error);
  }
};

const vendorSurveyService = {
  createVendorSurvey,
};

export default vendorSurveyService;
