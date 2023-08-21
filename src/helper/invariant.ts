const defaultMessage = 'Something went wrong.'

// Throw an error if the condition fails
// Strip out error messages for production
// > Not providing an inline default argument for message as the result is smaller
export default function invariant(
  condition: any,
  message?: string | (() => string) | Error,
): asserts condition {
  if (condition) {
    return;
  }

  if (message instanceof Error) {
    throw message;
  }

  const provided: string | undefined = typeof message === 'function' ? message() : message;

  const value: string = provided ? provided : defaultMessage;
  throw new Error(value);
}
