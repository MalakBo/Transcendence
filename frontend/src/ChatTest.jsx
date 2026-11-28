
import { useState } from "react";

import { Message, MessageContent } from "../components/ui/message";
import { Bubble, BubbleContent } from "../components/ui/bubble";

import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "../components/ui/message-scroller";

export default function ChatTest() {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello!", sender: "me" },
    { id: "2", text: "Hi! How are you?", sender: "other" },
    { id: "3", text: "I'm testing shadcn components.", sender: "me" },
    { id: "4", text: "Looks good!", sender: "other" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSend = (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const message = {
      id: crypto.randomUUID(),
      text: newMessage,
      sender: "me",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  return (
    <div className="h-screen p-8 flex flex-col">
      <h1 className="text-xl font-bold mb-4">
        Chat UI Test
      </h1>

      <div className="flex-1 min-h-0">
        <MessageScrollerProvider autoScroll>
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent className="gap-4">
                {messages.map((msg) => (
                  <MessageScrollerItem
                    key={msg.id}
                    messageId={msg.id}
                    scrollAnchor={msg.sender === "me"}
                  >
                    <Message
                      align={msg.sender === "me" ? "end" : "start"}
                    >
                      <MessageContent>
                        <Bubble
                          align={msg.sender === "me" ? "end" : "start"}
                          variant={msg.sender === "me" ? "muted" : "solid"}
                        >
                          <BubbleContent>
                            {msg.text}
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>

            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      </div>

      {/* Message input */}
      <form
        onSubmit={handleSend}
        className="flex gap-2 mt-4 border-t pt-4"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-4 py-2 bg-background outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-primary text-primary-foreground px-5 py-2 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
