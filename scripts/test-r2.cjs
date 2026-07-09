require("dotenv/config");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListBucketsCommand,
  HeadBucketCommand,
} = require("@aws-sdk/client-s3");

const accountId = process.env.R2_ACCOUNT_ID;
const bucket = process.env.R2_BUCKET_NAME;

console.log("Account ID:", accountId ? `${accountId.slice(0, 6)}...` : "(missing)");
console.log("Bucket:", bucket || "(missing)");
console.log("Access key set:", Boolean(process.env.R2_ACCESS_KEY_ID));

const client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function main() {
  try {
    console.log("\n1. List buckets...");
    const list = await client.send(new ListBucketsCommand({}));
    const names = (list.Buckets || []).map((b) => b.Name);
    console.log("   Buckets visible to token:", names.length ? names.join(", ") : "(none)");
    if (bucket && !names.includes(bucket)) {
      console.log(`   WARNING: "${bucket}" not in list — token may be scoped to other bucket(s)`);
    }
  } catch (e) {
    console.log("   List buckets failed:", e.name, "-", e.message);
  }

  try {
    console.log("\n2. Head bucket...");
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
    console.log("   Bucket accessible");
  } catch (e) {
    console.log("   Head bucket failed:", e.name, "-", e.message);
  }

  const key = "test/connection-check.txt";
  try {
    console.log("\n3. Upload test file...");
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: "R2 connection OK",
        ContentType: "text/plain",
      }),
    );
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    console.log("   R2 OK: upload and delete succeeded");
  } catch (e) {
    console.log("   Upload failed:", e.name, "-", e.message);
    if (e.$metadata) console.log("   HTTP status:", e.$metadata.httpStatusCode);
    process.exit(1);
  }
}

main();
