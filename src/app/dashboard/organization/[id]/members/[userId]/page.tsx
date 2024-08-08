import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { memberships } from "@/db/schema";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { eq } from "drizzle-orm";
import { Briefcase, Edit2, Mail, MapPin, Phone } from "lucide-react";

export default async function ViewMemberPage({
  params,
}: {
  params: { userId: string; id: string };
}) {
  const person = await db.query.users.findFirst({
    where: eq(memberships.id, params.userId),
    with: {
      memberships: {
        where: eq(memberships.organizationId, params.id),
      },
    },
  });

  return (
    <Layout>
      <LayoutHeader className="flex justify-between">
        <h1>Member</h1>
        <div className="flex gap-4">
          <Button className="flex gap-2">
            <Edit2 size={20} />
            Edit
          </Button>
        </div>
      </LayoutHeader>
      <LayoutBody>
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${params.userId}`}
                alt={params.userId}
              />
              <AvatarFallback>{person?.firstName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold">
                {person?.firstName}
              </CardTitle>
              {/* <p className="text-muted-foreground">{person.role}</p> */}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Mail className="text-muted-foreground" size={18} />
                <span>{person?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="text-muted-foreground" size={18} />
                <span>{person?.memberships[0].phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="text-muted-foreground" size={18} />
                {/* <span>{person.department}</span> */}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-muted-foreground" size={18} />
                {/* <span>{person.location}</span> */}
              </div>
              {/* <div className="mt-4">
                <h3 className="font-semibold mb-2">Bio</h3>
                <p className="text-sm text-muted-foreground">{person.bio}</p>
              </div> */}
            </div>
          </CardContent>
        </Card>
      </LayoutBody>
    </Layout>
  );
}
