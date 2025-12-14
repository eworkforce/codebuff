
// scripts/create-publisher.ts

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
process.env.NEXT_PUBLIC_CODEBUFF_APP_URL = "http://localhost:3000";
process.env.NEXT_PUBLIC_SUPPORT_EMAIL = "dummy@example.com";
process.env.NEXT_PUBLIC_POSTHOG_HOST_URL = "http://dummy.com";
process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL = "http://dummy.com";

async function main() {
  // Dynamic import to ensure ENV vars are set before module evaluation
  const { db } = await import('@codebuff/internal/db');
  const { publisher } = await import('@codebuff/internal/db/schema');
  const { eq } = await import('drizzle-orm');

  console.log("Creating 'codebuff' publisher...");
  
  const userId = 'bedcc237-6ed7-4642-be38-5effa4c463ef'; // Local Admin ID

  try {
      const existing = await db.query.publisher.findFirst({
          where: eq(publisher.id, 'codebuff')
      });

      if (existing) {
          console.log("Publisher 'codebuff' already exists.");
      } else {
          await db.insert(publisher).values({
              id: 'codebuff',
              name: 'Codebuff',
              user_id: userId,
              created_by: userId,
              verified: true
          });
          console.log("Publisher 'codebuff' created!");
      }

  } catch (error) {
      console.error("Error creating publisher:", error);
  }
  process.exit(0);
}

main();
