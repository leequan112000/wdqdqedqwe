import { ApolloServerPlugin } from "@apollo/server";
import Sentry from "../sentry";

// add operation name here to whitelist
export const operationWhitelist = [
  'signInUserMutation',
  'signUpCustomerMutation',
  'ResetPassword_Mutation',
  'ForgotPassword_Mutation',
  'SubmitCroInterest',
];

export const ApolloServerPluginSentryMonitor = (): ApolloServerPlugin => ({
  async requestDidStart(_) {
    /* Within this returned object, define functions that respond
       to request-specific lifecycle events. */
    return {
      async didEncounterErrors(ctx) {
        // If we couldn't parse the operation, don't
        // do anything here
        if (!ctx.operation) {
          return;
        }

        for (const err of ctx.errors) {
          // Skip public error. Public error is intened for user.
          if (err.extensions.code === 'PUBLIC_ERROR_CODE') {
            continue;
          }

          // Add scoped report details and send to Sentry
          Sentry.withScope(scope => {
            // Annotate whether failing operation was query/mutation/subscription
            scope.setTag("kind", ctx.operation!.operation);

            // Log query and variables as extras (make sure to strip out sensitive data!)
            scope.setExtra("query", ctx.request.query);
            scope.setExtra("variables", ctx.request.variables);

            if (err.path) {
              // We can also add the path as breadcrumb
              scope.addBreadcrumb({
                category: "query-path",
                message: err.path.join(" > "),
                level: "debug"
              });
            }

            Sentry.captureException(err);
          });
        }
      }
    };
  }
});
