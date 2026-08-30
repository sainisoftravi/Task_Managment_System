import { PrismaClient } from "@prisma/client";
import { wsServer } from "./websocket-server";
import { TicketPriority } from "../types";
import prisma from "./prisma";

const prismaClient = new PrismaClient();

export async function evaluateSLAs() {
  const policies = await prisma.slaPolicy.findMany({
    where: { active: true },
    include: { escalations: true },
  });

  const now = new Date();

  let breachedCount = 0;

  for (const policy of policies) {
    const priorities = policy.priority
      ? [policy.priority]
      : ["LOW", "MEDIUM", "HIGH", "URGENT"];

    const breachedTickets = await prisma.ticket.findMany({
      where: {
        priority: { in: priorities },
        status: { in: ["OPEN", "IN_PROGRESS", "ON_HOLD"] },
        slaDueAt: { lte: now },
        slaBreached: false,
      },
      select: {
        id: true,
        assigneeId: true,
        teamId: true,
        priority: true,
      },
    });

    await Promise.all(
      breachedTickets.map(async (ticket) => {
        await prisma.ticket.update({
          where: { id: ticket.id },
          data: { slaBreached: true },
        });

        wsServer.broadcastToTeam(ticket.teamId ?? "", {
          type: "sla:breached",
          payload: { ticketId: ticket.id, priority: ticket.priority },
        });
      })
    );
    breachedCount += breachedTickets.length;

    for (const escalation of policy.escalations) {
      const warnTime = new Date(now.getTime() + escalation.afterMinutes * 60 * 1000);

      const warningTickets = await prisma.ticket.findMany({
        where: {
          priority: { in: priorities },
          status: { in: ["OPEN", "IN_PROGRESS", "ON_HOLD"] },
          slaDueAt: { lte: warnTime },
          slaBreached: false,
        },
        select: { id: true, assigneeId: true, teamId: true, priority: true },
      });

      await Promise.all(
        warningTickets.map(async (ticket) => {
          if (!ticket.assigneeId && escalation.action === "REASSIGN") {
            const teamAgents = await prisma.user.findMany({
              where: { teamId: ticket.teamId, role: { in: ["AGENT", "MANAGER", "ADMIN"] } },
            });

            if (teamAgents.length > 0) {
              const randomAgent = teamAgents[Math.floor(Math.random() * teamAgents.length)];
              await prisma.ticket.update({
                where: { id: ticket.id },
                data: { assigneeId: randomAgent.id },
              });

              wsServer.broadcastToTeam(ticket.teamId ?? "", {
                type: "ticket:updated",
                payload: {
                  ticketId: ticket.id,
                  changes: { assigneeId: randomAgent.id },
                },
              });
            }
          }

          wsServer.broadcastToTeam(ticket.teamId ?? "", {
            type: `sla:${escalation.action.toLowerCase()}`,
            payload: {
              ticketId: ticket.id,
              priority: ticket.priority,
              action: escalation.action,
              afterMinutes: escalation.afterMinutes,
            },
          });
        })
      );
    }
  }

  return { evaluated: policies.length, breached: breachedCount };
}

export async function runSLACheck() {
  try {
    const result = await evaluateSLAs();
    console.log("[SLA Engine] Run complete:", result);
    return result;
  } catch (err) {
    console.error("[SLA Engine] Error:", err);
    return null;
  }
}

if (require.main === module) {
  runSLACheck().then(() => process.exit(0));
}

export { prismaClient };
