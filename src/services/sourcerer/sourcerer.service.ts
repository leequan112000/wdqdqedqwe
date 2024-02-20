import axios from 'axios';
import { PDFExtract } from 'pdf.js-extract';
import { app_env } from '../../environment';
import { ServiceContext } from '../../types/context';
import { InputMaybe } from '../../graphql/generated';

export type ExtractPdfToRfpArgs = {
  filename: string;
  createReadStream: () => any;
}

const extractAndAppendPdfText = async (content: any) => {
  let pdfString = "";

  content.forEach((item: any) => {
    const text = item.str.trim();
    if (text) {
      pdfString = pdfString + "\n" + text;
    }
  });

  return pdfString
};

export const extractPdfToRfp = async (args: ExtractPdfToRfpArgs) => {
  const { createReadStream } = args;

  const stream = createReadStream();
  let buffer = Buffer.from([]);

  stream.on('data', (chunk: any) => {
    buffer = Buffer.concat([buffer, chunk]);
  });

  await new Promise((resolve, reject) => {
    stream.on('end', resolve);
    stream.on('error', reject);
  });

  const pdfExtract = new PDFExtract();
  const data = await pdfExtract.extractBuffer(buffer);
  const allPdfPagesContent = data.pages.flatMap(page => page.content)
  const pdfString = await extractAndAppendPdfText(allPdfPagesContent);
  try {
    const response = await axios({
      method: 'post',
      url: `${app_env.AI_SERVER_URL}/extract-rfp/`,
      data: { pdf_string: pdfString },
    });
    return JSON.parse(response.data);
  } catch (error) {
    throw error;
  }
}

export type SourceRfpSpecialtiesArgs = {
  project_title: string;
  project_desc: string;
  preparation_details: string;
  vendor_requirement: string;
  biotech_id: string;
  num_specialties: number;
  sourcing_session_id?: InputMaybe<string> | undefined;
}

export const sourceRfpSpecialties = async (args: SourceRfpSpecialtiesArgs, ctx: ServiceContext) => {
  try {
    const { sourcing_session_id, ...rest_args} = args;
    const response = await axios({
      method: 'post',
      url: `${app_env.AI_SERVER_URL}/source-rfp-specialties/`,
      data: {
        ...rest_args,
        prompt: '',
      },
    });

    if (sourcing_session_id) {
      return {
        sourcing_session_id,
        ...response.data
      };
    }

    const session = await ctx.prisma.sourcingSession.create({
      data: {
        task_id: response.data.id,
        project_title: args.project_title,
        project_desc: args.project_desc,
        preparation_details: args.preparation_details,
        vendor_requirement: args.vendor_requirement,
        biotech_id: args.biotech_id,
      }
    });

    return {
      sourcing_session_id: session.id,
      ...response.data
    };
  } catch (error) {
    throw error;
  }
}

export type SourceCrosArgs = {
  subspecialty_names_with_weight: {
    name: string;
    weight: number;
    sourcing_specialty_id: string;
  }[];
  sourcing_session_id: string;
}

export const sourceCros = async (args: SourceCrosArgs, ctx: ServiceContext) => {
  try {
    const { subspecialty_names_with_weight, sourcing_session_id } = args;
    const response = await axios({
      method: 'post',
      url: `${app_env.AI_SERVER_URL}/source-cro/`,
      data: {
        weighted_specs: subspecialty_names_with_weight.map(s => `${s.name}, ${s.weight}`),
      },
    });

    await ctx.prisma.sourcingSession.update({
      where: {
        id: sourcing_session_id,
      },
      data: {
        task_id: response.data.id,
      }
    });

    await ctx.prisma.sourcingSubspecialty.deleteMany({
      where: {
        sourcing_session_id,
      }
    });

    await ctx.prisma.sourcingSubspecialty.createMany({
      data: subspecialty_names_with_weight.map(s => ({
        sourcing_session_id,
        name: s.name,
        weight: s.weight,
        sourcing_specialty_id: s.sourcing_specialty_id,
      })),
    });

    return {
      sourcing_session_id,
      ...response.data
    };
  } catch (error) {
    throw error;
  }
}

const sourcererService = {
  extractPdfToRfp,
  sourceRfpSpecialties,
  sourceCros,
};

export default sourcererService;