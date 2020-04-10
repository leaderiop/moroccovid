import { ErrorMessageModel } from './error-message.model';

export interface ErrorResponseModel {
  statusCode: number;
  error: string;
  message: [ErrorMessageModel];
  errors: any;
  timestamp: Date;
  path: string;
}
