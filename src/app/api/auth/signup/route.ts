import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SignupSchema } from '@/lib/schemas/auth/SignupSchema';
import z from 'zod';
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json();

  const parsed = await SignupSchema.safeParseAsync(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: z.treeifyError(parsed.error) },
      { status: 400 }
    )
  }

  const { username, email, password } = parsed.data;
  const hashedPass = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.$primary().user.create({
      data: {
        username,
        email,
        password: hashedPass,
      },
      select: {
        id: true
      }
    })

    return NextResponse.json({
      success: true,
      userId: user.id,
      message: `Account created: ${user.id}`
    })
  } catch (error) {
    console.log('Sign up error');
    return NextResponse.json(
      { error: 'An error has occured' },
      { status: 500 }
    )
  }
}