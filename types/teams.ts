import { Team, TeamMember } from "@prisma/client";

export type TeamWithMembers = Team & { members: TeamMember[] };
