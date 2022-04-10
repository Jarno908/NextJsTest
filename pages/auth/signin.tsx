import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react"
import type { AppProvider } from "next-auth/providers"

type Props = {
    providers: AppProvider;
  };

const SignIn = ({ providers }:InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </>
  )
}

export async function getServerSideProps() {
    const providers = await getProviders()
    return {
        props: { providers },
    }
};

export default SignIn;