import axios from 'axios';
import { PDFExtract } from 'pdf.js-extract';
import { app_env } from '../../environment';

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

const sourcererService = {
  extractPdfToRfp,
};

export default sourcererService;