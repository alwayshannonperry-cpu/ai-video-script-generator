let proUsers = ["chuckypbaby@gmail.com"]; // TEMP LIST

export default function handler(req, res) {
  const { email } = req.query;

  if (proUsers.includes(email)) {
    return res.status(200).json({ pro: true });
  }

  res.status(200).json({ pro: false });
}
