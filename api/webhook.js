@@ -1,8 +1,47 @@
export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log("Webhook received!");
    res.status(200).json({ received: true });
  } else {
    res.status(405).end();
  }
