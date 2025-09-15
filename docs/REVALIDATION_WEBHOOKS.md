### Incremental Revalidation via Webhooks

This app supports on-demand ISR revalidation when content changes in Supabase.

#### 1) API endpoint
- Path: `/api/revalidate`
- Method: POST
- Auth: `x-webhook-secret: <REVALIDATE_SECRET>` or `?secret=<REVALIDATE_SECRET>`
- Revalidates only affected paths: home, language home (`/vi`, `/en`), blog list, post detail, category, tag.

Example payload (Supabase Webhooks):
```json
{
  "type": "UPDATE",
  "table": "blog_posts",
  "record": { "id": 123, "slug": "my-post", "category_id": 5 },
  "old_record": { "id": 123, "slug": "my-post", "category_id": 4 }
}
```

#### 2) Environment variable
- Add `REVALIDATE_SECRET` in both environments:
  - Local: add to `.env.local`
  - Vercel: Project Settings → Environment Variables → `REVALIDATE_SECRET`

#### 3) Supabase configuration
Use Supabase Database Webhooks (recommended) to call the endpoint when rows change.

Configure for tables (INSERT/UPDATE/DELETE):
- `blog_posts`
- `blog_post_translations`
- `categories`
- `tags`
- `blog_post_tags`

Webhook target URL (production suggested):
- `https://<your-vercel-domain>/api/revalidate`
- Header: `x-webhook-secret: <REVALIDATE_SECRET>`

Optional filters:
- Only when `status` changes or when `slug/category_id` changes on `blog_posts`
- Only when `language_code` changes on `blog_post_translations`

#### 4) Test locally
Start dev server and send a test request:
```bash
curl -s -X POST "http://localhost:3000/api/revalidate?secret=$REVALIDATE_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{
    "type":"UPDATE",
    "table":"blog_posts",
    "record": {"slug":"welcome-to-matt-dinh-blog"}
  }'
```

Expected response:
```json
{ "ok": true, "revalidated": ["/", "/vi", "/en", "/blog", "/blog/welcome-to-matt-dinh-blog"], "type": "UPDATE", "table": "blog_posts" }
```

#### 5) Notes
- The endpoint is idempotent and safe. Missing slugs are ignored.
- If you later add language-scoped post routes (e.g. `/{lang}/blog/[slug]`), they are already handled.
- To extend behavior (e.g., portfolio), add cases in `src/app/api/revalidate/route.ts`. 