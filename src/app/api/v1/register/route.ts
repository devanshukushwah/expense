"use server";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { AppConstants } from "@/common/AppConstants";
import clientPromise from "@/lib/mongodb";
import { Collection, Document, UpdateResult, InsertOneResult } from "mongodb";

interface RegisterRequestBody {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface UserDocument extends Document {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  isGuest?: boolean;
  updated_at?: Date;
}

export async function POST(req: Request): Promise<Response> {
  const { email, password, firstName, lastName } =
    (await req.json()) as RegisterRequestBody;

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "invalid data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const emailLower = email.toLowerCase();

  const client = await clientPromise;
  const db = client.db();
  const collection: Collection<UserDocument> = db.collection(
    AppConstants.COLLECTION.USERS
  );

  const dbUser = await collection.findOne({ email: emailLower });

  if (dbUser && !dbUser?.isGuest) {
    return new Response(
      JSON.stringify({ success: false, error: "User already exists" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user: UserDocument = {
    email: emailLower,
    password: hashedPassword,
    firstName,
    lastName,
  };

  let result: UpdateResult | InsertOneResult | null = null;

  if (dbUser && dbUser?.isGuest) {
    user.isGuest = false;
    user.updated_at = new Date();
    result = await collection.updateOne({ _id: dbUser._id }, { $set: user });
  } else {
    result = await collection.insertOne(user);
  }

  if (result) {
    return NextResponse.json({
      message: "User registered",
      success: true,
      status: 201,
    });
  } else {
    return new Response(
      JSON.stringify({ success: false, error: "failed to register" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
