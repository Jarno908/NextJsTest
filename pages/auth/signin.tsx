import { Button, Center, Container, Stack, Text, Title } from "@mantine/core"
import { Provider } from "next-auth/providers"
import { getProviders, signIn } from "next-auth/react"
import { useRouter } from "next/router";
import { isDevelopment } from "../../helpers/EnironmentHelpers";

// [Documentation](https://next-auth.js.org/configuration/pages#sign-in-page)

export default function SignIn({ providers }: { providers: Provider }) {
  const { error } = useRouter().query;
  return (
    <Container sx={(theme) => ({ paddingTop: theme.spacing.xl })}>
      <Center>
        <Stack>
          <Title order={1} align="center" >Login</Title>
          {error && typeof error === "string" && <SignInError error={error} />}
          <Text>Log in met een van de onderstaande methodes:</Text>
        </Stack>
      </Center>
      <Center sx={(theme) => ({ marginTop: theme.spacing.md })}>
        <Stack sx={(theme) => ({ 
          padding: theme.spacing.xl,
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
          borderRadius: theme.radius.md
          })}>
          {Object.values(providers).map((provider) => (
            <Button key={provider.name} onClick={() => signIn(provider.id, null, { prompt: "login" })}>
              Log in met {provider.name}
            </Button>
          ))}
        </Stack>
      </Center>
    </Container>
  )
}

export async function getServerSideProps(context) {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}

const devErrorMessages = {
  oauthsignin: "Error in constructing an authorization URL.",
  oauthcallback: "Error in handling the response from an OAuth provider.",
  oauthcreateaccount: "Could not create OAuth provider user in the database.",
  oauthaccountnotlinked: "The email on the account is already linked, but not with this OAuth account.",
  callback: "Error in the OAuth callback handler route.",
  default: "Default Error message.",
};
const prodErrorMessages = {
  oauthaccountnotlinked: "Log altublieft in met dezelfde methode als de eerste keer.",
  default: "Error tijdens het inloggen, probeer het altublieft opnieuw.",
}

const excludedErrors = [
  "sessionrequired"
]

const SignInError = ({ error }: {error: string}) => {
  error = error.toLowerCase();
  if(excludedErrors.includes(error)) return null;
  const errorMessages = isDevelopment ? devErrorMessages : prodErrorMessages;
  const errorMessage = error && (errorMessages[error] ?? errorMessages.default);
  return (
    <Text color="red">
      {errorMessage}
    </Text>
  );
};