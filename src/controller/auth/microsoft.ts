import { Request, Response } from 'express';
import { getMicrosoftUserInfo, microsoftClient, microsoftGraphClient } from '../../helper/microsoft';
import { CalendarIntegrationErrorType, OauthProvider } from '../../helper/constant';
import { codeVerifier, decryptOauthState } from '../../helper/oauth';
import { app_env } from '../../environment';
import { prisma } from '../../prisma';
import Sentry from '../../sentry';

const MicrosoftServicePlanId = {
  MicrosoftTeam: "57ff2da0-773e-42df-b2af-ffb7a2317929"
}

export const microsoftCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await microsoftClient.code.getToken(
      `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      {
        body: {
          code_verifier: codeVerifier
        }
      }
    );

    const state = decryptOauthState(req.query.state as string);
    const user_id = state.user_id;
    const redirect_url = state.redirect_url;

    if (!user_id) {
      throw new Error("No user ID!");
    }

    const user = await prisma.user.findFirst({
      where: {
        id: user_id,
      }
    });

    if (!user) {
      throw new Error("User not found!");
    }

    const client = microsoftGraphClient(response.accessToken);
    const resp = await getMicrosoftUserInfo(client, 'userPrincipalName,assignedPlans');
    if ((resp.assignedPlans || []).some((p) => p.servicePlanId === MicrosoftServicePlanId.MicrosoftTeam)) {
      await prisma.oauth.upsert({
        where: {
          user_id_provider: {
            user_id,
            provider: OauthProvider.MICROSOFT,
          }
        },
        create: {
          user_id,
          provider: OauthProvider.MICROSOFT,
          access_token: response.accessToken,
          refresh_token: response.refreshToken,
        },
        update: {
          user_id,
          provider: OauthProvider.MICROSOFT,
          access_token: response.accessToken,
          refresh_token: response.refreshToken,
        },
      });


      res.redirect(redirect_url ?? `${app_env.APP_URL}/app/meeting-events`);
      return;
    } else {
      res.redirect(`${app_env.APP_URL}/app/meeting-events?error=${CalendarIntegrationErrorType.NO_TEAMS_FOR_BUSINESS}`);
      return;
    }
  } catch (error) {
    Sentry.captureException(error);
    res.redirect(`${app_env.APP_URL}/app/meeting-events?error=${CalendarIntegrationErrorType.AUTHENTICATION_FAILED}`);
    return;
  }
};
