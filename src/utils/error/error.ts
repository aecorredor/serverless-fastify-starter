/**
 * Used in switch statements for exhaustiveness.
 *
 * @param unreachableSubject
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const assertUnreachable = (unreachableSubject: never): never => {
  throw new Error("Didn't expect to get here");
};

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
    this.name = 'BadRequestError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
    this.name = 'NotFoundError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
    this.name = 'AuthenticationError';
  }
}

export class InternalServerError extends Error {
  constructor() {
    super('Internal Server Error');
    Object.setPrototypeOf(this, InternalServerError.prototype);
    this.name = 'InternalServerError';
  }
}
