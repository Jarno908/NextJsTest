import { Button, Center, Container, Stack, Text, Title } from "@mantine/core"
import { Provider } from "next-auth/providers"
import { getProviders, signIn } from "next-auth/react"

export default function SignIn({ providers }: { providers: Provider }) {
  return (
    <Container sx={(theme) => ({ paddingTop: theme.spacing.xl })}>
      <Center>
        <Stack>
          <Title order={1} align="center" >Login</Title>
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