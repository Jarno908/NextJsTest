import { Button, Card, Container, Text, Title } from "@mantine/core";
import { signOut } from "next-auth/react";
import Layout from "../../components/Layout";

export default function SignoutPage() {
  return (
    <Layout>
        <Container className="signout">
          <Card sx={(theme) => ({
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
          })}>
            <Title order={1}>Signout</Title>
            <Text>Weet je zeker dat je wilt uitloggen?</Text>
            <Button onClick={() => signOut()}>
                Log uit
            </Button>
          </Card>
        </Container>
    </Layout>
  )
}