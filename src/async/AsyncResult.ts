export type AsyncResult<T> =
  | {
      status: "pending";
    }
  | {
      status: "success";
      data: T;
    }
  | {
      status: "error";
    };
