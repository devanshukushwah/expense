"use server";

import { AppConstants } from "@/common/AppConstants";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const SECRET = process.env.JWT_SECRET || "secret-nahi-hai";

export async function POST(req: NextRequest): Promise<Response> {
  const { email, password }: { email: string; password: string } =
    await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "invalid data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const collection = db.collection(AppConstants.COLLECTION.USERS);

  const emailLower = email.toLowerCase();
  const user = await collection.findOne<{
    _id: string;
    email: string;
    password: string;
    isGuest?: boolean;
  }>({
    email: emailLower,
  });

  if (!user || user?.isGuest) {
    return NextResponse.json(
      { error: "Account not exists", success: false },
      { status: 401 }
    );
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return NextResponse.json(
      { error: "Password incorrect", success: false },
      { status: 401 }
    );
  }

  const payload = { _id: user._id, email };

  const token = jwt.sign(payload, SECRET);

  return NextResponse.json({ token, success: true });
}
