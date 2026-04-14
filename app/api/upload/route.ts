import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const backendForm = new FormData();
    backendForm.append("file", file, file.name);

    const response = await fetch(`${BACKEND_URL}/upload/`, {
      method: "POST",
      body: backendForm,
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
    console.error("Error calling backend /upload/:", error);
    return NextResponse.json(
      { error: "Failed to connect to AI backend. Make sure the server is running." },
      { status: 503 }
    );
  }
}
