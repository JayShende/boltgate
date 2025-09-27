<div align="center">
  <img src="image/README/header_image.png" alt="Boltgate Header" width="600" />

<h1>⚡ Boltgate</h1>
  <p><strong>One bolt to secure it all</strong></p>

<p>CLI tool that sets up <strong>NextAuth v5</strong> with Prisma in your Next.js project with just one command. No more manual configuration - get a complete authentication system ready to use!</p>
</div>

## ✨ What You Get

- 🔐 Complete NextAuth v5 setup with Prisma
- 🎨 Modern login UI with OAuth providers (GitHub, Google)
- 🛡️ Route protection middleware with regex support
- 🗄️ Database schema with User/Account models
- 🎯 Ready-to-use components and pages
- 📱 Responsive design with Tailwind CSS
- 🚀 **NEW**: Flexible public URL configuration with regex patterns

---

## 🚀 Quick Start

### 1. Install Boltgate

```bash
npm install -g boltgate
```

### 2. Run in your Next.js project

```bash
cd your-nextjs-project
boltgate
```

### 3. Set up your database

Add your database URL to `.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/mydb"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. Start your app

```bash
npm run dev
```

That's it! You now have a complete authentication system. 🎉

---

## 🎨 Customization

### Adding OAuth Providers

Edit `auth.config.ts` to add more providers:

```typescript
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [GitHub, Google, Discord],
} satisfies NextAuthConfig;
```

Add the required environment variables:

```env
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
GOOGLE_ID="your-google-client-id"
GOOGLE_SECRET="your-google-client-secret"
DISCORD_ID="your-discord-client-id"
DISCORD_SECRET="your-discord-client-secret"
```

### Customizing Routes

Edit `route.ts` to define which routes are public or protected. You can now use both exact string matches and regex patterns for more flexible route configuration:

```typescript
/**
 * Public routes (exact or pattern-based).
 * - Strings = exact matches
 * - Regex = dynamic patterns
 */
export const publicRoutes: (string | RegExp)[] = [
  "/", // homepage (exact match)
  "/about", // about page (exact match)
  /^\/form\/[^/]+\/view$/, // matches /form/{anything}/view (regex pattern)
  /^\/form\/[^/]+\/edit$/, // matches /form/{anything}/edit (regex pattern)
  /^\/blog\/\d{4}\/\d{2}\/\d{2}\/.+$/, // matches /blog/YYYY/MM/DD/title (regex pattern)
];

export const authRoutes = ["/auth/login", "/auth/register"];

export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
```

#### Regex Pattern Examples

- `/^\/form\/[^/]+\/view$/` - Matches any form view URL like `/form/contact/view`, `/form/survey/view`
- `/^\/blog\/\d{4}\/\d{2}\/\d{2}\/.+$/` - Matches blog posts with date structure like `/blog/2024/01/15/my-post`
- `/^\/api\/public\/.+$/` - Matches all public API routes like `/api/public/users`, `/api/public/data`
- `/^\/docs\/[a-z-]+$/` - Matches documentation pages like `/docs/getting-started`, `/docs/api-reference`

### Adding Custom User Fields

Extend the Prisma schema in `prisma/schema.prisma`:

```prisma
model User {
  id            String          @id @default(cuid())
  name          String?
  email         String          @unique
  emailVerified DateTime?
  image         String?
  role          String          @default("USER")
  bio           String?
  accounts      Account[]
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
}
```

Then run:

```bash
npx prisma migrate dev
```

### Customizing the Login Component

Edit `components/login_component_1.tsx` to match your design:

```typescript
// Add your custom styling, additional providers, or branding
const LoginComponent = () => {
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Welcome to MyApp</CardTitle>
        <CardDescription>Sign in to continue</CardDescription>

        {/* Your custom login buttons */}
        <Button onClick={() => signIn("github")}>
          <FaGithub />
          Continue with GitHub
        </Button>
      </CardHeader>
    </Card>
  );
};
```

---

## 📁 Project Structure

After running Boltgate, your project will have:

```
your-project/
├── app/
│   ├── (protected)/
│   │   └── dashboard/page.tsx     # Protected dashboard
│   ├── api/auth/[...nextauth]/
│   │   └── route.ts               # Auth API routes
│   ├── auth/login/page.tsx        # Login page
│   └── lib/index.ts               # Prisma client
├── components/
│   └── login_component_1.tsx      # Login component
├── auth.config.ts                 # Auth providers config
├── auth.ts                        # Main auth setup
├── middleware.ts                  # Route protection
├── route.ts                       # Route constants
└── prisma/schema.prisma           # Database schema
```

---

## 🔧 Common Tasks

### Adding a New Protected Page

1. Create your page in `app/(protected)/your-page/page.tsx`
2. The middleware will automatically protect it

### Adding a New Public Page

1. Add the route to `publicRoutes` in `route.ts` (supports both exact strings and regex patterns)
2. Create your page normally

**Examples:**

- For exact routes: `"/about"`, `"/contact"`
- For dynamic routes: `/^\/product\/[^/]+$/` (matches `/product/laptop`, `/product/phone`)

### Customizing User Session

Edit `auth.ts` to add custom session data:

```typescript
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(client),
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        // Add custom fields
        session.user.role = token.role;
      }
      return session;
    },
  },
  // ... rest of config
});
```

---

## 🐛 Troubleshooting

### "Module not found" errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### Database connection issues

- Check your `DATABASE_URL` in `.env`
- Make sure your database is running
- Verify the connection string format

### OAuth provider not working

- Verify client ID and secret in `.env`
- Check redirect URLs in provider settings
- Ensure `NEXTAUTH_URL` is set correctly

### Prisma client not generated

```bash
npx prisma generate
```

---

## 📦 What Gets Installed

Boltgate automatically installs:

- `next-auth@beta` - Authentication library
- `@auth/prisma-adapter` - Database adapter
- `@prisma/client` - Database client
- `prisma` - Database toolkit
- `react-icons` - UI icons

---

## 🤝 Contributing

Found a bug or want to add a feature? We'd love your help!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - feel free to use in your projects!

---

**Made with ❤️ by [Jay Shnde](https://github.com/JayShende)**
