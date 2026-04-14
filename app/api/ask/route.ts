import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const formData = new FormData();
    const body = await request.formData();
    const question = body.get("question") as string;

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    formData.append("question", question);

    const response = await fetch(`${BACKEND_URL}/ask/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Backend error: ${response.status}`, detail: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error calling backend /ask/:", error);
    return NextResponse.json(
      { error: "Failed to connect to AI backend. Make sure the server is running." },
      { status: 503 }
    );
  }
}
