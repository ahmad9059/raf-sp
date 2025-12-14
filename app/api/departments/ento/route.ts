import { NextResponse } from "next/server";
import { pgPool } from "@/lib/pg";

export async function GET() {
  try {
    // Check if tables exist
    const tableExistQuery = await pgPool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'ento_profile'
      );
    `);

    if (!tableExistQuery.rows[0].exists) {
      return NextResponse.json(
        { 
          error: "Ento tables not found in database",
          message: "Please run: npx tsx scripts/seed-ento.ts" 
        },
        { status: 503 }
      );
    }

    const profileQuery = await pgPool.query(
      `
        SELECT
          department_id,
          department_name,
          location,
          focal_person,
          designation,
          email,
          officers,
          officials,
          land_acres,
          rooms,
          register_title,
          register_note,
          compiled_on
        FROM ento_profile
        WHERE department_id = $1
        LIMIT 1;
      `,
      ["ento"]
    );

    if (profileQuery.rows.length === 0) {
      return NextResponse.json(
        { error: "Ento profile not found. Run scripts/seed-ento.ts first." },
        { status: 404 }
      );
    }

    const profileRow = profileQuery.rows[0];
    const profile = {
      departmentId: profileRow.department_id,
      departmentName: profileRow.department_name,
      location: profileRow.location,
      focalPerson: profileRow.focal_person,
      designation: profileRow.designation,
      email: profileRow.email,
      officers: profileRow.officers,
      officials: profileRow.officials,
      landAcres: profileRow.land_acres,
      rooms: profileRow.rooms,
      registerTitle: profileRow.register_title,
      registerNote: profileRow.register_note,
      compiledOn: profileRow.compiled_on,
    };

    const itemsQuery = await pgPool.query(
      `
        SELECT
          id,
          item_no,
          name,
          quantity_label,
          date_received,
          last_verified,
          last_verification_label,
          register_label
        FROM ento_inventory_items
        ORDER BY item_no ASC;
      `
    );

    const items = itemsQuery.rows.map((row) => ({
      id: row.id,
      itemNo: row.item_no,
      name: row.name,
      quantityLabel: row.quantity_label,
      dateReceived: row.date_received,
      lastVerified: row.last_verified,
      lastVerificationLabel: row.last_verification_label,
      registerLabel: row.register_label,
    }));

    const stats = {
      totalItems: items.length,
      uniqueItems: new Set(items.map((item) => item.name)).size,
      itemsByYear: items.reduce<Record<string, number>>((acc, item) => {
        const year = item.dateReceived
          ? new Date(item.dateReceived).getUTCFullYear().toString()
          : "Unknown";
        acc[year] = (acc[year] || 0) + 1;
        return acc;
      }, {}),
    };

    const categorizeVerification = (item: typeof items[number]) => {
      const value =
        (item.lastVerified && new Date(item.lastVerified).getUTCFullYear().toString()) ||
        item.lastVerificationLabel;

      if (!value) return "Not Verified";

      const yearMatch = value.match(/(19|20)\d{2}/);
      if (!yearMatch) return "Not Verified";
      const year = Number(yearMatch[0]);

      if (year < 2000) return "Before 2000";
      if (year <= 2010) return "2000-2010";
      if (year <= 2020) return "2011-2020";
      return "After 2020";
    };

    const verificationBuckets = items.reduce<Record<string, number>>((acc, item) => {
      const bucket = categorizeVerification(item);
      acc[bucket] = (acc[bucket] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      profile,
      items,
      verificationBuckets,
      statistics: stats,
    });
  } catch (error) {
    console.error("Error fetching Ento data:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: errorMessage, details: "Check server logs for more information" },
      { status: 500 }
    );
  }
}
