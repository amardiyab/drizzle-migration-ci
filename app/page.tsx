import { desc } from "drizzle-orm";

import { createContact, deleteContact, updateContact } from "@/app/actions";
import { db } from "@/db";
import { contacts } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function Home() {
  const contactList = await db.select().from(contacts).orderBy(desc(contacts.createdAt));

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
            Drizzle + Postgres
          </p>
          <h1 className="text-4xl font-semibold tracking-normal">Contacts CRUD</h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            Create, edit, and delete contacts using Next server actions backed by a
            Postgres table managed with Drizzle.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
          <form
            action={createContact}
            className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div>
              <h2 className="text-xl font-semibold">Add contact</h2>
              <p className="mt-1 text-sm text-slate-500">Name and email are required.</p>
            </div>
            <Field label="Name" name="name" required />
            <Field label="Email" name="email" required type="email" />
            <Field label="Company" name="company" />
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Notes
              <textarea
                name="notes"
                rows={4}
                className="min-h-28 rounded-md border border-slate-300 px-3 py-2 text-base text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </label>
            <button className="rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800">
              Create contact
            </button>
          </form>

          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Saved contacts</h2>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700">
                {contactList.length} total
              </span>
            </div>

            {contactList.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                No contacts yet.
              </div>
            ) : (
              <div className="grid gap-4">
                {contactList.map((contact) => (
                  <article
                    key={contact.id}
                    className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <form action={updateContact} className="grid gap-4 md:grid-cols-2">
                      <input type="hidden" name="id" value={contact.id} />
                      <Field label="Name" name="name" required defaultValue={contact.name} />
                      <Field
                        label="Email"
                        name="email"
                        required
                        type="email"
                        defaultValue={contact.email}
                      />
                      <Field
                        label="Company"
                        name="company"
                        defaultValue={contact.company}
                      />
                      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:row-span-2">
                        Notes
                        <textarea
                          name="notes"
                          rows={4}
                          defaultValue={contact.notes}
                          className="min-h-28 rounded-md border border-slate-300 px-3 py-2 text-base text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                        />
                      </label>
                      <div className="flex flex-wrap items-end gap-3">
                        <button className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100">
                          Save changes
                        </button>
                      </div>
                    </form>
                    <form action={deleteContact} className="mt-3">
                      <input type="hidden" name="id" value={contact.id} />
                      <button className="text-sm font-semibold text-red-700 transition hover:text-red-800">
                        Delete contact
                      </button>
                    </form>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}

type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
};

function Field({
  label,
  name,
  defaultValue = "",
  required = false,
  type = "text",
}: FieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="h-11 rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      />
    </label>
  );
}
