import { Response } from 'express';

const clients = new Map<number, Response[]>();

export const registerSseClient = (userId: number, res: Response) => {
    const existing = clients.get(userId) || [];
    clients.set(userId, [...existing, res]);
};

export const removeSseClient = (userId: number, res: Response) => {
    const existing = clients.get(userId) || [];
    clients.set(userId, existing.filter((client) => client !== res));
};

export const sendSseEventToUser = (userId: number, data: unknown) => {
    const userClients = clients.get(userId);
    if (!userClients || userClients.length === 0) return;

    const payload = `data: ${JSON.stringify(data)}\n\n`;
    userClients.forEach((res) => res.write(payload));
};