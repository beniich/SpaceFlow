-- Migration: Créer la séquence pour les références de tickets
-- Requis par ticket.controller.js -> generateReference()

CREATE SEQUENCE IF NOT EXISTS ticket_reference_seq START 1;
