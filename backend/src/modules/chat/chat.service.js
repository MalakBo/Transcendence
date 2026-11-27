import { db } from "../../prisma/db.ts";

const Conversations = db.orm.public.Conversation;
const Messages = db.orm.public.Message;
const Users = db.orm.public.User;

const time = (v) => (v instanceof Date ? v.getTime() : new Date(String(v)).getTime());

export async function createConversationForUsers(userAId, userBId) {
  if (userAId === userBId) throw new Error("cannot chat with yourself");
  const [userLowId, userHighId] =
    userAId < userBId ? [userAId, userBId] : [userBId, userAId];

  const existing = await Conversations.where({ userLowId, userHighId }).first();
  if (existing) return existing;
  return Conversations.create({ userLowId, userHighId });
}

export async function getForMember(conversationId, userId) {
  const conversation = await Conversations.where({ id: conversationId }).first();
  if (!conversation) return null;
  if (userId !== conversation.userHighId && userId !== conversation.userLowId)
    return null;
  return conversation;
}

export async function listMessages(conversationId, userId) {
  if (!(await getForMember(conversationId, userId))) throw new Error("forbidden");
  const rows = await Messages.where({ conversationId }).all();
  return rows.sort((a, b) => time(a.createdAt) - time(b.createdAt));
}

export async function saveMessage(conversationId, userId, content) {
  if (!(await getForMember(conversationId, userId))) throw new Error("forbidden");
  if (!content || !content.trim()) throw new Error("empty message");
  return Messages.create({
    conversationId,
    senderId: userId,
    content: content.trim(),
  });
}

export async function listConversations(userId) {
  const [asLow, asHigh] = await Promise.all([
    Conversations.where({ userLowId: userId }).all(),
    Conversations.where({ userHighId: userId }).all(),
  ]);
  const rows = [...asLow, ...asHigh];

  const items = await Promise.all(
    rows.map(async (c) => {
      const otherId = c.userLowId === userId ? c.userHighId : c.userLowId;
      const [other, messages] = await Promise.all([
        Users.where({ id: otherId }).select("id", "name", "avatarUrl").first(),
        Messages.where({ conversationId: c.id }).all(),
      ]);
      const last = messages.sort((a, b) => time(b.createdAt) - time(a.createdAt))[0];
      return {
        id: c.id,
        with: other,
        lastMessage: last ?? null,
        sortTime: time(last ? last.createdAt : c.createdAt),
      };
    })
  );

  return items
    .sort((a, b) => b.sortTime - a.sortTime)
    .map(({ sortTime, ...item }) => item);
}