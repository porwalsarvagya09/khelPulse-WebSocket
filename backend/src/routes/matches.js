import { Router } from "express";
import { createMatchSchema, listMatchesQuerySchema } from "../validation/matches.js";
import { matches } from "../db/schema.js";
import { db } from "../db/db.js";
import { getMatchStatus } from "../utils/match-status.js";
import { desc } from "drizzle-orm";
import { createMatchLimiter } from "../middleware/rateLimiter.js";

import { authMiddleware } from "../middleware/auth.js";

export const matchRouter = Router();

const MAX_LIMIT = 100;

matchRouter.get('/', async(req, res, next) => {
    const parsed = listMatchesQuerySchema.safeParse(req.query);

    if(!parsed.success) {
        return res.status(400).json({ error: 'Invalid query.', details: parsed.error.issues });
    }

    const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT)

    try {
        const data = await db.select().from(matches).orderBy((desc(matches.createdAt))).limit(limit);
        res.json({ data });
    } catch (error) {
        next(error);
    }
})

matchRouter.post('/', authMiddleware, createMatchLimiter, async(req, res, next) => {
    const parsed = createMatchSchema.safeParse(req.body);
    
    if(!parsed.success) {
        return res.status(400).json({ error: 'Invalid payload.', details: parsed.error.issues });
    }
    
    const {data : { startTime, endTime, homeScore, awayScore }} = parsed;

    try {
        const [event] = await db.insert(matches).values({
            ...parsed.data,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            homeScore: homeScore ?? 0,
            awayScore: awayScore ?? 0,
            status: getMatchStatus(startTime, endTime)
        }).returning();

         if (res.app.locals.broadcastMatchCreated) {
            try {
                res.app.locals.broadcastMatchCreated(event);
            } catch (broadcastError) {
                console.error('broadcastMatchCreated failed', broadcastError);
            }
        }

        res.status(201).json({ data: event });
    } catch (e) {
        next(e);
    }
})