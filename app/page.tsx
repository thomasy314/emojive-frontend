import Chat from "@/components/chat";

export default function Home() {
  return (
    <main className="bg-background flex flex-col w-screen h-screen text-center justify-center items-center">
      <h1 className="text-6xl">🗯️🗨️</h1>
      <Chat />
    </main>
  );
}
