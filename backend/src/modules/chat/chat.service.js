import db from "../../prisma/db.js";

export async function createConversationForUsers(userAId, userBId)
{   
    if (userAId === userBId)
        throw Error("cannot chat with yourself")
    const [userLowId, userHighId] =
    userAId < userBId ? [userAId, userBId] : [userBId, userAId];
    const existing = await db.conversation.findFirst({ where: { userLowId, userHighId } });
    if (existing)
        return existing;
    return await db.conversation.create({ data: { userLowId, userHighId } });
};

export async function getForMember(conversationId, userId)
{
    const conversation = await db.conversation.findUnique({where : { id : conversationId}});
    if (!conversation)
        return null;
    if (userId !==  conversation.userHighId && userId !==  conversation.userLowId)
        return null;
    return conversation;
}

export async function listMessages(conversationId, userId)
{
    const conversation = await getForMember(conversationId, userId);
    if (!conversation)
        throw new Error("forbidden");
    return db.message.findMany({where: { conversationId }, orderBy: { createdAt: "asc" },});
}

export async function saveMessage(conversationId, userId, content)
{
    const conversation = await getForMember(conversationId, userId);
    if (!conversation)
        throw new Error("forbidden");
    if (!content || !content.trim()) throw new Error("empty message");
    const message = await db.message.create({ data: { conversationId, senderId: userId, content } });

    await db.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() },});
    return message;

}

///error 
export async function listConversations(userId)
{
  const rows = await db.conversation.findMany({
    where: { OR: [{ userLowId: userId }, { userHighId: userId }] },
    orderBy: { updatedAt: "desc" },
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  const otherIds = rows.map((c) =>
    c.userLowId === userId ? c.userHighId : c.userLowId
  );

  const users = await db.user.findMany({
    where: { id: { in: otherIds } },
    select: { id: true, name: true, avatarUrl: true },
  });
  const byId = new Map(users.map((u) => [u.id, u]));

  return rows.map((c, i) => ({
    id: c.id,
    with: byId.get(otherIds[i]),
    lastMessage: c.messages.length ? c.messages[0] : null,
  }));
}