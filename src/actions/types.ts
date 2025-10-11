type SuccessResult<T> = {
  success: true;
  data: T;
  error: null;
};

type ErrorResult = {
  success: false;
  data: null;
  error: string;
};

export type ActionResult<T> = SuccessResult<T> | ErrorResult;
