import axios from 'axios';
import { PDFExtract } from 'pdf.js-extract';
import { app_env } from '../../environment';
import { ServiceContext } from '../../types/context';

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
  num_specialties: number;
}

export const sourceRfpSpecialties = async (args: SourceRfpSpecialtiesArgs, ctx: ServiceContext) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${app_env.AI_SERVER_URL}/source-rfp-specialties/`,
      data: {
        ...args,
        prompt: '',
      },
    });

    const session = await ctx.prisma.sourcingSession.create({
      data: {
        task_id: response.data.id,
        project_title: args.project_title,
        project_desc: args.project_desc,
        preparation_details: args.preparation_details,
        vendor_requirement: args.vendor_requirement,
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

const sourcererService = {
  extractPdfToRfp,
  sourceRfpSpecialties,
};

export default sourcererService;