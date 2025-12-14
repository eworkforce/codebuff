
// scripts/create-local-user.ts

// Mock ENV vars before imports
process.env.DATABASE_URL = "postgresql://manicode_user_local:secretpassword_local@localhost:5432/manicode_db_local";
process.env.NEXT_PUBLIC_CB_ENVIRONMENT = "dev";

// Set dummy values for required env vars to pass schema validation
const dummyVars = [
  "OPEN_ROUTER_API_KEY", "OPENAI_API_KEY", "RELACE_API_KEY", "LINKUP_API_KEY",
  "GOOGLE_CLOUD_PROJECT_ID", "PORT", "CODEBUFF_GITHUB_ID", "CODEBUFF_GITHUB_SECRET",
  "NEXTAUTH_SECRET", "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET_KEY",
  "STRIPE_USAGE_PRICE_ID", "STRIPE_TEAM_FEE_PRICE_ID", "LOOPS_API_KEY",
  "DISCORD_PUBLIC_KEY", "DISCORD_BOT_TOKEN", "DISCORD_APPLICATION_ID",
  "API_KEY_ENCRYPTION_SECRET",
  // Client Env Vars
  "NEXT_PUBLIC_CODEBUFF_APP_URL", "NEXT_PUBLIC_CODEBUFF_BACKEND_URL",
  "NEXT_PUBLIC_SUPPORT_EMAIL", "NEXT_PUBLIC_POSTHOG_HOST_URL",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL"
];
dummyVars.forEach(v => { if (!process.env[v]) process.env[v] = "dummy"; });
if (!process.env.API_KEY_ENCRYPTION_SECRET || process.env.API_KEY_ENCRYPTION_SECRET === 'dummy') {
    process.env.API_KEY_ENCRYPTION_SECRET = "12345678901234567890123456789012"; 
}

// Port must be a number
process.env.PORT = "4242";
process.env.NEXT_PUBLIC_CODEBUFF_APP_URL = "http://localhost:3000"; // needs to be a URL
process.env.NEXT_PUBLIC_SUPPORT_EMAIL = "dummy@example.com";
process.env.NEXT_PUBLIC_POSTHOG_HOST_URL = "http://dummy.com";
process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL = "http://dummy.com";

async function main() {
  // Dynamic import to ensure ENV vars are set before module evaluation
  const { db } = await import('@codebuff/internal/db');
  const { user, creditLedger, session } = await import('@codebuff/internal/db/schema');
  const { eq } = await import('drizzle-orm');

  console.log("Creating local user...");
  
  const userId = crypto.randomUUID();
  const email = "admin@localhost";
  const name = "Local Admin";
  // Generate a simple token
  const authToken = "cb_local_" + crypto.randomUUID().replace(/-/g, '');

  try {
      // 1. Create/Get User
      console.log(`Checking user: ${email}`);
      let finalUserId = userId;
      
      const existingUser = await db.query.user.findFirst({
          where: eq(user.email, email)
      });

      if (existingUser) {
          console.log(`User already exists: ${existingUser.id}`);
          finalUserId = existingUser.id;
      } else {
          console.log(`Inserting new user...`);
          await db.insert(user).values({
              id: userId,
              email,
              name,
              emailVerified: new Date(),
          });
      }

      // 2. Grant Credits
      console.log("Granting 1,000,000 credits...");
      await db.insert(creditLedger).values({
          operation_id: crypto.randomUUID(),
          user_id: finalUserId,
          principal: 1000000,
          balance: 1000000,
          type: 'purchase', 
          priority: 1,
          description: "Local development unlimited grant",
          created_at: new Date()
      });

      // 3. Create Session (Auth Token)
      console.log("Creating session token...");
      // Clean up old sessions for this user to keep it clean (optional)
      // await db.delete(session).where(eq(session.userId, finalUserId));
      
      await db.insert(session).values({
          sessionToken: authToken,
          userId: finalUserId,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year
          type: 'cli'
      });

      console.log("\nSUCCESS!");
      console.log("---------------------------------------------------");
      console.log("To authenticate the CLI, create/edit: ~/.config/manicode/credentials.json");
      console.log("With the following content:");
      console.log(JSON.stringify({
          default: {
              id: finalUserId,
              name: name,
              email: email,
              authToken: authToken
          }
      }, null, 2));
      console.log("---------------------------------------------------");

  } catch (error) {
      console.error("Error creating user:", error);
  }
  process.exit(0);
}

main();
