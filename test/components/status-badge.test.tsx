import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/ui/status-badge";

describe("StatusBadge", () => {
  it("renders Available status correctly", () => {
    render(<StatusBadge status="AVAILABLE" />);
    expect(screen.getByText("Available")).toBeInTheDocument();
  });

  it("renders In Use status correctly", () => {
    render(<StatusBadge status="IN_USE" />);
    expect(screen.getByText("In Use")).toBeInTheDocument();
  });

  it("renders Needs Repair status correctly", () => {
    render(<StatusBadge status="NEEDS_REPAIR" />);
    expect(screen.getByText("Needs Repair")).toBeInTheDocument();
  });

  it("renders Discarded status correctly", () => {
    render(<StatusBadge status="DISCARDED" />);
    expect(screen.getByText("Discarded")).toBeInTheDocument();
  });

  it("applies correct CSS classes for Available status", () => {
    render(<StatusBadge status="AVAILABLE" />);
    const badge = screen.getByText("Available");
    expect(badge).toHaveClass("bg-green-100", "text-green-800");
  });

  it("applies correct CSS classes for Needs Repair status", () => {
    render(<StatusBadge status="NEEDS_REPAIR" />);
    const badge = screen.getByText("Needs Repair");
    expect(badge).toHaveClass("bg-yellow-100", "text-yellow-800");
  });
});
