import { NextFunction, Request, Response } from 'express';
import { AuditAction } from '@prisma/client';
import { buildAuditMetadata, createAuditLogService } from '@/modules/audit/audit.service';

const extractResourceId = (req: Request): number | null => {
  const id =
    req.params.documentId ||
    req.params.userId ||
    req.params.roleId ||
    req.params.permissionId ||
    req.params.folderId ||
    req.params.departmentId ||
    req.params.id;

  const parsed = Number(id);
  return isNaN(parsed) ? null : parsed;
};

export const auditLog = (action: AuditAction, resource: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    const userId = Number(req.user?.id);
    const metadata = buildAuditMetadata(req);
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    const originalJSON = res.json.bind(res);
    res.json = (body: any) => {
      
      const result = originalJSON(body);

      const responseData = body?.data;
      const resourceId =
        responseData?.document?.id ||
        responseData?.folder?.id ||
        responseData?.department?.id ||
        responseData?.role?.id ||
        responseData?.user?.id ||
        responseData?.version?.id ||
        extractResourceId(req) ||
        null;

      setImmediate(() => {

        if (!userId || isNaN(userId)) return;

        createAuditLogService({
          action,
          resource,
          resourceId,
          userId,
          metadata,
          ipAddress,
          userAgent,
        });
      });

      return result;
    }
    next();

  };