import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home - React Router Contacts" },
    { name: "description", content: "Welcome to React Router tutorial app" },
  ];
}

export default function Home() {
  return (
    <p id="index-page">
      これは React Router のデモです。
      <br />
      <a href="https://reactrouter.com">reactrouter.com のドキュメント</a>
      をご覧ください。
    </p>
  );
}
