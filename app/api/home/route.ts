import { NextResponse } from "next/server";

export async function GET(req:Request) {
    return NextResponse.json({
        name: "Md Kaif Manzar",
        Project: "LMS",
        Phone: "6200561062",
        Email: "kaifmanzar321@gmail.com"
    })
}