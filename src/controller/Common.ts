import { Response } from "express";

type Data<T> = {
  err: null,
  data: T
}

type Error = {
  err: string,
  data: null
}

type PageData<T> = {
  err: null,
  count: number,
  data: T,
  page: number,
  limit: number,
  key?: string
}

type PageError = {
  err: string,
  count: 0,
  data: []
}

export type ResponseResult<T> = Data<T> | Error;
export type ResponsePageData<T> = PageData<T> | PageError;

export function sendData(data: any) {
  return {
    err: null,
    data
  };
}

export function sendError(err) {
  return {
    err,
    data: null
  };
}

export function sendPageData<T>(data: T[], count: number, limit: number, page: number, key: string): PageData<T[]> {
  return {
    data,
    err: null,
    count,
    limit,
    page,
    key
  }
}

export function sendPageError(err: string): PageError {
  return {
    data: null,
    err,
    count: 0
  }
}