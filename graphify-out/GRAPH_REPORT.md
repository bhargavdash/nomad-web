# Graph Report - .  (2026-05-28)

## Corpus Check
- Corpus is ~17,419 words - fits in a single context window. You may not need a graph.

## Summary
- 342 nodes · 517 edges · 53 communities (23 shown, 30 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Trip Planning UI|Trip Planning UI]]
- [[_COMMUNITY_Trip Display & Navigation|Trip Display & Navigation]]
- [[_COMMUNITY_Brand Card Components|Brand Card Components]]
- [[_COMMUNITY_Auth & UI Primitives|Auth & UI Primitives]]
- [[_COMMUNITY_User Profile & Navigation|User Profile & Navigation]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Destination Image Components|Destination Image Components]]
- [[_COMMUNITY_App Routing & Layouts|App Routing & Layouts]]
- [[_COMMUNITY_Developer Skills & Docs|Developer Skills & Docs]]
- [[_COMMUNITY_Location Search|Location Search]]
- [[_COMMUNITY_Claude Code Settings|Claude Code Settings]]
- [[_COMMUNITY_Middleware & Auth Session|Middleware & Auth Session]]
- [[_COMMUNITY_Core State & API Layer|Core State & API Layer]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Dark Card UI|Dark Card UI]]
- [[_COMMUNITY_Unsplash Image Resolver|Unsplash Image Resolver]]
- [[_COMMUNITY_Supabase Server Client|Supabase Server Client]]
- [[_COMMUNITY_Trip Plan Store|Trip Plan Store]]
- [[_COMMUNITY_API Types|API Types]]
- [[_COMMUNITY_React Doctor Quality Gate|React Doctor Quality Gate]]
- [[_COMMUNITY_Design Token Rationale|Design Token Rationale]]
- [[_COMMUNITY_Itinerary Postcard|Itinerary Postcard]]
- [[_COMMUNITY_Research Poller Hook|Research Poller Hook]]
- [[_COMMUNITY_Zustand Auth Store|Zustand Auth Store]]
- [[_COMMUNITY_Trip Summary Type|Trip Summary Type]]
- [[_COMMUNITY_VSCODE Settings|VSCODE Settings]]
- [[_COMMUNITY_Trip Full Response Type|Trip Full Response Type]]
- [[_COMMUNITY_Research Discovery Type|Research Discovery Type]]
- [[_COMMUNITY_Accommodation Grid|Accommodation Grid]]
- [[_COMMUNITY_Date Range Popover|Date Range Popover]]
- [[_COMMUNITY_Button Component|Button Component]]
- [[_COMMUNITY_Dialog Component|Dialog Component]]
- [[_COMMUNITY_Popover Component|Popover Component]]
- [[_COMMUNITY_Input Component|Input Component]]
- [[_COMMUNITY_NomadLogo|NomadLogo]]
- [[_COMMUNITY_StaggerSection Animation|StaggerSection Animation]]
- [[_COMMUNITY_TripCard Stats|TripCard Stats]]
- [[_COMMUNITY_Auth Callback Route|Auth Callback Route]]
- [[_COMMUNITY_cn() Utility|cn() Utility]]
- [[_COMMUNITY_User Avatar|User Avatar]]
- [[_COMMUNITY_OAuth Flow|OAuth Flow]]
- [[_COMMUNITY_Placeholder Seed Data|Placeholder Seed Data]]
- [[_COMMUNITY_Proxy Dev Server|Proxy Dev Server]]
- [[_COMMUNITY_Source Badge Colors|Source Badge Colors]]
- [[_COMMUNITY_Keyword Chip|Keyword Chip]]
- [[_COMMUNITY_Next.js App Config|Next.js App Config]]
- [[_COMMUNITY_Research Phase UI|Research Phase UI]]
- [[_COMMUNITY_Trending Destinations|Trending Destinations]]
- [[_COMMUNITY_Public SVG Assets|Public SVG Assets]]
- [[_COMMUNITY_AGENTS Doc|AGENTS Doc]]
- [[_COMMUNITY_useInitializeAuth Hook|useInitializeAuth Hook]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 36 edges
2. `compilerOptions` - 16 edges
3. `unsplashByQuery()` - 9 edges
4. `createSupabaseServerClient()` - 9 edges
5. `useAuthStore` - 9 edges
6. `api` - 7 edges
7. `supabase()` - 7 edges
8. `scripts` - 6 edges
9. `enabledPlugins` - 6 edges
10. `Button` - 6 edges

## Surprising Connections (you probably didn't know these)
- `usePhotonSearch Hook` --conceptually_related_to--> `Agents Instructions Doc`  [INFERRED]
  hooks/usePhotonSearch.ts → AGENTS.md
- `React Doctor Skill (.claude)` --semantically_similar_to--> `React Doctor Skill (.agents)`  [INFERRED] [semantically similar]
  .claude/skills/react-doctor/SKILL.md → .agents/skills/react-doctor/SKILL.md
- `RootPage()` --calls--> `createSupabaseServerClient()`  [EXTRACTED]
  app/page.tsx → lib/supabase/server.ts
- `AppLayout()` --calls--> `createSupabaseServerClient()`  [EXTRACTED]
  app/(app)/layout.tsx → lib/supabase/server.ts
- `HomePage()` --calls--> `useAuthStore`  [EXTRACTED]
  app/(app)/home/page.tsx → store/authStore.ts

## Hyperedges (group relationships)
- **Trip Creation User Journey** — plan_page_tripform, researching_page_aiphase, itinerary_page_tripview [INFERRED 0.95]
- **Auth Guard System** — app_layout_authguard, auth_layout_authshell, app_page_landing [INFERRED 0.85]
- **OAuth Authentication Round-Trip** — signin_page_oauth, signup_page_oauth, auth_callback_session [INFERRED 0.95]
- **Trip Plan Form State Participants** — accommodation_grid_component, date_range_popover_component, plan_page_tripform [INFERRED 0.85]
- **Remote Image Display Pipeline** — remote_image_component, destination_card_component, trip_card_component [INFERRED 0.85]
- **Supabase Client Layer Triad** — supabase_browser_client, supabase_middleware_client, supabase_server_client [INFERRED 0.95]
- **Auth Initialization Flow** — use_initialize_auth_hook, auth_store, supabase_browser_client [EXTRACTED 1.00]
- **Research Polling Data Flow** — use_research_poller_hook, api_axios_instance, api_types [EXTRACTED 1.00]
- **Design Compliance System** — design_reviewer_agent, component_specs_doc, build_component_skill [INFERRED 0.85]
- **React Doctor Quality Gate** — react_doctor_skill_claude, react_doctor_skill_agents, react_doctor_workflow [INFERRED 0.85]

## Communities (53 total, 30 thin omitted)

### Community 0 - "Package Dependencies"
Cohesion: 0.06
Nodes (35): dependencies, axios, class-variance-authority, clsx, date-fns, framer-motion, lucide-react, next (+27 more)

### Community 1 - "Trip Planning UI"
Cohesion: 0.10
Nodes (24): ACCOMMODATION_OPTIONS, BUDGET_TIERS, DEMO_STOPS_DAY1, DEMO_TRIP, PACE_OPTIONS, SOURCE_BADGE_COLORS, TRAVELER_OPTIONS, TRENDING_DESTINATIONS (+16 more)

### Community 2 - "Trip Display & Navigation"
Cohesion: 0.08
Nodes (20): formatDateRange(), STATUS_META, TripCard(), INITIAL_DISCOVERY, PHASE_TO_SOURCE, Stats, PostcardCardProps, api (+12 more)

### Community 3 - "Brand Card Components"
Cohesion: 0.14
Nodes (21): ActiveTripCard(), ActiveTripCardProps, InsightCard(), InsightCardProps, KeywordChip(), KeywordChipProps, NomadLogo(), SourceBadge() (+13 more)

### Community 4 - "Auth & UI Primitives"
Cohesion: 0.12
Nodes (14): RESEARCH_SOURCES, useResearchPoller(), AuthShell(), AuthShellProps, ResearchingPage(), Button, ButtonProps, Size (+6 more)

### Community 5 - "User Profile & Navigation"
Cohesion: 0.18
Nodes (14): UserAvatar(), UserAvatarProps, useInitializeAuth(), NAV_LINKS, TopNav(), ProfilePage(), AuthState, useAuthStore (+6 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 7 - "Destination Image Components"
Cohesion: 0.20
Nodes (10): DestinationCard(), DestinationCardProps, HeroCTACard(), RemoteImage(), RemoteImageProps, KEYWORD_RULES, PHOTO_BUCKETS, pickPhotoId() (+2 more)

### Community 8 - "App Routing & Layouts"
Cohesion: 0.38
Nodes (5): AppLayout(), RootPage(), AuthLayout(), GET(), createSupabaseServerClient()

### Community 9 - "Developer Skills & Docs"
Cohesion: 0.22
Nodes (10): Build Component Skill, Build Page Skill, Project CLAUDE.md (Dev Guide), Root CLAUDE.md (Project Entry), Coding Standards Rules, Component Visual Specs, Design Reviewer Agent, New API Route Skill (+2 more)

### Community 10 - "Location Search"
Cohesion: 0.39
Nodes (6): getDisplayLabel(), getSubtitle(), PhotonFeature, usePhotonSearch(), LocationSearchInput(), LocationSearchInputProps

### Community 11 - "Claude Code Settings"
Cohesion: 0.29
Nodes (6): enabledPlugins, chrome-devtools-mcp@claude-plugins-official, code-review@claude-plugins-official, frontend-design@claude-plugins-official, skill-creator@claude-plugins-official, superpowers@claude-plugins-official

### Community 12 - "Middleware & Auth Session"
Cohesion: 0.38
Nodes (5): config, proxy(), AUTH_ROUTES, PROTECTED_PREFIXES, updateSession()

### Community 13 - "Core State & API Layer"
Cohesion: 0.43
Nodes (7): Axios API Instance, API Type Definitions, Auth Store (Zustand), Supabase Browser Client (Singleton), Trip Plan Store (Zustand), useInitializeAuth Hook, useResearchPoller Hook

### Community 14 - "ESLint Config"
Cohesion: 0.33
Nodes (4): dmMono, dmSans, metadata, playfair

### Community 15 - "PostCSS Config"
Cohesion: 0.33
Nodes (6): Post-Auth Home Page, Itinerary View Page, Trip Planning Form Page, Trip Creation User Journey, AI Research Phase Page, Trips List Page

### Community 16 - "Dark Card UI"
Cohesion: 0.40
Nodes (6): Active Trip Card, Insight Card, Placeholder / Seed Data, Postcard Card, Dark Card Visual Language, Source Badge

### Community 17 - "Unsplash Image Resolver"
Cohesion: 0.40
Nodes (4): hooks, PostToolUse, permissions, allow

### Community 18 - "Supabase Server Client"
Cohesion: 0.67
Nodes (4): Auth Callback Handler, Google OAuth SSO Flow, Sign In Page, Sign Up Page

### Community 19 - "Trip Plan Store"
Cohesion: 0.67
Nodes (3): Agents Instructions Doc, Location Search Input, usePhotonSearch Hook

### Community 20 - "API Types"
Cohesion: 0.67
Nodes (3): App Auth Guard Layout, Landing Page, Server-Side Auth Guard Pattern

### Community 21 - "React Doctor Quality Gate"
Cohesion: 0.67
Nodes (3): React Doctor Skill (.agents), React Doctor Skill (.claude), React Doctor CI Workflow

### Community 22 - "Design Token Rationale"
Cohesion: 0.67
Nodes (3): Destination Card, Unoptimized Remote Image Pattern, Remote Image

## Knowledge Gaps
- **144 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+139 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Brand Card Components` to `Trip Planning UI`, `Trip Display & Navigation`, `Auth & UI Primitives`, `User Profile & Navigation`, `Destination Image Components`, `Location Search`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `api` connect `Trip Display & Navigation` to `Trip Planning UI`, `User Profile & Navigation`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _151 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Should `Trip Planning UI` be split into smaller, more focused modules?**
  _Cohesion score 0.09803921568627451 - nodes in this community are weakly interconnected._
- **Should `Trip Display & Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `Brand Card Components` be split into smaller, more focused modules?**
  _Cohesion score 0.13548387096774195 - nodes in this community are weakly interconnected._