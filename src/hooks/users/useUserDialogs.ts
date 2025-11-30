import { useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import {
  createUser,
  updateUser,
  deleteUser,
  adminResetPassword,
  resendVerificationEmail,
  fetchUsers,
} from "../../store/userSlice";
import type { CreateUserRequest, UpdateUserRequest } from "../../models/user";
import type { DialogType } from "../../constants/userConstants";
import { resolveApiMessage } from "../../utilities/messageUtils";

export interface UseUserDialogsReturn {
  dialogOpen: boolean;
  dialogType: DialogType;
  selectedUser: any;
  formData: CreateUserRequest | UpdateUserRequest;
  initialFormData: CreateUserRequest | UpdateUserRequest;
  isFormValid: boolean;
  hasChanges: boolean;
  dialogHeaderStyles: any;
  selectedUserDetails: any[];
  loadingCreate: boolean;
  loadingEdit: boolean;
  loadingDelete: boolean;
  loadingReset: boolean;
  loadingResend: boolean;
  handleView: (user: any) => void;
  handleCreate: () => void;
  handleEdit: (user: any) => void;
  handleDelete: (user: any) => void;
  handlePasswordReset: (user: any) => void;
  handleResendVerification: (user: any) => void;
  handleDialogClose: () => void;
  handleFormSubmit: () => Promise<void>;
  setFormData: (data: CreateUserRequest | UpdateUserRequest) => void;
  setSnackbar: (snackbar: {
    open: boolean;
    message: string;
    severity: "success" | "error";
  }) => void;
}

export const useUserDialogs = (
  setSnackbar: (snackbar: {
    open: boolean;
    message: string;
    severity: "success" | "error";
  }) => void,
  onSuccess?: () => void
): UseUserDialogsReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>("view");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState<
    CreateUserRequest | UpdateUserRequest
  >({} as CreateUserRequest | UpdateUserRequest);
  const [initialFormData, setInitialFormData] = useState<
    CreateUserRequest | UpdateUserRequest
  >({} as CreateUserRequest | UpdateUserRequest);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const blurActiveElement = useCallback(() => {
    if (typeof document === "undefined") {
      return;
    }
    const activeElement = document.activeElement as HTMLElement | null;
    if (activeElement && typeof activeElement.blur === "function") {
      activeElement.blur();
    }
  }, []);

  const firstNameError = useMemo(() => {
    return formData.firstName?.trim() ? "" : "First name is required";
  }, [formData.firstName]);

  const lastNameError = useMemo(() => {
    return formData.lastName?.trim() ? "" : "Last name is required";
  }, [formData.lastName]);

  const emailError = useMemo(() => {
    if (!formData.email?.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(formData.email) ? "" : "Invalid email format";
  }, [formData.email]);

  const isFormValid = useMemo(() => {
    if (dialogType === "create" || dialogType === "edit") {
      return !firstNameError && !lastNameError && !emailError;
    }
    return true;
  }, [dialogType, firstNameError, lastNameError, emailError]);

  const hasChanges = useMemo(() => {
    if (dialogType === "create") return true;
    if (dialogType === "edit") {
      return (
        initialFormData.firstName !== formData.firstName ||
        initialFormData.lastName !== formData.lastName ||
        initialFormData.username !== formData.username ||
        initialFormData.email !== formData.email ||
        initialFormData.companyName !== formData.companyName ||
        initialFormData.roleId !== formData.roleId ||
        ("isActive" in initialFormData &&
          "isActive" in formData &&
          initialFormData.isActive !== formData.isActive)
      );
    }
    return false;
  }, [dialogType, initialFormData, formData]);

  const dialogHeaderStyles = useMemo(() => {
    switch (dialogType) {
      case "delete":
        return {
          background: `linear-gradient(135deg, #f44336 0%, #d32f2f 100%)`,
        };
      case "reset":
        return {
          background: `linear-gradient(135deg, #2196f3 0%, #1976d2 100%)`,
        };
      default:
        return {
          background: `linear-gradient(135deg, #3f51b5 0%, #303f9f 100%)`,
        };
    }
  }, [dialogType]);

  const selectedUserDetails = useMemo(
    () =>
      selectedUser
        ? [
            { label: "First Name", value: selectedUser.firstName },
            { label: "Last Name", value: selectedUser.lastName },
            { label: "Username", value: selectedUser.username },
            { label: "Email", value: selectedUser.email },
            {
              label: "Company",
              value: selectedUser.companyName || "Not provided",
            },
            { label: "Role", value: selectedUser.roleName || "N/A" },
            {
              label: "Status",
              value: selectedUser.isVerified ? "Verified" : "Unverified",
            },
            {
              label: "Active",
              value: selectedUser.isActive ? "Active" : "Inactive",
            },
            {
              label: "Created At",
              value: new Date(selectedUser.createdAt).toLocaleString(),
            },
            {
              label: "Updated At",
              value: selectedUser.updatedAt
                ? new Date(selectedUser.updatedAt).toLocaleString()
                : "N/A",
            },
          ]
        : [],
    [selectedUser]
  );

  const handleView = useCallback(
    (user: any) => {
      blurActiveElement();
      setSelectedUser(user);
      setDialogType("view");
      setDialogOpen(true);
    },
    [blurActiveElement]
  );

  const handleCreate = useCallback(() => {
    blurActiveElement();
    setFormData({
      firstName: "",
      lastName: "",
      companyName: "",
      username: "",
      email: "",
      roleId: 2,
    });
    setDialogType("create");
    setDialogOpen(true);
  }, [blurActiveElement]);

  const handleEdit = useCallback(
    (user: any) => {
      blurActiveElement();
      setSelectedUser(user);
      const data = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        isActive: user.isActive,
        roleId: user.roleId,
      };
      setFormData(data);
      setInitialFormData(data);
      setDialogType("edit");
      setDialogOpen(true);
    },
    [blurActiveElement]
  );

  const handleDelete = useCallback(
    (user: any) => {
      blurActiveElement();
      setSelectedUser(user);
      setDialogType("delete");
      setDialogOpen(true);
    },
    [blurActiveElement]
  );

  const handlePasswordReset = useCallback(
    (user: any) => {
      blurActiveElement();
      setSelectedUser(user);
      setDialogType("reset");
      setDialogOpen(true);
    },
    [blurActiveElement]
  );

  const handleResendVerification = useCallback(
    (user: any) => {
      blurActiveElement();
      setSelectedUser(user);
      setDialogType("resendVerification");
      setDialogOpen(true);
    },
    [blurActiveElement]
  );

  const handleDialogClose = useCallback(() => {
    blurActiveElement();
    setDialogOpen(false);
    setSelectedUser(null);
    // Reset to empty object, but cast to satisfy TypeScript
    setFormData({} as CreateUserRequest | UpdateUserRequest);
    setInitialFormData({} as CreateUserRequest | UpdateUserRequest);
  }, [blurActiveElement]);

  const handleFormSubmit = useCallback(async () => {
    if (dialogType === "create") {
      setLoadingCreate(true);
      try {
        if (!isFormValid) {
          setSnackbar({
            open: true,
            message:
              "Please resolve the highlighted validation errors before creating the user.",
            severity: "error",
          });
          return;
        }
        const result = await dispatch(
          createUser(formData as CreateUserRequest)
        ).unwrap();
        setSnackbar({
          open: true,
          message: resolveApiMessage(
            result,
            "User created successfully. A set-password email has been sent to the user's email address."
          ),
          severity: "success",
        });
        dispatch(fetchUsers());
        onSuccess?.();
        handleDialogClose();
      } catch (err: any) {
        const errorMessage = resolveApiMessage(
          err,
          "Failed to create user. Please try again."
        );
        setSnackbar({ open: true, message: errorMessage, severity: "error" });
      } finally {
        setLoadingCreate(false);
      }
      return;
    }
    if (dialogType === "edit" && selectedUser) {
      setLoadingEdit(true);
      try {
        if (!isFormValid) {
          setSnackbar({
            open: true,
            message:
              "Please resolve the highlighted validation errors before saving changes.",
            severity: "error",
          });
          return;
        }
        await dispatch(updateUser(formData as UpdateUserRequest)).unwrap();
        setSnackbar({
          open: true,
          message: "User updated successfully.",
          severity: "success",
        });
        dispatch(fetchUsers());
        onSuccess?.();
        handleDialogClose();
      } catch (err: any) {
        const errorMessage =
          err?.message || "Failed to update user. Please try again.";
        setSnackbar({ open: true, message: errorMessage, severity: "error" });
      } finally {
        setLoadingEdit(false);
      }
      return;
    }
    if (dialogType === "delete" && selectedUser) {
      setLoadingDelete(true);
      try {
        const result = await dispatch(deleteUser(selectedUser.id)).unwrap();
        setSnackbar({
          open: true,
          message: result.message || "User deleted successfully.",
          severity: "success",
        });
        dispatch(fetchUsers());
        onSuccess?.();
        handleDialogClose();
      } catch (err: any) {
        const errorMessage = err?.message || "Failed to delete user.";
        setSnackbar({ open: true, message: errorMessage, severity: "error" });
      } finally {
        setLoadingDelete(false);
      }
    }
    if (dialogType === "reset" && selectedUser) {
      setLoadingReset(true);
      try {
        const result = await dispatch(
          adminResetPassword(selectedUser.id)
        ).unwrap();
        setSnackbar({
          open: true,
          message:
            (result as any)?.message ||
            "Password reset email sent successfully.",
          severity: "success",
        });
        dispatch(fetchUsers());
        onSuccess?.();
        handleDialogClose();
      } catch (err: any) {
        const errorMessage = err?.message || "Failed to send reset email.";
        setSnackbar({ open: true, message: errorMessage, severity: "error" });
      } finally {
        setLoadingReset(false);
      }
    }
    if (dialogType === "resendVerification" && selectedUser) {
      setLoadingResend(true);
      try {
        const result = await dispatch(
          resendVerificationEmail(selectedUser.id)
        ).unwrap();
        setSnackbar({
          open: true,
          message:
            (result as any)?.message ||
            "Verification email resent successfully.",
          severity: "success",
        });
        onSuccess?.();
        handleDialogClose();
      } catch (err: any) {
        const errorMessage =
          err?.message || "Failed to resend verification email.";
        setSnackbar({ open: true, message: errorMessage, severity: "error" });
      } finally {
        setLoadingResend(false);
      }
    }
  }, [
    dialogType,
    isFormValid,
    formData,
    selectedUser,
    dispatch,
    setSnackbar,
    handleDialogClose,
    onSuccess,
  ]);

  return {
    dialogOpen,
    dialogType,
    selectedUser,
    formData,
    initialFormData,
    isFormValid,
    hasChanges,
    dialogHeaderStyles,
    selectedUserDetails,
    loadingCreate,
    loadingEdit,
    loadingDelete,
    loadingReset,
    loadingResend,
    handleView,
    handleCreate,
    handleEdit,
    handleDelete,
    handlePasswordReset,
    handleResendVerification,
    handleDialogClose,
    handleFormSubmit,
    setFormData,
    setSnackbar,
  };
};
