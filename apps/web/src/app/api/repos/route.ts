import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const octokit = new Octokit({
            auth: session.accessToken,
        });

        const { data } = await octokit.repos.listForAuthenticatedUser({
            sort: "updated",
            per_page: 100,
            visibility: "all",
        });

        return NextResponse.json({ repos: data });
    } catch (error) {
        console.error("Error fetching repos:", error);
        return NextResponse.json(
            { error: "Failed to fetch repositories" },
            { status: 500 }
        );
    }
}
