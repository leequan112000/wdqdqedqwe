import client from '@sendgrid/client';
import type { ClientRequest } from '@sendgrid/client/src/request'

client.setApiKey(process.env.SENDGRID_API_KEY || '');

const NEWSLETTER_CONTACT_LIST_ID = '67e2381e-08b4-4b35-86a0-06528eaa265e';

export const upsertContacts = async (emails: string[]) => {
  const data: ClientRequest['body'] = {
    "list_ids": [
      NEWSLETTER_CONTACT_LIST_ID,
    ],
    "contacts": emails.map((email) => ({
      email,
    })),
  };

  const request: ClientRequest = {
    url: `/v3/marketing/contacts`,
    method: 'PUT',
    body: data
  }

  return client.request(request);
}
