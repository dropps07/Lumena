import { listGradients, saveGradient } from "@/lib/db/queries";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try{
        const config = await req.json();
        const saved = await saveGradient(config);
        return NextResponse.json(saved, {status : 201});
    }catch(err){
        console.log(err);
        return NextResponse.json({error: "Failed to save"}, {status: 500});
    }
}

export async function GET(req: NextRequest) {
    const page = Number(req.nextUrl.searchParams.get("page")?? 1);
    const gradients = await listGradients(page);
    return NextResponse.json(gradients);
}