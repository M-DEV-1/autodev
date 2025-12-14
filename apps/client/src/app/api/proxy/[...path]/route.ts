import { NextRequest, NextResponse } from "next/server";

// PREVENT STATIC CACHING
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    return proxyRequest(req, params);
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
    return proxyRequest(req, params);
}

export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
    return proxyRequest(req, params);
}

export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
    return proxyRequest(req, params);
}

async function proxyRequest(req: NextRequest, params: { path: string[] }) {
    const pathString = params.path.join("/");
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    // Check if the path corresponds to the preview route (which is at root /preview, not /api/preview)
    const isPreview = params.path[0] === 'preview';
    const backendUrl = isPreview
        ? `${baseUrl}/${pathString}${req.nextUrl.search}`
        : `${baseUrl}/api/${pathString}${req.nextUrl.search}`;

    console.log(`[Proxy] ${req.method} -> ${backendUrl}`);

    try {
        const body = (req.method === "GET" || req.method === "HEAD")
            ? undefined
            : await req.blob();

        const headers = new Headers();
        req.headers.forEach((value, key) => {
            if (key.toLowerCase() !== "host" && key.toLowerCase() !== "connection") {
                headers.set(key, value);
            }
        });

        // TEMPORARY: Disable SSL Verification
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        const res = await fetch(backendUrl, {
            method: req.method,
            headers,
            body,
            cache: "no-store"
        });

        const resBody = await res.blob();

        const responseHeaders = new Headers();
        res.headers.forEach((value, key) => {
            responseHeaders.set(key, value);
        });

        return new NextResponse(resBody, {
            status: res.status,
            statusText: res.statusText,
            headers: responseHeaders
        });

    } catch (error: any) {
        console.error("[Proxy] Error:", error);
        return NextResponse.json(
            { error: "Proxy Error", details: error.message },
            { status: 502 }
        );
    }
}
