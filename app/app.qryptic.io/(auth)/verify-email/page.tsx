import prisma from "@/db/prisma";
import { redirect } from "next/navigation";
import { QrypticLogo } from "@/components/logos/qryptic-logo";
import { CardDescription, CardHeader, CardTitle, Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type VerifyEmailPageProps = {
  searchParams: { token?: string };
};

const VerifyEmailPage = async ({ searchParams }: VerifyEmailPageProps) => {
  const { token } = searchParams;
  if (!token) redirect("/login");
  const user = await prisma.user.findFirst({ where: { emailToken: token } });
  if (!user) redirect("/login");

  // update users email verified status
  await prisma.user.update({
    where: { id: user.id },
    data: { isEmailVerified: true, emailToken: null },
  });

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-[420px] flex-col items-center space-y-6">
        <QrypticLogo className="h-[18px]" />
        <Card className="w-full py-2">
          <CardHeader>
            <CardTitle className="text-center">You email is now verified</CardTitle>
            <CardDescription className="text-center text-[13px]">
              You can continue to use your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto max-w-[320px]">
              <Button className="w-full" asChild>
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
