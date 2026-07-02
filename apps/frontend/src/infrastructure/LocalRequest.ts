import { inject, injectable } from "inversify";
import { TYPES } from "./Container.types";
import { UserState } from "@/state/User.state";
import { toast } from "sonner";

interface Option {
  mock: boolean;
}

@injectable()
export abstract class LocalRequest<
  Data,
  Response,
  RequestOutput,
  ErrorResponse = string,
> {
  constructor(
    @inject(TYPES.UserState)
    protected readonly userState: UserState,
  ) {}

  protected toastConfig = {
    loading: 'Loading...',
    success: 'Done!',
    error: 'Error occurred',
  };

  protected showProgressInToast = false;
  abstract mockOutputData: RequestOutput | undefined;

  async execute(request_data: Data, option?: Option): Promise<Response> {
    let resolveToaster = (str: string) => {};
    let rejectToaster = (str: string) => {};

    const pr = new Promise<string>((res, rej) => {
      resolveToaster = res;
      rejectToaster = (err: string) => rej(err);
    });

    if (this.showProgressInToast) {
      toast.promise(pr, this.toastConfig);
    }

    try {
      const output = option?.mock
        ? (this.mockOutputData ?? ({} as unknown as RequestOutput))
        : await this.mapData(request_data);

      resolveToaster(this.toastConfig.success);
      return await this.onSuccess(output);
    } catch (error) {
      const err = error as Error;

      if (this.onError) this.onError(err);

      rejectToaster(err?.message ?? this.toastConfig.error);
      throw err;
    }
  }

  mockOnError(): ErrorResponse | undefined {
    if (this.onError) return this.onError(new Error('Mock error'));
    return;
  }

  abstract onSuccess(data: RequestOutput): Response | Promise<Response>;
  abstract mapData(data: Data): RequestOutput | Promise<RequestOutput>;
  protected onError?(error: Error): ErrorResponse;
}