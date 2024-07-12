import axios from 'axios';
import { PDFExtract } from 'pdf.js-extract';
import { app_env } from '../../environment';
import { ServiceContext } from '../../types/context';
import { InputMaybe } from '../../graphql/generated';
import storeUpload from '../../helper/storeUpload';
import { deleteObject } from '../../helper/awsS3';
import { PublicError } from '../../graphql/errors/PublicError';
import { redis } from '../../redis';

export type ExtractPdfToRfpArgs = {
  sourcing_session_id?: string;
  user_id: string;
  file: {
    filename: string;
    createReadStream: () => any;
  };
};

const extractAndAppendPdfText = async (content: any) => {
  let pdfString = '';

  content.forEach((item: any) => {
    const text = item.str.trim();
    if (text) {
      pdfString = pdfString + '\n' + text;
    }
  });

  return pdfString;
};

export const extractPdfToRfp = async (
  args: ExtractPdfToRfpArgs,
  ctx: ServiceContext,
) => {
  const { file, user_id, sourcing_session_id } = args;
  const { createReadStream } = file;
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
  const allPdfPagesContent = data.pages.flatMap((page) => page.content);
  const pdfString = await extractAndAppendPdfText(allPdfPagesContent);
  try {
    const response = await axios({
      method: 'post',
      url: `${app_env.AI_SERVER_URL}/extract-rfp/`,
      data: { pdf_string: pdfString },
    });

    if (response.data === 'EMPTY') {
      throw new PublicError(
        'Encountered an issue proccessing the file. Please try again with a different document.',
      );
    }

    const {
      project_title,
      project_desc,
      preparation_details,
      vendor_requirement,
    } = JSON.parse(response.data);
    const { filename, key, filesize } = await storeUpload(
      file,
      'sourcerer_rfp',
    );

    if (sourcing_session_id) {
      const existingRfp = await ctx.prismaCRODb!.sourcingAttachment.findFirst({
        where: {
          sourcing_session_id,
        },
      });
      if (existingRfp) {
        await ctx.prismaCRODb!.sourcingAttachment.update({
          data: {
            byte_size: filesize,
            filename,
            key,
          },
          where: {
            id: existingRfp.id,
          },
        });
        // delete the old attachment s3 object
        await deleteObject(existingRfp.key);
      }

      const existingSubspecialties =
        await ctx.prismaCRODb!.sourcingSubspecialty.findMany({
          where: {
            sourcing_session_id,
          },
        });

      if (existingSubspecialties.length > 0) {
        await ctx.prismaCRODb!.sourcingSubspecialty.deleteMany({
          where: {
            sourcing_session_id,
          },
        });
      }

      const existingSourcedVendors = await ctx.prismaCRODb!.sourcedCro.findMany(
        {
          where: {
            sourcing_session_id,
          },
        },
      );
      if (existingSourcedVendors.length > 0) {
        await ctx.prismaCRODb!.sourcedCro.deleteMany({
          where: {
            sourcing_session_id,
          },
        });
      }

      return await ctx.prismaCRODb!.sourcingSession.update({
        where: {
          id: sourcing_session_id,
        },
        data: {
          project_title,
          project_desc,
          preparation_details,
          vendor_requirement,

          sourcing_extracted_rfp: {
            upsert: {
              create: {
                project_title,
                project_desc,
                preparation_details,
                vendor_requirement,
              },
              update: {
                project_title,
                project_desc,
                preparation_details,
                vendor_requirement,
              },
            },
          },
        },
      });
    } else {
      return await ctx.prismaCRODb!.sourcingSession.create({
        data: {
          task_id: '',
          project_title,
          project_desc,
          preparation_details,
          vendor_requirement,
          user_id,

          sourcing_extracted_rfp: {
            create: {
              project_title,
              project_desc,
              preparation_details,
              vendor_requirement,
            },
          },

          sourcing_attachments: {
            create: {
              byte_size: filesize,
              filename,
              key,
            },
          },
        },
      });
    }
  } catch (error) {
    throw error;
  }
};

export type SourceRfpSpecialtiesArgs = {
  project_title: string;
  project_desc: string;
  preparation_details: string;
  vendor_requirement: string;
  user_id: string;
  num_specialties: number;
  sourcing_session_id?: InputMaybe<string> | undefined;
};

export const sourceRfpSpecialties = async (
  args: SourceRfpSpecialtiesArgs,
  ctx: ServiceContext,
) => {
  try {
    const { sourcing_session_id, ...rest_args } = args;
    const response = await axios({
      method: 'post',
      url: `${app_env.AI_SERVER_URL}/source-rfp-specialties/`,
      data: {
        ...rest_args,
        prompt: '',
      },
    });

    if (sourcing_session_id) {
      await redis.del(`cancel-ai-task:${sourcing_session_id}`);

      await ctx.prismaCRODb!.sourcingSession.update({
        where: {
          id: sourcing_session_id,
        },
        data: {
          task_id: response.data.id,
          task_canceled_at: null,
          project_title: args.project_title,
          project_desc: args.project_desc,
          preparation_details: args.preparation_details,
          vendor_requirement: args.vendor_requirement,
          user_id: args.user_id,
        },
      });

      return {
        sourcing_session_id,
        ...response.data,
      };
    }

    const session = await ctx.prismaCRODb!.sourcingSession.create({
      data: {
        task_id: response.data.id,
        project_title: args.project_title,
        project_desc: args.project_desc,
        preparation_details: args.preparation_details,
        vendor_requirement: args.vendor_requirement,
        user_id: args.user_id,
      },
    });

    return {
      sourcing_session_id: session.id,
      ...response.data,
    };
  } catch (error) {
    throw error;
  }
};

export type SourceCrosArgs = {
  names: string[];
  sourcing_session_id: string;
};

export const sourceCros = async (args: SourceCrosArgs, ctx: ServiceContext) => {
  try {
    const { names, sourcing_session_id } = args;
    const response = await axios({
      method: 'post',
      url: `${app_env.AI_SERVER_URL}/source-cro/`,
      data: {
        weighted_specs: names.map((name) => `${name}, 1`),
      },
    });

    await ctx.prismaCRODb!.sourcingSession.update({
      where: {
        id: sourcing_session_id,
      },
      data: {
        task_id: response.data.id,
        task_canceled_at: null,
      },
    });

    await redis.del(`cancel-ai-task:${sourcing_session_id}`);

    await ctx.prismaCRODb!.sourcingSubspecialty.deleteMany({
      where: {
        sourcing_session_id,
      },
    });

    await ctx.prismaCRODb!.sourcingSubspecialty.createMany({
      data: names.map((name) => ({
        sourcing_session_id,
        name,
      })),
    });

    return {
      sourcing_session_id,
      ...response.data,
    };
  } catch (error) {
    throw error;
  }
};

type RevokeAiTaskArgs = {
  task_id: string;
  sourcing_session_id: string;
};

export const revokeAiTask = async (
  args: RevokeAiTaskArgs,
  ctx: ServiceContext,
) => {
  const { task_id, sourcing_session_id } = args;

  await redis
    .multi()
    .set(`cancel-ai-task:${sourcing_session_id}`, 1, 'EX', 120)
    .exec();

  // Set canceled flag ASAP so that webhook could skip DB update.
  const updateSourcingSessionPromise = ctx.prismaCRODb!.sourcingSession.update({
    where: {
      id: sourcing_session_id,
    },
    data: {
      task_canceled_at: new Date(),
    },
  });

  const taskRemovePromise = axios({
    method: 'post',
    url: `${app_env.AI_SERVER_URL}/task-revoke/`,
    data: {
      task_id,
    },
  });

  const results = await Promise.all([
    updateSourcingSessionPromise,
    taskRemovePromise,
  ]);

  return {
    id: results?.[1]?.data?.id as string | undefined,
    sourcing_session_id,
  };
};

const sourcererService = {
  extractPdfToRfp,
  sourceRfpSpecialties,
  sourceCros,
  revokeAiTask,
};

export default sourcererService;
