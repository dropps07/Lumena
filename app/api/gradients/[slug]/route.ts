import { getGradientBySlug } from "@/lib/db/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest, {params}: {params: Promise<{slug: string}>}) {
    const { slug } = await params ;
    const gradient = await getGradientBySlug(slug);
    if(!gradient){
        return NextResponse.json({error:"Not Found!"}, {status:404});
    }
    return NextResponse.json(gradient);
}