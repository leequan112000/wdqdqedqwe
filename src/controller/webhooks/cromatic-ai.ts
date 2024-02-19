import crypto from "crypto";
import { Request, Response } from 'express';
import { prisma } from '../../prisma';
import { pubsub } from "../../helper/pubsub";

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
        if (sourcing_session) {
          await prisma.sourcingSpecialty.createMany({
            data: data.map((specialtyString: string) => {
              return {
                name: specialtyString,
                sourcing_session_id: sourcing_session.id,
              }
            })
          });
        }
        pubsub.publish("SOURCE_RFP_SPECIALTIES", { sourceRfpSpecialties: { task_id, sourcing_session_id: sourcing_session?.id, data } });
      }
      case "source_cros": {
        const sourcing_session = await prisma.sourcingSession.findFirst({
          where: {
            task_id,
          },
        });
        if (sourcing_session) {
          await prisma.sourcedCro.createMany({
            data: data.map((cro: { cro_name: string, cro_id: string, score: number }) => {
              return {
                name: cro.cro_name,
                cro_db_id: cro.cro_id,
                score: cro.score,
                is_shortlisted: false,
                sourcing_session_id: sourcing_session.id,
              }
            })
          });
        }
        pubsub.publish("SOURCE_CROS", { sourceCros: { task_id, sourcing_session_id: sourcing_session?.id, data } });
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
