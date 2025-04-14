export const decodeJWT = (token: string) => {
  const [_, payload] = token.split(".").slice(0, 2);
  return JSON.parse(atob(payload));
};
