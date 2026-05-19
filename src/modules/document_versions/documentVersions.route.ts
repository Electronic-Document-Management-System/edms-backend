import { Router } from "express";

const router = Router()

/** location documents.route.ts
GET    /api/documents/:id/versions
GET    /api/documents/:id/versions/:versionId
POST   /api/documents/:id/versions
PATCH  /api/documents/:id/versions/:versionId/restore
 */

export default router;
