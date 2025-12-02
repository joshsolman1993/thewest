# Dust & Glory - Development Roadmap v2.0

**Utolsó frissítés:** 2025. december 2.  
**Jelenlegi állapot:** Alpha (Playable Prototype)  
**Következő milestone:** Beta Release

---

## 📋 Executive Summary

A projekt az elmúlt időszakban jelentős fejlődésen ment keresztül. A kezdeti tech demó állapotból egy játszható prototípussá alakult át, számos core mechanikával:

### ✅ Implementált Rendszerek (2025 Q3-Q4)
- ✅ **PvP Combat System** - Teljes körű harcrendszer stat számítással
- ✅ **Clan System** - Klánok, rangok, bank, upgradek
- ✅ **Leveling & Talents** - XP rendszer, talent tree (Tier 1-2)
- ✅ **Market System** - Játékosok közötti kereskedelem
- ✅ **Casino Minigames** - Coinflip, Slots
- ✅ **Leaderboards** - XP, Cash, Clan rankings
- ✅ **Private Messaging** - Chat rendszer PM támogatással
- ✅ **Item Rarity & Quality** - Loot generátor rendszer
- ✅ **User Profiles** - Bio, settings, stats
- ✅ **Mission System** - Quest/feladat rendszer
- ✅ **Crimes System** - Bűnözési mechanika

### 🎯 Stratégiai Célok 2025 Q1-Q2
1. **Stabilitás és teljesítmény** - Refactoring, optimalizáció
2. **Gazdasági rendszer elmélyítése** - Crafting, properties, trade routes
3. **Endgame content** - Raids, guild wars, world events
4. **Mobile & PWA** - Natív élmény mobilon
5. **Community features** - Forums, guilds, tournaments

---

## 🏗️ Fázis 1: Stabilitás & Technikai Debt (4-6 hét)

### Priority: CRITICAL ⚠️

#### 1.1 Backend Refactoring & Security

**Becsült idő:** 2 hét

- [ ] **Database Migration Strategy**
  - [ ] PostgreSQL production-ready setup (jelenlegi SQLite helyett)
  - [ ] TypeORM migration rendszer bevezetése (`synchronize: false`)
  - [ ] Seed scripts production data-hoz
  - [ ] Database backup & rollback stratégia
  
- [ ] **Combat System Validation**
  - [ ] ✅ Combat logika már szerver oldalon van (FightService)
  - [ ] Double-check: Minden combat számítás backend validáció alatt van
  - [ ] Rate limiting implementálása (`@nestjs/throttler`)
  - [ ] Combat logs perzisztálása audit trail-hez
  
- [ ] **Inventory Security**
  - [ ] Server-side inventory validáció teljes körű audit
  - [ ] Item duplication exploit prevention
  - [ ] Equipped items server-side validáció
  
- [ ] **Environment & Config**
  - [ ] `@nestjs/config` modul teljes integrációja
  - [ ] Secrets management (DB credentials, JWT secrets)
  - [ ] Multi-environment support (dev, staging, prod)

#### 1.2 Code Quality & Testing

**Becsült idő:** 2 hét

- [ ] **Unit Testing**
  - [ ] Critical services unit test coverage (min. 70%)
    - [ ] `FightService`
    - [ ] `CrimesService`
    - [ ] `MarketService`
    - [ ] `LootService`
  - [ ] Jest configuration fine-tuning
  
- [ ] **Integration Testing**
  - [ ] E2E tests critical user flows-ra
    - [ ] Registration → Login → First Crime
    - [ ] Market: List Item → Buy → Sell
    - [ ] Combat: Attack → Victory → Loot
  
- [ ] **Performance Testing**
  - [ ] Load testing (Artillery/k6) 100+ concurrent users
  - [ ] Database query optimization (N+1 queries)
  - [ ] Response time monitoring setup

#### 1.3 Frontend Optimization

**Becsült idő:** 1.5 hét

- [ ] **State Management Cleanup**
  - [ ] Zustand stores consolidation (elimináld a redundanciát)
  - [ ] Persistent state strategy review
  - [ ] React Query bevezetése server state kezeléshez
  
- [ ] **Performance Optimization**
  - [ ] Code splitting route alapján
  - [ ] Lazy loading components
  - [ ] Image optimization (responsive images, WebP)
  - [ ] Bundle size analysis (Vite bundle analyzer)
  
- [ ] **Mobile Responsiveness**
  - [ ] Touch gestures audit minden interakción
  - [ ] Mobile navigation UX improvements
  - [ ] PWA manifest és service worker setup

#### 1.4 Monitoring & DevOps

**Becsült idő:** 1 hét

- [ ] **Logging & Monitoring**
  - [ ] Winston logger integration (structured logging)
  - [ ] Error tracking (Sentry vagy alternatíva)
  - [ ] Application metrics (Prometheus + Grafana vagy egyszerűbb megoldás)
  
- [ ] **CI/CD Pipeline**
  - [ ] GitHub Actions vagy alternatíva
    - [ ] Automated testing
    - [ ] Lint & format checks
    - [ ] Build & deploy
  - [ ] Automated database migrations
  
- [ ] **Documentation**
  - [ ] API documentation (Swagger már van, review és kiegészítés)
  - [ ] Deployment guide
  - [ ] Contributing guidelines

---

## 🎮 Fázis 2: Core Loop Mélység (3-4 hét)

### Priority: HIGH 🔥

A játék jelenleg "wide but shallow" - sok feature van, de kevés mélység. Ez a fázis a meglévő rendszerek kiegészítésére fókuszál.

#### 2.1 Extended Talent System

**Becsült idő:** 1.5 hét

- [ ] **Tier 3 Talents**
  - [ ] 8-10 új late-game talent
  - [ ] Synergy bonusok (bizonyos kombinációk extra bónuszt adnak)
  - [ ] Talent reset mechanika (diamonds-ért vagy quest reward)
  
- [ ] **Prestige System**
  - [ ] Level cap increase (pl. 50 → 100)
  - [ ] Prestige levels: Reset szinten, de permanent bonusok
  - [ ] Prestige shop: Exkluzív kozmetikai itemek

#### 2.2 Advanced Crime System

**Becsült idő:** 1 hét

- [ ] **Crime Chains**
  - [ ] Multi-step crimes (pl. "Bank Heist": Recon → Plan → Execute)
  - [ ] Success rate affected by previous crimes
  - [ ] Cooldown system (nagyobb crimes-ra)
  
- [ ] **Wanted Level**
  - [ ] Police attention mechanic
  - [ ] High wanted level = random police raids (PvE combat)
  - [ ] Hideout upgrade csökkenti a wanted level grow rate-jét

#### 2.3 Crafting & Item Progression

**Becsült idő:** 2 hét

- [ ] **Crafting System**
  - [ ] `CraftingRecipe` entitás (materials → result)
  - [ ] Crafting stations (Blacksmith, Tailor, Chemist)
  - [ ] Crafting skill levels (jobb itemek magasabb szinten)
  
- [ ] **Item Enchanting**
  - [ ] Enchantment slots per item
  - [ ] Enchantment materials (random lootból)
  - [ ] Risk/reward: Enchant failure = item destruction
  
- [ ] **Item Sets**
  - [ ] Set bonuses (2/4/6 piece bonuses)
  - [ ] Unique set effects (pl. "Gunslinger Set": +crit chance)

#### 2.4 Energy & Time Management

**Becsült idő:** 1 hét

**FONTOS:** Az eredeti roadmap említi, hogy hiányzik az "időalapú tevékenység" - ez talán még mindig gap?

- [ ] **Work/Job System** (Ha még nincs implementálva)
  - [ ] `WorkDefinition` és `ActiveWork` entitások
  - [ ] Jobs: Mining, Logging, Farming, Bounty Hunting
  - [ ] Real-time jobs: Start → Wait (timer) → Claim reward
  - [ ] Job quality/success rate talents és gear alapján
  
- [ ] **Energy Refill Mechanics**
  - [ ] Passive regen (pl. 1 energy / 5 perc)
  - [ ] Food items (instant regen)
  - [ ] Premium: Energy refill diamonds-ért

---

## 💰 Fázis 3: Economy & Social (4-5 hét)

### Priority: MEDIUM-HIGH 🔶

#### 3.1 Advanced Market Features

**Becsült idő:** 1.5 hét

- [ ] **Auction House**
  - [ ] Bid rendszer (highest bidder wins)
  - [ ] Buy Now ár mellett
  - [ ] Auction history & price tracking
  
- [ ] **Market Analytics**
  - [ ] Price history graphs
  - [ ] Supply/demand indicators
  - [ ] Trending items
  
- [ ] **Trade Tax & Fees**
  - [ ] City tax (portion goes to city treasury)
  - [ ] Clan market tax reduction (upgrade bonus)

#### 3.2 Property & Territory System

**Becsült idő:** 2 hét

- [ ] **Player Properties**
  - [ ] Purchasable buildings (Hideout, Bar, Ranch)
  - [ ] Passive income generation
  - [ ] Upgradeable (több slot, jobb income)
  
- [ ] **Territory Control**
  - [ ] Map zones (cities, regions)
  - [ ] Clan warfare: Zone capture mechanics
  - [ ] Controlled zones = bonuszok (XP, loot, tax income)

#### 3.3 Extended Clan Features

**Becsült idő:** 1.5 hét

- [ ] **Clan Wars**
  - [ ] Weekly clan vs clan tournaments
  - [ ] War points: Kills, resources contributed
  - [ ] War rewards: Clan-wide buffs, exclusive items
  
- [ ] **Clan Buildings**
  - [ ] Beyond upgrades: Dedicated buildings (Armory, Library, Vault)
  - [ ] Members can contribute materials
  - [ ] Buildings unlock new features
  
- [ ] **Clan Missions**
  - [ ] Weekly clan objectives
  - [ ] Contribution tracking
  - [ ] Tiered rewards based on completion %

#### 3.4 Social Features

**Becsült idő:** 1 hét

- [ ] **Friends System**
  - [ ] Friend list
  - [ ] Friend-only combat restrictions option
  - [ ] Referral rewards
  
- [ ] **Forums/Bulletin Board**
  - [ ] In-game forum (vagy link external Discord?)
  - [ ] Player trade posts
  - [ ] Clan recruitment posts

---

## 🌟 Fázis 4: Endgame Content (5-6 hét)

### Priority: MEDIUM 🟡

#### 4.1 PvE Boss Raids

**Becsült idő:** 2.5 hét

- [ ] **Boss Entitások**
  - [ ] PvE boss system (AI opponent)
  - [ ] Boss difficulty tiers (Normal, Hard, Legendary)
  - [ ] Unique boss mechanics
  
- [ ] **Raid System**
  - [ ] Group raids (3-5 players)
  - [ ] Contribution-based loot distribution
  - [ ] Weekly raid lockouts
  
- [ ] **Raid Rewards**
  - [ ] Legendary item drops
  - [ ] Raid-specific currency
  - [ ] Achievement unlocks

#### 4.2 World Events

**Becsült idő:** 1.5 hét

- [ ] **Timed Events**
  - [ ] Server-wide events (pl. "Gold Rush Weekend")
  - [ ] Event-specific activities & rewards
  - [ ] Leaderboards per event
  
- [ ] **Dynamic Events**
  - [ ] Random spawn events (pl. "Bandit Ambush" on map)
  - [ ] First-come-first-serve or collaborative
  - [ ] Push notifications for event starts

#### 4.3 Ranked PvP

**Becsült idő:** 2 hét

- [ ] **Ranked Seasons**
  - [ ] Monthly/quarterly seasons
  - [ ] ELO/MMR ranking system
  - [ ] Ranked rewards (titles, cosmetics, exclusive items)
  
- [ ] **Arena Mode**
  - [ ] Matchmaking queue
  - [ ] Best-of-3 duels
  - [ ] Spectator mode
  
- [ ] **Tournaments**
  - [ ] Bracket-style tournaments
  - [ ] Entry fee (gold/diamonds)
  - [ ] Prize pool distribution

---

## 📱 Fázis 5: Mobile & PWA (3-4 hét)

### Priority: MEDIUM 🟡

#### 5.1 Progressive Web App

**Becsült idő:** 2 hét

- [ ] **PWA Setup**
  - [ ] Service worker (offline support)
  - [ ] App manifest
  - [ ] Install prompt
  
- [ ] **Mobile Optimizations**
  - [ ] Touch-optimized UI controls
  - [ ] Mobile-specific layouts
  - [ ] Reduced bandwidth mode (fewer animations)
  
- [ ] **Push Notifications**
  - [ ] Web push notifications setup
  - [ ] Notify: Combat results, market sales, clan events
  - [ ] User preferences for notification types

#### 5.2 Mobile-First Features

**Becsült idő:** 1 hét

- [ ] **Quick Actions**
  - [ ] Quick access widget (energy, cash, health)
  - [ ] One-tap actions (train, crime, heal)
  
- [ ] **Offline Mode**
  - [ ] Queue actions offline
  - [ ] Sync on reconnect
  - [ ] Optimistic UI updates

---

## 🎨 Fázis 6: Polish & Content (Ongoing)

### Priority: LOW-MEDIUM 🟢

#### 6.1 Visual & Audio

- [ ] **Sound Design**
  - [ ] More sound effects (combat hits, UI clicks, notifications)
  - [ ] Background music per location
  - [ ] Audio settings expansion
  
- [ ] **Visual Effects**
  - [ ] Combat animations (hit effects, critical hits)
  - [ ] Particle effects (level up, loot drops)
  - [ ] UI transitions polish

#### 6.2 Content Expansion

- [ ] **More Items**
  - [ ] Expand item database (jelenleg ~20 item → 100+)
  - [ ] Item categories: Melee, Ranged, Armor, Accessories
  - [ ] Unique legendary items with special effects
  
- [ ] **More Missions**
  - [ ] Story-driven quest chains
  - [ ] Character-specific missions
  - [ ] Daily/weekly missions
  
- [ ] **Localization**
  - [ ] i18n setup (már van magyar, angol bővítés)
  - [ ] További nyelvek (német, spanyol, stb.)

#### 6.3 Analytics & Balance

- [ ] **Game Analytics**
  - [ ] Player behavior tracking (privacy-conscious)
  - [ ] Feature usage metrics
  - [ ] Retention analysis
  
- [ ] **Balance Patches**
  - [ ] Regular balance updates based on data
  - [ ] Player feedback integration
  - [ ] Meta diversity maintenance

---

## 🗺️ Hosszú Távú Vízió (6+ hónap)

### Potential Features (Research & Prototype)

- **Battle Royale Mode** - 50 players, shrinking map, last man standing
- **Alliances & Diplomacy** - Clan alliances, treaties, betrayals
- **Player Housing** - Customizable homes, furniture, decoration
- **Pets/Companions** - Combat pets, passive bonuses
- **Seasonal Content** - Battle passes, seasonal themes
- **NFT Integration?** - (Ha érdekel) Blockchain items, play-to-earn elements
- **Modding Support** - Community-created content

---

## 📊 Success Metrics & KPIs

### Alpha Phase (Jelenlegi)
- ✅ Core mechanics functional
- ✅ 50+ active testers
- 🎯 Bug report & fix workflow established

### Beta Phase (Q1 2026)
- 🎯 500+ registered users
- 🎯 DAU (Daily Active Users) > 100
- 🎯 Average session time > 15 minutes
- 🎯 Critical bug count < 5

### Launch Phase (Q2 2026)
- 🎯 5,000+ registered users
- 🎯 DAU > 500
- 🎯 Retention (D7) > 20%
- 🎯 Positive revenue (if monetization implemented)

---

## 🛠️ Technikai Stack Fejlesztések

### Javasolt Technológiai Frissítések

**Backend:**
- ✅ NestJS (current)
- 🔄 PostgreSQL migration (SQLite → Postgres)
- 🆕 Redis (caching, rate limiting, pub/sub)
- 🆕 Bull Queue (job scheduling, async tasks)
- 🆕 GraphQL (opcionális, ha complex queries szaporodnak)

**Frontend:**
- ✅ React + Vite (current)
- ✅ Zustand (current)
- 🆕 React Query (server state)
- 🆕 Framer Motion (advanced animations)
- 🆕 Recharts (analytics charts)

**DevOps:**
- 🆕 Docker Compose (teljes stack lokális dev)
- 🆕 GitHub Actions (CI/CD)
- 🆕 Nginx (reverse proxy, load balancing)
- 🆕 PM2 vagy Docker Swarm (production orchestration)

**Monitoring:**
- 🆕 Sentry (error tracking)
- 🆕 LogRocket vagy alternatíva (session replay)
- 🆕 Grafana + Prometheus (metrics)

---

## ⚠️ Ismert Technikai Adósságok

### Critical Issues (From Original Roadmap + Code Review)

1. **Database Sync Mode** ⚠️
   - `synchronize: true` production-ban veszélyes
   - Megoldás: Migration-based approach
   - Határidő: Fázis 1

2. **Client-Side Validation Gaps** ⚠️
   - Néhány inventory művelet client-side validált
   - Megoldás: Comprehensive server-side check minden mutációnál
   - Határidő: Fázis 1

3. **WebSocket Scalability** ⚠️
   - Jelenlegi Socket.io setup single-instance
   - Megoldás: Redis adapter multi-instance support-hoz
   - Határidő: Fázis 1

4. **Error Handling Inconsistency** ⚠️
   - Error responses nem egységesek (frontend parsing nehézkes)
   - Megoldás: Global exception filter + standard error DTOs
   - Határidő: Fázis 1

5. **Test Coverage** ⚠️
   - Jelenleg minimális test coverage
   - Megoldás: Incremental testing minden új feature-rel + retrospective testing
   - Határidő: Fázis 1 + ongoing

---

## 🎯 Prioritási Mátrix

| Feature Category | Impact | Effort | Priority | Recommended Phase |
|-----------------|--------|--------|----------|-------------------|
| Security & Stability | 🔴 High | Medium | **CRITICAL** | Fázis 1 |
| Testing & Monitoring | 🔴 High | Medium | **CRITICAL** | Fázis 1 |
| Talent System Expansion | 🟠 Medium | Low | HIGH | Fázis 2 |
| Crafting System | 🟠 Medium | High | HIGH | Fázis 2 |
| Property System | 🟡 Medium | Medium | MEDIUM | Fázis 3 |
| Clan Wars | 🟡 Medium | High | MEDIUM | Fázis 3 |
| Boss Raids | 🟡 Medium | High | MEDIUM | Fázis 4 |
| Ranked PvP | 🟢 Low | Medium | LOW-MED | Fázis 4 |
| PWA | 🟢 Low | Medium | LOW-MED | Fázis 5 |
| Localization | 🟢 Low | Low | LOW | Fázis 6 |

---

## 📝 Changelog & Version History

### v2.0 - 2025-12-02
- 🔄 Complete roadmap overhaul
- ✅ Reflected all implemented features from Q3-Q4 2025
- 🆕 New phases with detailed task breakdowns
- 🎯 Added success metrics & KPIs
- 🛠️ Technical debt tracking

### v1.0 - 2025-05 (Original)
- 📋 Initial roadmap creation
- 🔍 Project analysis and gap identification

---

## 📞 Következő Lépések (Immediate Actions)

### Sprint 0 - Roadmap Finalization (1 hét)
1. **Review & Feedback**
   - [ ] Roadmap review csapattal (ha van)
   - [ ] Prioritások finalizálása
   - [ ] Timeline validation

2. **Setup Project Management**
   - [ ] GitHub Projects vagy Trello board
   - [ ] Fázisok → Epics → Stories → Tasks bontás
   - [ ] Sprint planning (2 week sprints javaslat)

3. **First Sprint Planning**
   - [ ] Fázis 1 első 2 hetének feladatai
   - [ ] Story points becslés
   - [ ] Definition of Done meghatározása

### Sprint 1 - Kickoff (2 hét)
- **Focus:** Database migration + Security audit
- **Goal:** Production-ready backend foundation
- **Success Criteria:** All tests pass, PostgreSQL migrated, no security vulnerabilities

---

## 💡 Design Philosophy & Principles

### Core Pillars
1. **Player Respect** - No predatory monetization, fair progression
2. **Depth Over Breadth** - Fewer, well-designed systems > many shallow features
3. **Community First** - Player feedback drives development
4. **Technical Excellence** - Code quality, testing, performance

### Development Principles
- **Agile Iterations** - Ship small, iterate fast
- **Data-Driven Decisions** - Analytics guide balance & features
- **Fail Fast** - Prototype risky features early, cut if doesn't work
- **Documentation** - Code is read more than written

---

## 📚 Appendix

### Recommended Reading
- [Game Design Patterns](https://gameprogrammingpatterns.com/)
- [NestJS Best Practices](https://docs.nestjs.com/fundamentals/testing)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)

### Useful Tools
- **Database Design:** dbdiagram.io
- **API Testing:** Postman, Insomnia
- **Performance:** Lighthouse, WebPageTest
- **Collaboration:** Figma (design), Miro (brainstorming)

### Community Resources
- Discord server setup recommendation
- Reddit/Forum for player feedback
- GitHub Discussions for feature requests

---

**Készítette:** Antigravity AI  
**Utolsó frissítés:** 2025-12-02  
**Verzió:** 2.0

*Ez a roadmap egy élő dokumentum. Rendszeresen frissítsd a projekt előrehaladásával és az új tanulságokkal!*