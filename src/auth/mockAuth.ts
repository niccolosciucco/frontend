function base64UrlEncode(obj: object): string {
  const json = JSON.stringify(obj);
  const base64 = btoa(json);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function createMockToken(
  username: string,
  role: "ADMIN" | "USER",
): string {
  const header = { alg: "none", typ: "JWT" };
  const payload = {
    sub: username,
    role,
    exp: Math.floor(Date.now() / 1000) + 8 * 3600, // scade tra 8 ore
  };
  return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.mocksignature`;
}
