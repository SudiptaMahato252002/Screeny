import { aj } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { ArcjetDecision, shield, slidingWindow, validateEmail } from "@arcjet/next";
import { toNextJsHandler } from "better-auth/next-js";
import ip from "@arcjet/ip";
import { NextRequest } from "next/server";


const emailValdation= aj.withRule(
    validateEmail({
        mode:'LIVE',
        block:['DISPOSABLE','INVALID','NO_MX_RECORDS']
    })
)

const ratelimit=aj.withRule(
    slidingWindow({
        mode:'LIVE',
        interval:'2m',
        max:2,
        characteristics:['fimgerprint']
    })
)

const shieldValidation=aj.withRule(
    shield({
        mode:'LIVE'
    })
)


const protectedAuth=async(req:NextRequest):Promise<ArcjetDecision>=>{
    const session=await auth.api.getSession({headers: req.headers})
    let userId:string
    if(session?.user.id)
    {
        userId=session.user.id
    }
    else{
        userId=ip(req)||'127.0.01'
    }

    if(req.nextUrl.pathname.startsWith('/api/auth/sign-in'))
    {
        const body=await req.clone().json()
        if(typeof body.email==='string')
        {
            return emailValdation.protect(req,{email: body.email})
        }
    }

    if(!req.nextUrl.pathname.startsWith('/api/auth/sign-out'))
    {
        return ratelimit.protect(req,{fimgerprint:userId})

    }
    return shieldValidation.protect(req);
}

const authHandler=toNextJsHandler(auth.handler)

export const {GET}=authHandler;

export const POST=async(req:NextRequest)=>{
    const decison=await protectedAuth(req)
    if(decison.isDenied())
    {
        if(decison.reason.isEmail())
        {
            throw new Error('Email Validation failed')
        }
        if(decison.reason.isRateLimit())
        {
            throw new Error('rate limit exceeded')
        }
        if(decison.reason.isShield())
        {
            throw new Error("Shield validation failed")
        }
    }
    return authHandler.POST(req)
}
