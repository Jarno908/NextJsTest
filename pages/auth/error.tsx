
 // [Documentation](https://next-auth.js.org/configuration/pages#error-page)

import { Button, Card, Container, Stack, Text } from "@mantine/core"
import Link from "next/link"
import { useRouter } from "next/router"

export type ErrorType =
  | "default"
  | "accessdenied"

export default function ErrorPage() {
    const { error } = useRouter().query;

    const errors = {
        default: {
            heading: "Error",
            message: (
                <Text>
                    <p>Er heeft een error opgetreden.</p> 
                    <p>Als het probleem zich blijf herhalen neem dan contact op met de administrator van de site.</p>
                </Text>
            ),
        },
        accessdenied: {
            heading: "Toegang Geweigerd",
            message: (
                <Text>
                    <p>Je hebt niet de juiste rechten om toegang te krijgen.</p>
                </Text>
            ),
            signin: (
                <Link href="/auth/signin" passHref>
                    <Button component="a">Log in met een ander account</Button>
                </Link>
            ),
        },
    }

    const errorCode = typeof error === "string" ? error : "default"
    const { heading, message, signin } =
        errors[errorCode.toLowerCase()] ?? errors.default

    return (
        <Container>
            <Card>
                <h1>{heading}</h1>
                <div >{message}</div>
                {signin}
            </Card>
        </Container>
    );
}