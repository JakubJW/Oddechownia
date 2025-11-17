export class AppError extends Error {
  status: number;
  userMessage?: string;

  constructor(message: string, status: number = 500, userMessage?: string) {
    super(message);
    this.status = status;
    this.userMessage = userMessage;
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found.`, 404, 'The requested item was not found.');
  }
}

export class ConflictError extends AppError {
  constructor(
    resource: string = 'Resource',
    userMessage: string = 'Item already exists.'
  ) {
    super(`A conflict occured in: ${resource}`, 409, userMessage);
  }
}

export class AuthenticationError extends AppError {
  constructor(
    resource: string = 'Resource',
    userMessage: string = 'Aby wykonać tę akcję musisz być zalogowany.'
  ) {
    super(`Unauthenticated access attempt to: ${resource}.`, 401, userMessage);
  }
}

export class BadRequestError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found.`, 400, 'Bad request.');
  }
}

export class AuthorizationError extends AppError {
  constructor(resource: string = 'Resource', userMessage?: string) {
    super(`Unauthorized access attempt to: ${resource}`, 403, userMessage);
  }
}

export class GenralError extends AppError {
  constructor(resource: string = 'Resource') {
    super(
      `${resource} not found.`,
      500,
      'Przepraszamy, wystąpił niespodziewany błąd. Skontaktuj się z administratorem systemu.'
    );
  }
}
