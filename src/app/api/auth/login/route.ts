import z from "zod";

import { LoginSchema } from "@/lib/schemas/auth/LoginSchema";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  const body = req.json();

  const parsed = await LoginSchema.safeParseAsync(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: z.treeifyError(parsed.error) },
      { status: 500 }
    );
  }

  const { email, password } = parsed.data;

  try {
    const user = await prisma.$replica().user.findUnique({ where: { email } })

    const validPass = await bcrypt.compare(password, user!.password);

    if (!user || !validPass) {
      return NextResponse.json(
        { errors: {
          email: ['Invalid credentials']
        }}, {
          status: 400
        }
      )
    }

    try {
      await createSession(user.id);
    } catch (error) {
      console.error('Session creation failed');

      return NextResponse.json(
        { errors: 'Failed to create session'},
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Failed to login')

    return NextResponse.json(
      { errors: 'Log In failed' },
      { status: 500 }
    )
  }
}