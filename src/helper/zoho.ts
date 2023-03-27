import { User } from "@prisma/client";
import axios from "axios";
import { app_env } from "../environment";
import { ProjectAttachment } from "../graphql/generated";
import { getSignedUrl } from "./awsS3";


export const getZohoContractEditorUrl = async (contract: ProjectAttachment, user: User): Promise<string> => {
  try {
    const form = new FormData();
    const signedUrl = await getSignedUrl(contract.key!);
    form.append('apikey', process.env.ZOHO_API_KEY!);
    form.append('url', signedUrl);
    form.append('document_defaults', JSON.stringify({ track_changes: 'enabled', language: 'en-US' }));
    form.append('editor_settings', JSON.stringify({ unit: 'in', language: 'en', view: 'webview' }));
    form.append('permissions', JSON.stringify({
      'document.export': true,
      'document.print': true,
      'document.edit': true,
      'review.changes.resolve': true,
      'review.comment': true,
      'collab.chat': true,
      'document.pausecollaboration': false,
      'document.fill': true,
    }));
    form.append('callback_settings', JSON.stringify({
      save_format: 'docx',
      save_url: `${app_env.SERVER_URL}/webhook/zoho`,
      save_url_params: {
        file_id: contract.id,
        user_id: user.id,
      }
    }));
    form.append('document_info', JSON.stringify({ document_name: contract.filename, document_id: contract.id }));
    form.append('user_info', JSON.stringify({ user_id: user.id, display_name: user.first_name }));
    form.append('ui_options', JSON.stringify({ save_button: 'show', chat_panel: 'show', dark_mode: 'hide', file_menu: 'show' }));

    const response = await axios({
      method: 'post',
      url: 'https://api.office-integrator.com/writer/officeapi/v1/documents',
      data: form,
      headers: {
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
      },
    });

    return response.data.document_url;
  } catch (error) {
    throw error;
  }
}