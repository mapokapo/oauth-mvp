import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { exchangeCode } from "../lib/oauthClient";
import { useUser } from "../lib/hooks/use-user";

const CallbackPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const hasRun = useRef(false); // Prevents the effect from running twice
  const { refreshUser } = useUser();

  useEffect(() => {
    if (hasRun.current) return; // Skip if already run
    hasRun.current = true;

    const code = params.get("code");
    if (!code) {
      console.error("No code found in URL");
      return;
    }

    exchangeCode(code)
      .then(async (tokens) => {
        localStorage.setItem("access_token", tokens.access_token);
        localStorage.setItem("id_token", tokens.id_token);
        await refreshUser();
        navigate("/profile");
      })
      .catch(console.error);
  }, [params, navigate, refreshUser]);

  return <div>Logging in...</div>;
};

export default CallbackPage;
