import "dotenv/config";
import { prisma } from "../lib/prisma";
import fs from "fs";

async function main() {
  const users = await prisma.user.findMany({
    where: { role: "DEPT_HEAD" },
    include: { department: true },
    orderBy: { email: "asc" },
  });

  let md = "# Department Login Credentials\n\n";
  md += "This file lists departments, focal person details, and seeded login credentials (used in scripts/departmentLogins).\n\n";

  for (const u of users) {
    const dep = u.department;
    md += `## ${dep?.name || "Unknown Department"} (${u.departmentId || "no-id"})\n\n`;
    md += `- **Focal Person:** ${dep?.focalPerson || u.name || "N/A"}\n`;
    if (dep?.designation) md += `- **Designation:** ${dep.designation}\n`;
    if (dep?.phone) md += `- **Phone:** ${dep.phone}\n`;
    if (dep?.email) md += `- **Department Email:** ${dep.email}\n`;
    md += `- **Login Email:** ${u.email}\n`;
    md += `- **Password:** ChangeMe123! (seed default)\n\n`;
  }

  md += "---\n\n*Generated from scripts/departmentLogins and database records.*\n";

  fs.writeFileSync("DEPARTMENT_LOGIN_CREDENTIALS.md", md, "utf8");
  console.log("DEPARTMENT_LOGIN_CREDENTIALS.md created");

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
