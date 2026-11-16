import * as service from "./chat.service.js";

const fail = (res, e) =>
  res.status(e.message === "forbidden" ? 403 : 400).json({ error: e.message });

export const list = async (req, res) => {
  try {
    res.json(await service.listConversations(req.user.id));
    }
  catch (e) {
    fail(res, e);
    }
};

export const messages = async (req, res) => {
  try {
    res.json(await service.listMessages(req.params.id, req.user.id));
    }
  catch (e) {
    fail(res, e);
    }
};