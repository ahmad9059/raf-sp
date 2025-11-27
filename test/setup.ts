import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock NextAuth
class MockAuthError extends Error {
  type: string;
  constructor(message: string, type: string = "AuthError") {
    super(message);
    this.name = "AuthError";
    this.type = type;
  }
}

vi.mock("next-auth", () => ({
  default: vi.fn(),
  AuthError: MockAuthError,
}));

// Mock auth module
vi.mock("@/auth", () => ({
  auth: vi.fn(),
  signIn: vi.fn(),
  AuthError: MockAuthError,
}));

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({
    data: null,
    status: "unauthenticated",
  })),
  signIn: vi.fn(),
  signOut: vi.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

// Mock Prisma client
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    equipment: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
    department: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    maintenanceLog: {
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      aggregate: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

// Mock Supabase
vi.mock("@/lib/supabase", () => ({
  supabase: {
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        getPublicUrl: vi.fn(() => ({
          data: { publicUrl: "https://example.com/image.jpg" },
        })),
      })),
    },
  },
}));

// Mock file parsing
vi.mock("@/lib/file-parser", () => ({
  parseCSVFile: vi.fn(),
  parsePDFFile: vi.fn(),
}));

// Mock Next.js revalidatePath
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));
