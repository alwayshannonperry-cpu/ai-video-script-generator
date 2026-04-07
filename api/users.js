let proUsers = [];

export function addUser(email) {
  if (!proUsers.includes(email)) {
    proUsers.push(email);
    console.log("USER SAVED:", email);
  }
}

export function isPro(email) {
  return proUsers.includes(email);
}
