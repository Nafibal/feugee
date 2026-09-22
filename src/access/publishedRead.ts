import type { Access, Where } from "payload";

// Payload merges a Where access result into the caller's query — draft queries
// included, where it lands in the versions' key space — so this one gate keeps
// Drafts out of every anonymous read path.
export const publishedWhere: Where = {
  _status: { equals: "published" },
};

export const publishedRead: Access = ({ req: { user } }) =>
  user ? true : publishedWhere;
