export enum ContentTypeEnum {
  FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
  JSON = "application/json;charset=UTF-8",
  FORM_DATA = "multipart/form-data;charset=UTF-8",
}
export enum RequestMethodEnum {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}
export enum HttpCodeEnum {
  CONTINUE = 100,
  OK = 200,
  CREATED = 201,
  MULTIPLE_CHOICES = 300,
  MOVED_PERMANENTLY = 301,
  MOVED_TEMPORARILY = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  USE_PROXY = 305,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  GATEWAY_TIMEOUT = 504,
}
