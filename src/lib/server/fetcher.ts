import type { Cookies } from '@sveltejs/kit';

export interface FetcherOptions {
  baseURL: string;
  debug?: boolean;
  getDefaultHeaders?: (
    cookies: Cookies,
  ) => Record<string, string> | Promise<Record<string, string>>;
}

export type FetcherBody = Record<string, unknown> | FormData | URLSearchParams;
export type FetcherQuery = Record<string, unknown>;

export interface FetcherParams<
  TQuery extends FetcherQuery = FetcherQuery,
  TBody extends FetcherBody = FetcherBody,
> {
  body?: TBody;
  cookies: Cookies;
  headers?: Record<string, string>;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  query?: TQuery;
}

export default class Fetcher {
  protected baseURL: string;

  constructor(private options: FetcherOptions) {
    this.baseURL = options.baseURL;
  }

  protected log(...args: unknown[]) {
    if (this.options.debug) {
      // eslint-disable-next-line no-console
      console.log(...args, '\n');
    }
  }

  private getURL<T extends FetcherQuery>(path: string, query?: T): string {
    const url = new URL(path, this.baseURL);

    if (query && typeof query === 'object') {
      for (const key in query) {
        const value = query[key];
        if (value) {
          url.searchParams.set(key, typeof value === 'string' ? value : JSON.stringify(value));
        }
      }
    }

    return url.href;
  }

  private async getRequestHeaders(
    cookies: Cookies,
    headersInit?: Record<string, string>,
  ): Promise<Record<string, string> | undefined> {
    if (typeof this.options.getDefaultHeaders === 'function') {
      const defaultHeaders = await this.options.getDefaultHeaders(cookies);
      return { ...defaultHeaders, ...headersInit };
    }

    return headersInit;
  }

  private getRequestBody<T extends FetcherBody>(body?: T): BodyInit | undefined {
    if (!body) return undefined;
    if (body instanceof FormData || body instanceof URLSearchParams) {
      return body;
    }
    return JSON.stringify(body);
  }

  private async getErrorResponse(response: Response): Promise<string> {
    const text = await response.clone().text();
    const message = this.buildErrorMessage(response.status, text);
    this.log('Error.', message);
    return message;
  }

  protected buildErrorMessage(status: number, message: string) {
    return `Status: ${status}. ${message}`;
  }

  public parseError(error: Error): { status: number; message: string } {
    let { message } = error;
    if (!message) return { status: 0, message: '' };

    let status = '';
    [, , status, message] = message.match(/(Status:\s(\d{1,3})\.)?(.*)/) ?? [];

    if (!status) return { status: 0, message: message.trim() };

    return {
      status: parseInt(status),
      message: message.trim(),
    };
  }

  protected async fetcher<
    T,
    TQuery extends FetcherQuery = FetcherQuery,
    TBody extends FetcherBody = FetcherBody,
  >({
    body,
    cookies,
    headers,
    method = 'GET',
    path,
    query,
  }: FetcherParams<TQuery, TBody>): Promise<T> {
    const url = this.getURL(path, query);
    const reqBody = this.getRequestBody(body);
    const reqHeaders = await this.getRequestHeaders(cookies, headers);

    this.log(
      ...[
        '\n',
        method,
        url,
        reqBody ? `\nBody: ${reqBody.toString()}` : undefined,
        reqHeaders ? `\nHeaders: ${JSON.stringify(reqHeaders, null, 2)}` : undefined,
      ].filter(Boolean),
    );

    const response = await fetch(url, {
      body: reqBody,
      headers: reqHeaders,
      method,
    });

    if (!response.ok) {
      throw new Error(await this.getErrorResponse(response));
    }

    try {
      const data: T = await response.clone().json();
      return data;
    } catch (error) {
      throw new Error(await this.getErrorResponse(response));
    }
  }
}
