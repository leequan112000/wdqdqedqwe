import { Request, Response } from 'express';
import { googleClient } from '../../helper/googleCalendar';
import { OauthProvider } from '../../helper/constant';
import { codeVerifier, decryptOauthState } from '../../helper/oauth';
import { app_env } from '../../environment';
import prisma from '../../prisma';
import Sentry from '../../sentry';

export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await googleClient.code.getToken(
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

    await prisma.oauth.upsert({
      where: {
        user_id_provider: {
          user_id,
          provider: OauthProvider.GOOGLE,
        }
      },
      create: {
        user_id,
        provider: OauthProvider.GOOGLE,
        access_token: response.accessToken,
        refresh_token: response.refreshToken,
      },
      update: {
        user_id,
        provider: OauthProvider.GOOGLE,
        access_token: response.accessToken,
        refresh_token: response.refreshToken,
      },
    });

    res.redirect(redirect_url ?? `${app_env.APP_URL}/app/meeting-events`);
    return;
  } catch (error) {
    Sentry.captureException(error);
    res.redirect(`${app_env.APP_URL}/app/meeting-events?error=AuthenticationFailed`);
    return;
  }
};
