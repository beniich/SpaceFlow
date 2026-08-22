import mongoose, { Schema, Document } from 'mongoose';
import { Counter } from './Counter';

export type ComplaintStatus = 'nouvelle' | 'en cours' | 'résolue' | 'fermée' | 'rejetée';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export const SLA_DELAYS: Record<Priority, number> = {
    urgent: 4 * 60 * 60 * 1000,
    high:   24 * 60 * 60 * 1000,
    medium: 72 * 60 * 60 * 1000,
    low:    7 * 24 * 60 * 60 * 1000,
};

// ── Valid transitions (state machine) ──────────────────────────────────────
export const STATUS_TRANSITIONS: Record<ComplaintStatus, ComplaintStatus[]> = {
    'nouvelle':  ['en cours', 'rejetée'],
    'en cours':  ['résolue',  'rejetée'],
    'résolue':   ['fermée'],
    'fermée':    [],
    'rejetée':   [],
};

export function canTransition(from: ComplaintStatus, to: ComplaintStatus): boolean {
    return STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

// ── Sub-document interfaces ────────────────────────────────────────────────
export interface ITimelineEvent {
    eventType: 'created' | 'assigned' | 'status_changed' | 'commented' | 'resolved' | 'closed' | 'rejected' | 'priority_changed';
    message: string;
    actorId?: mongoose.Types.ObjectId;
    actorName?: string;
    oldValue?: string;
    newValue?: string;
    createdAt: Date;
}

export interface IComment {
    content: string;
    authorId?: mongoose.Types.ObjectId;
    authorName: string;
    isInternal: boolean;
    createdAt: Date;
}

export interface IComplaint extends Document {
    number: string;
    category: string;
    subcategory: string;
    priority: Priority;
    title: string;
    description: string;
    address: string;
    city: string;
    district: string;
    postalCode?: string;
    location?: { latitude: number; longitude: number };
    photos?: string[];
    documents?: { name: string; url: string }[];
    audioNote?: string;
    isAnonymous: boolean;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    status: ComplaintStatus;
    assignedTeamId?: mongoose.Types.ObjectId;
    technicianId?: mongoose.Types.ObjectId;
    assignedAt?: Date;
    slaDueDate?: Date;
    slaNotified?: boolean;   // true once the SLA-breach Kafka event was sent
    resolvedAt?: Date;
    closedAt?: Date;
    rejectedAt?: Date;
    resolutionTimeMs?: number;
    timeline: ITimelineEvent[];
    comments: IComment[];
    createdAt: Date;
    updatedAt: Date;
}

// ── Sub-schemas ────────────────────────────────────────────────────────────
const TimelineEventSchema = new Schema<ITimelineEvent>(
    {
        eventType: {
            type: String,
            enum: ['created', 'assigned', 'status_changed', 'commented', 'resolved', 'closed', 'rejected', 'priority_changed'],
            required: true,
        },
        message:   { type: String, required: true },
        actorId:   { type: Schema.Types.ObjectId },
        actorName: { type: String },
        oldValue:  { type: String },
        newValue:  { type: String },
        createdAt: { type: Date, default: Date.now },
    },
    { _id: true }
);

const CommentSchema = new Schema<IComment>(
    {
        content:    { type: String, required: true },
        authorId:   { type: Schema.Types.ObjectId },
        authorName: { type: String, required: true },
        isInternal: { type: Boolean, default: false },
        createdAt:  { type: Date, default: Date.now },
    },
    { _id: true }
);

// ── Main schema ────────────────────────────────────────────────────────────
const ComplaintSchema = new Schema<IComplaint>(
    {
        number:     { type: String, unique: true },
        category:   { type: String, required: true },
        subcategory:{ type: String, required: true },
        priority:   { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
        title:      { type: String, required: true },
        description:{ type: String, required: true },
        address:    { type: String, required: true },
        city:       { type: String, required: true },
        district:   { type: String, required: true },
        postalCode: { type: String },
        location:   { latitude: { type: Number }, longitude: { type: Number } },
        photos:     [{ type: String }],
        documents:  [{ name: String, url: String }],
        audioNote:  { type: String },
        isAnonymous:{ type: Boolean, default: false },
        firstName:  { type: String },
        lastName:   { type: String },
        email:      { type: String },
        phone:      { type: String },
        status: {
            type: String,
            enum: ['nouvelle', 'en cours', 'résolue', 'fermée', 'rejetée'],
            default: 'nouvelle',
        },
        assignedTeamId: { type: Schema.Types.ObjectId, ref: 'Team' },
        technicianId:   { type: Schema.Types.ObjectId, ref: 'User' },
        assignedAt:     { type: Date },
        slaDueDate:     { type: Date },
        slaNotified:    { type: Boolean, default: false },
        resolvedAt:     { type: Date },
        closedAt:       { type: Date },
        rejectedAt:     { type: Date },
        resolutionTimeMs: { type: Number },
        timeline: [TimelineEventSchema],
        comments:  [CommentSchema],
    },
    { timestamps: true }
);

// ── Indexes ────────────────────────────────────────────────────────────────
ComplaintSchema.index({ status: 1, createdAt: -1 });
ComplaintSchema.index({ priority: 1, createdAt: -1 });
ComplaintSchema.index({ category: 1 });
ComplaintSchema.index({ assignedTeamId: 1 });
ComplaintSchema.index({ slaDueDate: 1, status: 1, slaNotified: 1 }); // SLA worker
ComplaintSchema.index({ number: 1 });

// ── Pre-save hook ──────────────────────────────────────────────────────────
ComplaintSchema.pre<IComplaint>('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { name: 'complaint' },
                { $inc: { seq: 1 } },
                { upsert: true, new: true }
            );
            const year = new Date().getFullYear();
            this.number = `REC-${year}-${String(counter.seq).padStart(5, '0')}`;

            const delay = SLA_DELAYS[this.priority] ?? SLA_DELAYS.medium;
            this.slaDueDate = new Date(Date.now() + delay);

            this.timeline = [{
                eventType: 'created',
                message:   'Réclamation créée et enregistrée dans le système.',
                createdAt: new Date(),
            }];
        } catch (err) {
            return next(err as Error);
        }
    }
    next();
});

export const Complaint = mongoose.model<IComplaint>('Complaint', ComplaintSchema);
