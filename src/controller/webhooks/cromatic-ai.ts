import crypto from "crypto";
import { Request, Response } from 'express';
import { prisma } from '../../prisma';
import { pubsub } from "../../helper/pubsub";
import invariant from "../../helper/invariant";

const verifySignature = (req: Request, signature: string): boolean => {
  // Sort keys alphabetically before stringifying the payload
  const jsonBody = JSON.parse(req.body);
  const jsonBodyStr = JSON.stringify(jsonBody);
  const computedSignature = crypto
    .createHmac('sha256', process.env.CROMATIC_AI_WEBHOOK_SECRET!)
    .update(jsonBodyStr)
    .digest('hex');

  // Compare the computed signature with the expected signature
  if (computedSignature === signature) {
    return true;
  } else {
    return false;
  }
}

export const cromaticAiWebhook = async (req: Request, res: Response): Promise<void> => {
  const signature = req.query.signature;
  if (!verifySignature(req, signature as string)) {
    res.status(400).send(`Webhook Error: Invalid signature`);
    return;
  }

  const payload = JSON.parse(req.body);
  const data = payload.data;
  const task_id = payload.task_id;
  const event_name = payload.event_name;

  try {
    switch (event_name) {
      case "source_rfp_specialties": {
        const sourcing_session = await prisma.sourcingSession.findFirst({
          where: {
            task_id,
          },
        });

        invariant(sourcing_session, 'No sourcing session found');

        invariant(sourcing_session.task_canceled_at === null, 'Task is revoked. Skipping...');

        prisma.$transaction(async (trx) => {
          // Clear up existing records
          await trx.sourcingSubspecialty.deleteMany({
            where: {
              sourcing_session_id: sourcing_session.id,
            }
          });

          // Filter subspecialty below 0.7 weight threshold
          const filteredSubspecialtyNames = data
            .map((subspecialtyString: string) => {
              const [subspecialtyName, weight] = subspecialtyString.split(',').map(item => item.trim());
              return { subspecialtyName, weight: parseFloat(weight) };
            })
            .filter(({ weight }: { weight: number }) => weight >= 0.7)
            .map(({ subspecialtyName }: { subspecialtyName: string }) => subspecialtyName);

          await Promise.all(
            filteredSubspecialtyNames.map(async (subspecialtyName: string) => {
              return await trx.sourcingSubspecialty.create({
                data: {
                  name: subspecialtyName,
                  sourcing_session_id: sourcing_session.id,
                }
              });
            })
          );

          pubsub.publish("SOURCE_RFP_SPECIALTIES", { sourceRfpSpecialties: { task_id, sourcing_session_id: sourcing_session?.id, data: sourcing_session } });
        });
        break;
      }
      case "source_cros": {
        const sourcing_session = await prisma.sourcingSession.findFirst({
          where: {
            task_id,
          },
        });

        invariant(sourcing_session, 'No sourcing session found');

        invariant(sourcing_session.task_canceled_at === null, 'Task is revoked. Skipping...');

        prisma.$transaction(async (trx) => {
          const cappedData = data.slice(0, 50);
          const sourcedCros = await Promise.all(
            cappedData.map(async (cro: { cro_name: string, cro_id: string, score: string }) => {
              return await trx.sourcedCro.create({
                data: {
                  name: cro.cro_name,
                  cro_db_id: cro.cro_id,
                  score: parseFloat(cro.score),
                  is_shortlisted: false,
                  sourcing_session_id: sourcing_session.id,
                }
              })
            })
          );

          pubsub.publish("SOURCE_CROS", { sourceCros: { task_id, sourcing_session_id: sourcing_session.id, data: sourcing_session } });
        });
        break;
      }
      default:
        break;
    }
    res.status(200).send('OK');
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(`Webhook Error: ${error.message}`);
    } else {
      res.status(400).send('Webhook Error');
    }
  }
};
