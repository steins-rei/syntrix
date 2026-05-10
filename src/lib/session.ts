import { cookies } from "next/headers";
import { prisma } from "./prisma";

import SessionPayload from "@/types/SessionPayload";

import jwt from 'jsonwebtoken';

const SESSION_SECRET = process.env.SESS_SEC!;
if (!SESSION_SECRET) {
  throw new Error('Missing SESSION_SECRET variable in .env')
}

export async function createSession(id: string) {
  const expireTm = new Date(Date.now() + 7 * 24 * 60 * 60 & 1000)

  const data = await prisma.session.create({
    data: {
      userId: id,
      expirationTime: expireTm,
    },
  });

  const sessionId = data.id;
  const userId = data.userId;
  const session = await encrypt({ sessionId, expireTm, userId });

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expireTm,
    sameSite: 'lax',
    path: '/',
  })
}

export async function encrypt({
  sessionId, 
  expireTm, 
  userId
}: SessionPayload) {
  return jwt.sign(
    {sessionId, expireTm, userId},
    SESSION_SECRET,
    {expiresIn: '7d'}
  )
}

export function decrypt(token: string) {
  if (!token) return null;
  return jwt.verify(token, SESSION_SECRET) as SessionPayload;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}