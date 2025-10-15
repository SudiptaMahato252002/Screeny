import { unknown } from "better-auth"
import { ilike, sql } from "drizzle-orm";
import { url } from "inspector"
import { videos } from "@/drizzle/schema";

interface ApiFetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: object;
  expectJson?: boolean;
  bunnyType: "stream" | "storage";
}

export const getEnv=(key:string):string=>{
    const secret=process.env[key]
    if(!secret)
    {
        throw new Error(`Missing required env:${key}`)
    }
    return secret
}

export const withErrorHandling=<T,A extends unknown[]>(fn:(...args:A)=>Promise<T>)=>{
    return async(...args:A):Promise<T>=>{
        
        try 
        {
            const result=await fn(...args)
            return result
            
        } catch (error) {
            const errorMessage=error instanceof Error?error.message:"Unknown error occured"
            return errorMessage as unknown as T
        }
    }
}

export const apiFetch=async <T=Record<string,unknown>>(
    url:string,
    options:Omit<ApiFetchOptions,"bunnyType">&{
        bunnyType:"stream"|"storage"
    }
):Promise<T>=>{
    const {
        method="GET",
        headers={},
        body,
        expectJson=true,
        bunnyType
    }=options

    const key=getEnv(bunnyType==='stream'?"BUNNY_STREAM_ACCESS_KEY":"BUNNY_STORAGE_ACCESS_KEY")

    const requestHeaders = {
    ...headers,
    AccessKey: key,
    ...(bunnyType === "stream" && {
      accept: "application/json",
      ...(body && { "content-type": "application/json" }),
    }),
  };

  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    ...(body && { body: JSON.stringify(body) }),
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error(`API error ${response.text()}`);
  }

  if (method === "DELETE" || !expectJson) {
    return true as T;
  }

  return await response.json();

}


export const getOrderByClause=(filter?:string)=>{
  switch (filter){
    case 'Most Viewed':
      return sql`${videos.views} DESC`
    case 'Least Viewed':
      return sql`${videos.views} ASC`
    case "Oldest First":
      return sql`${videos.createdAt} ASC`;
    case "Most Recent":
    default:
      return sql`${videos.createdAt} DESC`
  }
}

export const doesTitleMatch=(videos:any,searchQuery:string)=>
  ilike(sql`REPLACE(REPLACE(REPLACE(LOWER(${videos.title}),'-',''),'.',''),' ','')`,
    `%${searchQuery.replace(/[-. ]/g,'').toLowerCase()}%`
  )
