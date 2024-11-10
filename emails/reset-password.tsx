import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import { protocol, appDomain } from "@/utils/qryptic/domains";

export const ResetPasswordEmail = (token: string) => (
  <Html>
    <Head />
    <Preview>Reset your password on Qryptic</Preview>
    <Tailwind>
      <Body className="bg-white font-sans">
        <Container className="mx-auto my-8 w-full max-w-[400px] rounded-xl border border-solid border-zinc-200 px-6 py-10">
          <Img
            src={"https://qryptic.s3.amazonaws.com/logos/qryptic-wordmark.png"}
            height={26}
            width={110}
            alt="qryptic"
            className="mx-auto mb-6"
          />
          <Text className="text-sm">Click the button below to reset your password.</Text>
          <Section className="my-6 text-center">
            <Button
              className="block rounded-md bg-black py-2.5 text-center text-sm font-medium text-white no-underline"
              href={`${protocol}${appDomain}/reset-password?token=${token}`}
            >
              Reset password
            </Button>
          </Section>
          <Text className="text-sm">
            Best,
            <br />
            The Qryptic Team
          </Text>
          {/*<Hr className="my-4 border" />*/}
          {/*<Text className="text-xs text-muted-foreground">*/}
          {/*  &copy; Qryptic 2024. All rights reserved.*/}
          {/*</Text>*/}
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
