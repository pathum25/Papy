import { GetServerSideProps } from "next";
import { getProviders, getCsrfToken, LiteralUnion, ClientSafeProvider, signIn } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers";
import Layout from "../../components/Layout";

type Props = {
  providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
  csrfToken?: string | null;
};

export default function SignIn({ providers, csrfToken }: Props) {
  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Sign in to Papy</h1>

        <div className="space-y-4">
          {providers &&
            Object.values(providers).map((provider) => {
              if (provider.id === "email") return null; // handle email below
              return (
                <div key={provider.name}>
                  <button
                    onClick={() => signIn(provider.id)}
                    className="w-full px-4 py-2 border rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Sign in with {provider.name}
                  </button>
                </div>
              );
            })}

          <div className="pt-2">
            <div className="text-sm text-gray-500 mb-2">Or sign in with email (magic link)</div>
            <form method="post" action="/api/auth/signin/email" className="space-y-2">
              <input name="csrfToken" type="hidden" defaultValue={csrfToken || ""} />
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full p-2 border rounded"
              />
              <button type="submit" className="w-full px-4 py-2 bg-green-600 text-white rounded">
                Send magic link
              </button>
            </form>
          </div>

          <div className="pt-4 text-xs text-gray-500">
            Note: OAuth providers require credentials in your .env (GITHUB_ID, GITHUB_SECRET, GOOGLE_ID, GOOGLE_SECRET). Email sign-in requires EMAIL_SERVER and EMAIL_FROM.
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return {
    props: { providers, csrfToken }
  };
};
