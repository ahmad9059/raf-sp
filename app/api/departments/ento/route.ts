import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const department = await prisma.department.findUnique({
      where: { id: "ento" },
    });

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    const stockItems = await prisma.eRSSStockRegister.findMany({
      where: { departmentId: "ento" },
      orderBy: { registerPageNo: "asc" },
    });

    // Calculate statistics
    const totalItems = stockItems.length;
    const uniqueItems = new Set(stockItems.map((item) => item.name)).size;
    
    // Group by year received (if available)
    const itemsByYear = stockItems.reduce((acc, item) => {
      if (item.dateReceived) {
        const year = new Date(item.dateReceived).getFullYear().toString();
        acc[year] = (acc[year] || 0) + 1;
      } else {
        acc["Unknown"] = (acc["Unknown"] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      department,
      stockItems,
      statistics: {
        totalItems,
        uniqueItems,
        itemsByYear,
      },
    });
  } catch (error) {
    console.error("Error fetching Ento data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
