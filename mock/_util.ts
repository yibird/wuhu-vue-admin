export interface R<T = any> {
    code: number,
    message: string;
    data: T;
}

export interface RequestParams {
    method: string;
    body: any;
    headers?: { authorization?: string };
    query: any;
}

export function ok<T = Recordable>(data: T, message: string = "OK") {
    return {
        code: 200,
        data,
        message
    } as R<T>
}

export function error(message: string = "Error") {
    return {
        code: 500,
        data: null,
        message
    } as R
}

export function getRequestToken({ headers }: RequestParams): string | undefined {
    return headers?.authorization;
}