"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { contacts } from "@/db/schema";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readContactInput(formData: FormData) {
  const name = readString(formData, "name");
  const email = readString(formData, "email");

  if (!name || !email) {
    throw new Error("Name and email are required.");
  }

  return {
    name,
    email,
    company: readString(formData, "company"),
    notes: readString(formData, "notes"),
    updatedAt: new Date(),
  };
}

export async function createContact(formData: FormData) {
  await db.insert(contacts).values(readContactInput(formData));
  revalidatePath("/");
}

export async function updateContact(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id < 1) {
    throw new Error("A valid contact id is required.");
  }

  await db.update(contacts).set(readContactInput(formData)).where(eq(contacts.id, id));
  revalidatePath("/");
}

export async function deleteContact(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id < 1) {
    throw new Error("A valid contact id is required.");
  }

  await db.delete(contacts).where(eq(contacts.id, id));
  revalidatePath("/");
}
