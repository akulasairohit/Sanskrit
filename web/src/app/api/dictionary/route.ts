import { NextResponse } from "next/server";
import { searchDictionary } from "@/lib/dictionary-service";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    try {
        const result = await searchDictionary(query);
        if (result) {
            return NextResponse.json(result);
        } else {
            return NextResponse.json({ error: "Word not found" }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
