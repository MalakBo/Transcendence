import { db } from "../../prisma/db.ts";

export async function getOrCreateConversation(bookingId) {
  const existing = await db.orm.public.Conversation.where({ bookingId })
    .select("id", "bookingId")
    .first();
  if (existing) return existing;

  return db.orm.public.Conversation.create({
    data: { bookingId },
  });
}

export async function saveMessage(conversationId, senderId, content) {
  return db.orm.public.Message.create({
    data: { conversationId, senderId, content },
  });
}

export async function getMessages(conversationId, after) {
  const rows = await db.orm.public.Message.where({ conversationId })
    .select("id", "senderId", "content", "isRead", "createdAt")
    .all();

  return rows
    .filter((m) => !after || new Date(m.createdAt) > new Date(after))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}