import crypto from "crypto";
import { Request, Response } from 'express';
import { context } from '../../context';
import { createBiotechViewCdaSession, sendCda } from '../../helper/pandadoc';

/*
 *   Pandadoc webhook endpoint
 *   Docs: https://developers.pandadoc.com/reference/on-document-status-change
 *   Description :
 *   Listen for events on from Panda doc to automatically trigger reactions.
 */

const verifySignature = (req: Request, signature: string): boolean => {
  const computedSignature = crypto
    .createHmac('sha256', process.env.PANDADOC_WEBHOOK_SECRET!)
    .update(req.body)
    .digest('hex');

  // Compare the computed signature with the expected signature
  if (computedSignature === signature) {
    return true;
  } else {
    return false;
  }  
}

export const pandadocWebhook = async (req: Request, res: Response): Promise<void> => {
  const signature = req.query.signature;
  if (!verifySignature(req, signature as string)) {
    res.status(400).send(`Webhook Error: Invalid signature`);
    return;
  }

  const event_payload = JSON.parse(req.body)[0];
  const data = event_payload.data;

  try {
    if (event_payload.event === 'document_state_changed' && data.metadata.recipient_type === 'client') {
      const doc_id = data.id;
      const biotech = await context.prisma.biotech.findFirst({
        where: {
          cda_pandadoc_file_id: doc_id
        },
        include: {
          customers: true
        }
      });
      if (!biotech) {
        res.status(200).send('OK');
        return;
      }
  
      if (data.status === 'document.draft') {
        // send document
        if (!biotech.cda_pandadoc_file_id) {
          throw new Error('Biotech has no cda file id');
        }
        await sendCda(biotech.cda_pandadoc_file_id);
      } else if (data.status === 'document.sent') {
        // generate session
        // TODO: store the customer who created the document in metadata
        if (biotech.customers.length > 1) {
          const recipient = data.recipients[0];
          await createBiotechViewCdaSession(recipient.email, biotech.cda_pandadoc_file_id as string);
        } else {
          const user = await context.prisma.user.findFirst({ where: { id: biotech.customers[0].user_id }})
          if (user) {
            await createBiotechViewCdaSession(user.email, biotech.cda_pandadoc_file_id as string);
          }
        }
      } else {
        console.debug(event_payload);
      }
    } else if (event_payload.event === 'document_state_changed' && data.metadata.recipient_type === 'vendor') {
      const doc_id = data.id;
      const vendor_company = await context.prisma.vendorCompany.findFirst({
        where: {
          cda_pandadoc_file_id: doc_id
        },
        include: {
          vendor_members: true
        }
      });

      if (!vendor_company) {
        res.status(200).send('OK');
        return;
      }
  
      if (data.status === 'document.draft') {
        // send document
        if (!vendor_company.cda_pandadoc_file_id) {
          throw new Error('Vendor company has no cda file id');
        }
  
        await sendCda(vendor_company.cda_pandadoc_file_id);
      } else if (data.status === 'document.sent') {
        // generate session
        // TODO: store the vendor member who created the document in metadata
        if (vendor_company.vendor_members.length > 1) {
          const recipient = data.recipients[0];
          await createBiotechViewCdaSession(recipient.email, vendor_company.cda_pandadoc_file_id as string);
        } else {
          const user = await context.prisma.user.findFirst({ where: { id: vendor_company.vendor_members[0].user_id }})
          if (user) {
            await createBiotechViewCdaSession(user.email, vendor_company.cda_pandadoc_file_id as string);
          }
        }
      } else {
        console.debug(event_payload);
      }
    } else if (event_payload.event === 'recipient_completed' && data.metadata.recipient_type === 'client') {
      const doc_id = data.id;
      const biotech = await context.prisma.biotech.findFirst({ where: { cda_pandadoc_file_id: doc_id }});
      if (!biotech) {
        res.status(200).send('OK');
        return;
      }

      await context.prisma.biotech.update({
        where: {
          id: biotech.id
        },
        data: {
          cda_signed_at: new Date()
        }
      });
    } else if (event_payload.event === 'recipient_completed' && data.metadata.recipient_type === 'vendor'){
      const doc_id = data.id;
      const vendor_company = await context.prisma.vendorCompany.findFirst({ where: { cda_pandadoc_file_id: doc_id }});
      if (!vendor_company) {
        res.status(200).send('OK');
        return;
      }

      await context.prisma.vendorCompany.update({
        where: {
          id: vendor_company.id
        },
        data: {
          cda_signed_at: new Date()
        }
      });
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
