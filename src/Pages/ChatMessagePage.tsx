import ChatContainer from "@/components/Chat/ChatContainer";

const ChatMessagePage = () => {
  const myUserId = "137e6d40-3d46-4b69-a5fc-e7997859976b";
  return (
    <div>
      <ChatContainer myUserId={myUserId} />
    </div>
  );
};

export default ChatMessagePage;
