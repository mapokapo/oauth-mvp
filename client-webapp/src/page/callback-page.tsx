import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { exchangeCode } from "../lib/oauthClient";

const CallbackPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const hasRun = useRef(false); // Prevents the effect from running twice

  useEffect(() => {
    if (hasRun.current) return; // Skip if already run
    hasRun.current = true;

    const code = params.get("code");
    if (!code) {
      console.error("No code found in URL");
      return;
    }

    exchangeCode(code)
      .then((tokens) => {
        localStorage.setItem("access_token", tokens.access_token);
        localStorage.setItem("id_token", tokens.id_token);
        navigate("/profile");
      })
      .catch(console.error);
  }, [params, navigate]);

  return <div>Logging in...</div>;
};

export default CallbackPage;
