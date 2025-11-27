export const DATA_GRID_ROW_HEIGHT = 56;
export const DATA_GRID_ROW_HEIGHT_SMALL = 64;
export const DATA_GRID_ROW_HEIGHT_TABLET = 60;
export const DATA_GRID_HEADER_HEIGHT = 56;
export const DATA_GRID_HEADER_HEIGHT_COMPACT = 52;
export const DATA_GRID_FOOTER_HEIGHT = 52;
export const DATA_GRID_MIN_HEIGHT = 360;

export type DialogType =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "reset"
  | "resendVerification";

export const DIALOG_TYPES: Record<
  DialogType,
  { title: string; subtitle: string }
> = {
  view: {
    title: "View User",
    subtitle: "Review account information and access history.",
  },
  create: {
    title: "Create New User",
    subtitle: "Configure profile details and access permissions.",
  },
  edit: {
    title: "Edit User",
    subtitle: "Update personal information or adjust their role.",
  },
  delete: {
    title: "Delete User",
    subtitle: "Double-check before removing this account permanently.",
  },
  reset: {
    title: "Reset Password",
    subtitle: "Send the user a secure password reset link via email.",
  },
  resendVerification: {
    title: "Resend Verification",
    subtitle:
      "Send another verification email so the user can activate their account.",
  },
};
