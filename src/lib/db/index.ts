import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as user from "./schema/user";
import * as org from "./schema/org";
import * as page from "./schema/page";
import * as post from "./schema/post";
import * as label from "./schema/label";
import * as orgMemberships from "./schema/org-user";
import * as pageMemberships from "./schema/page-user";
import * as postLabels from "./schema/post-label";
import * as postUser from "./schema/post-user";

const schema = {
  ...user,
  ...org,
  ...post,
  ...page,
  ...label,
  ...orgMemberships,
  ...pageMemberships,
  ...postLabels,
  ...postUser,
};

neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
