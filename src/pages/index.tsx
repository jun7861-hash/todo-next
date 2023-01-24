import Todos from "@/components/todos";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>TODO</title>
        <meta name="description" content="TODO app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="main">
        <Todos />
      </main>
    </>
  );
}
