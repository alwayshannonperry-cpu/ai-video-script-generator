let users = [];

export function addUser(email){
if(!users.includes(email)){
users.push(email);
}
}

export function isPro(email){
return users.includes(email);
}
