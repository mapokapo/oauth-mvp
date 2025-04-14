export const generateCodeVerifier = (): string => {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return btoa(String.fromCharCode(...arr))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export const generateCodeChallenge = async (
  verifier: string
): Promise<string> => {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier)
  );
  const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export async function redirectToAuth() {
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI;
  const authUrl = import.meta.env.VITE_AUTH_URL;

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  localStorage.setItem("pkce_verifier", codeVerifier);

  const url = new URL(authUrl + "/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "openid profile email");
  url.searchParams.set("state", "");
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("code_challenge", codeChallenge);

  window.location.href = url.toString();
}

export async function exchangeCode(code: string) {
  const tokenUrl = import.meta.env.VITE_AUTH_URL + "/token";
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI;
  const codeVerifier = localStorage.getItem("pkce_verifier")!;

  const res = await fetch(tokenUrl, {
    method: "POST",
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Token exchange failed");
  return res.json();
}

export const decodeJWT = (token: string) => {
  const [, payload] = token.split(".");
  return JSON.parse(atob(payload));
};

export async function getCurrentUser(): Promise<{
  sub: string;
  email: string;
}> {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token stored");

  const res = await fetch(`${import.meta.env.VITE_AUTH_URL}/userinfo`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user: ${res.status}`);
  }

  return res.json();
}
