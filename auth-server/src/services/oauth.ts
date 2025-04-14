import { db } from "./db";

export type CodeRecord = {
  code: string;
  code_challenge: string;
  client_id: string;
  redirect_uri: string;
  sub: string;
};

export const generateAuthorizationCode = ({
  codeChallenge,
  clientId,
  redirectUri,
  sub,
}: {
  codeChallenge: string;
  clientId: string;
  redirectUri: string;
  sub: string;
}) => {
  const code = crypto.randomUUID();
  const statement = db.prepare<CodeRecord, Record<string, string>>(
    `INSERT INTO auth_codes (code, code_challenge, client_id, redirect_uri, sub) VALUES ($code, $codeChallenge, $clientId, $redirectUri, $sub)`
  );
  statement.run({
    $code: code,
    $codeChallenge: codeChallenge,
    $clientId: clientId,
    $redirectUri: redirectUri,
    $sub: sub,
  });
  return code;
};

export const consumeAuthorizationCode = (code: string) => {
  const statement = db.prepare<CodeRecord, string>(
    `SELECT code, code_challenge, client_id, redirect_uri, sub FROM auth_codes WHERE code = ?`
  );

  const row = statement.get(code);
  if (!row) return null;

  const { code: c, code_challenge, client_id, redirect_uri, sub } = row;

  const deleteStatement = db.prepare<void, string>(
    `DELETE FROM auth_codes WHERE code = ?`
  );
  deleteStatement.run(c);

  return {
    code: c,
    codeChallenge: code_challenge,
    clientId: client_id,
    redirectUri: redirect_uri,
    sub,
  };
};

export const verifyPKCE = async (
  codeVerifier: string,
  codeChallenge: string
) => {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(codeVerifier)
  );
  const base64url = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return base64url === codeChallenge;
};
