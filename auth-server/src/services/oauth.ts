import { db } from "./db";

export type CodeRecord = {
  code: string;
  client_id: string;
  redirect_uri: string;
  sub: string;
};

export const generateAuthorizationCode = ({
  clientId,
  redirectUri,
  sub,
}: {
  clientId: string;
  redirectUri: string;
  sub: string;
}) => {
  const code = crypto.randomUUID();
  const statement = db.prepare<CodeRecord, Record<string, string>>(
    `INSERT INTO auth_codes (code, client_id, redirect_uri, sub) VALUES ($code, $codeChallenge, $clientId, $redirectUri, $sub)`
  );
  statement.run({
    $code: code,
    $clientId: clientId,
    $redirectUri: redirectUri,
    $sub: sub,
  });
  return code;
};

export const consumeAuthorizationCode = (code: string) => {
  const statement = db.prepare<CodeRecord, string>(
    `SELECT code, client_id, redirect_uri, sub FROM auth_codes WHERE code = ?`
  );

  const row = statement.get(code);
  if (!row) return null;

  const { code: c, client_id, redirect_uri, sub } = row;

  const deleteStatement = db.prepare<void, string>(
    `DELETE FROM auth_codes WHERE code = ?`
  );
  deleteStatement.run(c);

  return {
    code: c,
    clientId: client_id,
    redirectUri: redirect_uri,
    sub,
  };
};
