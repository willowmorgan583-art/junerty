# Platform Architecture & Execution Plan

## Execution Overview

### Step 1: Foundation (Current)
- ✅ Next.js 16 + TypeScript + Tailwind CSS v4
- ✅ Prisma ORM + PostgreSQL schema
- ✅ Dark/Light mode with system preference + manual toggle
- ✅ shadcn/ui-style component library (Radix UI primitives)
- ✅ Project structure & configuration

### Step 2: Authentication
- NextAuth.js v5 (Auth.js) with Credentials + Database adapter
- Login, Register, Forgot Password pages
- Protected route middleware
- Session management

### Step 3: Backend
- Server Actions for Task CRUD
- Dashboard metrics aggregation
- User management APIs
- Notifications system

### Step 4: Frontend
- Animated landing page with CTA
- Admin dashboard with charts (Recharts)
- Task management (Kanban + List views)
- User profile & settings
- Global search (Cmd+K)
- Notifications dropdown

---

## Database Schema

```prisma
// Core Models
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  password      String?   // Hashed for credentials provider
  name          String?
  image         String?
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  accounts      Account[]
  sessions      Session[]
  tasksCreated  Task[]    @relation("CreatedBy")
  tasksAssigned Task[]    @relation("AssignedTo")
  notifications Notification[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
}

model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Priority   @default(MEDIUM)
  dueDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  createdById  String
  assignedToId String?
  
  createdBy  User  @relation("CreatedBy", fields: [createdById], references: [id], onDelete: Cascade)
  assignedTo User? @relation("AssignedTo", fields: [assignedToId], references: [id], onDelete: SetNull)
}

model Notification {
  id        String   @id @default(cuid())
  title     String
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
  
  userId String
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum Role {
  USER
  ADMIN
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  IN_REVIEW
  DONE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

---

## Design Reference

Based on Rocket/Synthgraphix-style business platform:
- **Layout**: Sidebar navigation + top header bar
- **Colors**: Slate/zinc palette, accent for CTAs
- **Charts**: Clean line/bar charts for analytics
- **Cards**: Elevated cards with subtle borders
- **Dark Mode**: Full support with seamless transitions
