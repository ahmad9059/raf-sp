import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ADAPTIVE_RESEARCH_DEPARTMENT_ID = "arc";

export async function GET() {
  try {
    const department = await prisma.department.findFirst({
      where: {
        OR: [
          { id: ADAPTIVE_RESEARCH_DEPARTMENT_ID },
          {
            name: {
              contains: "Adaptive Research",
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        adaptiveResearchPositions: {
          orderBy: [{ orderNumber: "asc" }, { createdAt: "asc" }],
        },
      },
    });

    if (!department) {
      return NextResponse.json({ error: "Adaptive Research Center not found" }, { status: 404 });
    }

    const positions = department.adaptiveResearchPositions;

    const totals = positions.reduce(
      (acc, pos) => {
        acc.sanctioned += pos.sanctionedPosts;
        acc.filled += pos.filledPosts;
        acc.vacant += pos.vacantPosts;
        acc.promotion += pos.promotionPosts;
        acc.initial += pos.initialRecruitmentPosts;
        return acc;
      },
      { sanctioned: 0, filled: 0, vacant: 0, promotion: 0, initial: 0 }
    );

    const vacancyRate = totals.sanctioned
      ? Math.round((totals.vacant / totals.sanctioned) * 1000) / 10
      : 0;

    const bpsMap = new Map<
      string,
      { bps: string; sanctioned: number; filled: number; vacant: number }
    >();

    positions.forEach((pos) => {
      const entry =
        bpsMap.get(pos.bpsScale) ||
        { bps: pos.bpsScale, sanctioned: 0, filled: 0, vacant: 0 };
      entry.sanctioned += pos.sanctionedPosts;
      entry.filled += pos.filledPosts;
      entry.vacant += pos.vacantPosts;
      bpsMap.set(pos.bpsScale, entry);
    });

    const bpsBreakdown = Array.from(bpsMap.values()).sort(
      (a, b) => b.sanctioned - a.sanctioned
    );

    const vacancyLeaders = positions
      .filter((pos) => pos.vacantPosts > 0)
      .sort((a, b) => b.vacantPosts - a.vacantPosts || b.sanctionedPosts - a.sanctionedPosts)
      .slice(0, 5);

    return NextResponse.json({
      department: {
        id: department.id,
        name: department.name,
        location: department.location,
        description: department.description,
        focalPerson: department.focalPerson,
        designation: department.designation,
        phone: department.phone,
        email: department.email,
      },
      positions,
      stats: {
        totalSanctioned: totals.sanctioned,
        totalFilled: totals.filled,
        totalVacant: totals.vacant,
        promotionPosts: totals.promotion,
        initialRecruitmentPosts: totals.initial,
        vacancyRate,
      },
      breakdown: {
        bpsBreakdown,
        vacancyLeaders,
      },
    });
  } catch (error) {
    console.error("Error fetching Adaptive Research data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
