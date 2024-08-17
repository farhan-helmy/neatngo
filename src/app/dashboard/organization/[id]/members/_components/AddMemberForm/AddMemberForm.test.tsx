import React from "react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AddMemberForm } from "./AddMemberForm";
import { addMember } from "../../_lib/actions";
import { toast } from "sonner";

// Mock the required modules
vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "test-org-id" }),
}));

vi.mock("../../_lib/actions", () => ({
  addMember: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("AddMemberForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form correctly", () => {
    render(<AddMemberForm />);

    expect(screen.getByRole("button", { name: /New Member/i })).toBeDefined();
  });

  it("opens the dialog when the button is clicked", async () => {
    render(<AddMemberForm />);

    const newMemberButtons = screen.getAllByRole("button", {
      name: /New Member/i,
    });
    fireEvent.click(newMemberButtons[0]);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeDefined();
      expect(screen.getByText("Submit")).toBeDefined();
    });
  });

  it("submits the form with valid data", async () => {
    const mockAddMember = addMember as Mock;
    mockAddMember.mockResolvedValue({ data: "success" });

    render(<AddMemberForm />);

    const newMemberButtons = screen.getAllByRole("button", {
      name: /New Member/i,
    });
    fireEvent.click(newMemberButtons[0]);

    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText("Muhd Farhan"), {
        target: { value: "John Doe" },
      });
      fireEvent.change(screen.getByPlaceholderText("farhan@example.com"), {
        target: { value: "john@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("012345678"), {
        target: { value: "0123456789" },
      });
    });

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(mockAddMember).toHaveBeenCalledWith({
        fullName: "John Doe",
        email: "john@example.com",
        phone: "0123456789",
        organizationId: "test-org-id",
      });
      expect(toast.success).toHaveBeenCalledWith("Member added successfully");
    });
  });

  it("displays error messages for invalid form submission", async () => {
    render(<AddMemberForm />);

    const newMemberButtons = screen.getAllByRole("button", {
      name: /New Member/i,
    });
    fireEvent.click(newMemberButtons[0]);

    await waitFor(() => {
      fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    });

    await waitFor(() => {
      expect(screen.getByText("Full name is required")).toBeDefined();
      expect(screen.getByText("Email is not valid")).toBeDefined();
      expect(screen.getByText("Invalid")).toBeDefined();
    });
  });

  it("handles server error during form submission", async () => {
    const mockAddMember = addMember as Mock;
    mockAddMember.mockResolvedValue({ error: "Server error" });

    render(<AddMemberForm />);

    fireEvent.click(screen.getByRole("button", { name: /New Member/i }));

    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText("Muhd Farhan"), {
        target: { value: "John Doe" },
      });
      fireEvent.change(screen.getByPlaceholderText("farhan@example.com"), {
        target: { value: "john@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("012345678"), {
        target: { value: "0123456789" },
      });
    });

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Server error");
    });
  });

  it("displays error message for invalid phone number", async () => {
    render(<AddMemberForm />);

    const newMemberButtons = screen.getAllByRole("button", {
      name: /New Member/i,
    });
    fireEvent.click(newMemberButtons[0]);

    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText("Muhd Farhan"), {
        target: { value: "John Doe" },
      });
      fireEvent.change(screen.getByPlaceholderText("farhan@example.com"), {
        target: { value: "john@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("012345678"), {
        target: { value: "1234567890" },
      }); // Invalid Malaysian phone number
    });

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Phone number is not valid")).toBeDefined();
    });
  });

  it("accepts valid Malaysian phone number", async () => {
    const mockAddMember = addMember as Mock;
    mockAddMember.mockResolvedValue({ data: "success" });

    render(<AddMemberForm />);

    const newMemberButtons = screen.getAllByRole("button", {
      name: /New Member/i,
    });
    fireEvent.click(newMemberButtons[0]);

    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText("Muhd Farhan"), {
        target: { value: "John Doe" },
      });
      fireEvent.change(screen.getByPlaceholderText("farhan@example.com"), {
        target: { value: "john@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("012345678"), {
        target: { value: "0123456789" },
      }); // Valid Malaysian phone number
    });

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(mockAddMember).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Member added successfully");
    });
  });
});
