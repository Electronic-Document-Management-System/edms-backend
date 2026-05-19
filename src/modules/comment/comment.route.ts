import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requirePermission } from "../../middlewares/rbac.middleware";
import { deleteComment, updateComment } from "./comment.controller";

const router = Router();

router
    .route("/:id")
    .patch(requireAuth, requirePermission, updateComment)
    .delete(requireAuth, requirePermission, deleteComment);

export default router;
