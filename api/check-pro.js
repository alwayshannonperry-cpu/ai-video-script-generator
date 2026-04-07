import { isPro } from "./users";

export default function handler(req, res) {
  const { email } = req.query;

  const pro = isPro(email);

  res.status(200).json({ pro });
}
