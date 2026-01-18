import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get the visitor counter (there should only be one record)
    let counter = await prisma.visitorCounter.findFirst();

    if (!counter) {
      // Create initial counter if it doesn't exist
      counter = await prisma.visitorCounter.create({
        data: {
          count: 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      count: counter.count,
    });
  } catch (error) {
    console.error("Visitor count fetch error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function POST() {
  try {
    // Get the visitor counter (there should only be one record)
    let counter = await prisma.visitorCounter.findFirst();

    if (!counter) {
      // Create initial counter if it doesn't exist
      counter = await prisma.visitorCounter.create({
        data: {
          count: 1,
        },
      });
    } else {
      // Increment the counter
      counter = await prisma.visitorCounter.update({
        where: { id: counter.id },
        data: {
          count: {
            increment: 1,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      count: counter.count,
    });
  } catch (error) {
    console.error("Visitor count increment error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
