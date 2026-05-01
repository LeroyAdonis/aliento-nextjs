# Graph Report - aliento-nextjs  (2026-04-30)

## Corpus Check
- 82 files · ~63,503 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 172 nodes · 134 edges · 8 communities detected
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]

## God Nodes (most connected - your core abstractions)
1. `upsertPost()` - 5 edges
2. `pruneExpired()` - 5 edges
3. `getAllPosts()` - 5 edges
4. `getCalBookingByUid()` - 5 edges
5. `makeBlock()` - 4 edges
6. `categoryId()` - 4 edges
7. `upsertCategory()` - 4 edges
8. `main()` - 4 edges
9. `getPostBySlug()` - 4 edges
10. `slugify()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `createPaymentGateRecord()` --calls--> `POST()`  [INFERRED]
  src/lib/payment-gate.ts → src/app/api/payment/route.ts
- `getAllPosts()` --calls--> `Home()`  [INFERRED]
  src/lib/sanity.ts → src/app/page.tsx
- `getCalBookingByUid()` --calls--> `GET()`  [INFERRED]
  src/lib/calcom.ts → src/app/api/calcom/bookings/[bookingUid]/route.ts
- `getCalBookingByUid()` --calls--> `GET()`  [INFERRED]
  src/lib/calcom.ts → src/app/api/calcom/bookings/[bookingUid]/reschedule/route.ts
- `getCalBookingByUid()` --calls--> `ConfirmedPage()`  [INFERRED]
  src/lib/calcom.ts → src/app/consult/confirmed/[bookingUid]/page.tsx

## Communities

### Community 0 - "Community 0"
Cohesion: 0.15
Nodes (10): Home(), BlogPage(), HealthTopicsPage(), getAllCategories(), getAllPosts(), getPostBySlug(), BlogPostPage(), generateMetadata() (+2 more)

### Community 1 - "Community 1"
Cohesion: 0.15
Nodes (9): ConfirmedPage(), GET(), POST(), POST(), calcomFetch(), cancelCalBooking(), getCalBookingByUid(), verifyCalWebhookSignature() (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.36
Nodes (11): categoryId(), loadMdxFiles(), main(), makeBlock(), markdownToPortableText(), nextKey(), parseInline(), postId() (+3 more)

### Community 3 - "Community 3"
Cohesion: 0.31
Nodes (7): createPaymentGateRecord(), getPaymentGateRecord(), markPaymentGateFailed(), markPaymentGatePaid(), pruneExpired(), POST(), GET()

### Community 4 - "Community 4"
Cohesion: 0.5
Nodes (3): buildPayfastFormData(), generatePayfastSignature(), POST()

### Community 7 - "Community 7"
Cohesion: 0.67
Nodes (2): generateSlug(), handleSave()

### Community 9 - "Community 9"
Cohesion: 0.67
Nodes (2): commitToGitHub(), POST()

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (2): isAuthenticated(), proxy()

## Knowledge Gaps
- **Thin community `Community 7`** (4 nodes): `generateSlug()`, `handleSave()`, `sanitizePreview()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (4 nodes): `commitToGitHub()`, `GET()`, `POST()`, `route.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (3 nodes): `isAuthenticated()`, `proxy()`, `proxy.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createPaymentGateRecord()` connect `Community 3` to `Community 4`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `getAllPosts()` (e.g. with `Home()` and `HealthTopicsPage()`) actually correct?**
  _`getAllPosts()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `getCalBookingByUid()` (e.g. with `GET()` and `GET()`) actually correct?**
  _`getCalBookingByUid()` has 3 INFERRED edges - model-reasoned connections that need verification._