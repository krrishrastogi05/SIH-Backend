import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Database Seed...");

  // 1. CLEANUP (Optional: Remove if you want to keep old data)
  await prisma.beneficiaryScheme.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.scheme.deleteMany();
  await prisma.user.deleteMany();
  console.log("   Existing data cleared.");

  // 2. PASSWORD HASHING
  const password = await bcrypt.hash("123456", 10);

  // 3. CREATE OFFICER
  const officer = await prisma.user.create({
    data: {
      name: "Rajesh Officer",
      phone: "9999999999", // Officer Login
      password,
      role: "OFFICER",
    }
  });
  console.log(`   👮 Created Officer: ${officer.name} (Phone: 9999999999)`);

  // 4. CREATE BENEFICIARIES (Test Cases)

  // Case A: Eligible for "UP Student Scholarship"
  // (UP, Student, Low Income)
  await prisma.user.create({
    data: {
      name: "Rohan Kumar",
      phone: "9000000001",
      password,
      role: "BENEFICIARY",
      // Profile
      state: "Uttar Pradesh",
      district: "Lucknow",
      income: 45000,        // < 50k
      age: 20,
      occupation: "Student",
      education: "GRADUATION",
      gender: "MALE"
    }
  });

  // Case B: NOT Eligible due to Income
  // (UP, Student, but High Income)
  await prisma.user.create({
    data: {
      name: "Amit Singh",
      phone: "9000000002",
      password,
      role: "BENEFICIARY",
      state: "Uttar Pradesh",
      district: "Lucknow",
      income: 150000,       // > 50k (Too high)
      age: 22,
      occupation: "Student",
      education: "GRADUATION",
      gender: "MALE"
    }
  });

  // Case C: NOT Eligible due to Location
  // (Delhi, Low Income)
  await prisma.user.create({
    data: {
      name: "Sneha Sharma",
      phone: "9000000003",
      password,
      role: "BENEFICIARY",
      state: "Delhi",       // Wrong State
      district: "New Delhi",
      income: 30000,
      age: 19,
      occupation: "Student",
      education: "HIGHER_SECONDARY",
      gender: "FEMALE"
    }
  });

  console.log("   👤 Created 3 Test Beneficiaries (Password: 123456)");
  console.log("✅ Seeding Complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });