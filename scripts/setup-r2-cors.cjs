require("dotenv/config");
const {
  S3Client,
  PutBucketCorsCommand,
  GetBucketCorsCommand,
} = require("@aws-sdk/client-s3");

const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const bucket = process.env.R2_BUCKET_NAME;

const corsRules = [
  {
    AllowedOrigins: ["https://blairsworkshop.com", "http://localhost:3000"],
    AllowedMethods: ["PUT"],
    AllowedHeaders: ["content-type"],
    MaxAgeSeconds: 3600,
  },
];

async function main() {
  try {
    await client.send(
      new PutBucketCorsCommand({
        Bucket: bucket,
        CORSConfiguration: { CORSRules: corsRules },
      }),
    );
    const check = await client.send(new GetBucketCorsCommand({ Bucket: bucket }));
    console.log("CORS set successfully:");
    console.log(JSON.stringify(check.CORSRules, null, 2));
  } catch (e) {
    console.error("CORS setup failed:", e.name, "-", e.message);
    process.exit(1);
  }
}

main();
