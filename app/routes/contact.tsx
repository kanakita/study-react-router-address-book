import { Form, useFetcher } from "react-router";

import type { ContactRecord } from "../data";

import { getContact, updateContact } from "../data";
import type { Route } from "./+types/contact";

// loaderDataを使ったmeta関数
export function meta({ data }: Route.MetaArgs) {
  // loaderから返されたデータを使用
  const contact = data?.contact;

  if (!contact) {
    return [
      { title: "Contact Not Found - React Router Contacts" },
      { name: "description", content: "Contact not found" },
    ];
  }

  return [
    { title: `${contact.first} ${contact.last} - React Router Contacts` },
    {
      name: "description",
      content: `Contact details for ${contact.first} ${contact.last}`,
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return { contact };
}

export default function Contact({ loaderData }: Route.ComponentProps) {
  const { contact } = loaderData;

  return (
    <div id="contact">
      <div>
        <img
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
          src={contact.avatar}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter ? (
          <p>
            <a href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        ) : null}

        {contact.notes ? <p>{contact.notes}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "このレコードを削除してもよろしいですか？",
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

function Favorite({ contact }: { contact: Pick<ContactRecord, "favorite"> }) {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={favorite ? "お気に入りから削除" : "お気に入りに追加"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
