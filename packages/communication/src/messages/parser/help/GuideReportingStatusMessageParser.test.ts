import { describe, expect, it } from 'vitest';
import { GuideReportingStatusMessageParser } from './GuideReportingStatusMessageParser';
import { PendingGuideTicketData } from './PendingGuideTicketData';

/** The smallest wrapper the parsers need: ints, booleans and strings in order. */
const wrapperOf = (values: (number | boolean | string)[]) =>
{
    const queue = [ ...values ];

    const take = () =>
    {
        if(!queue.length) throw new RangeError('offset is outside the bounds of the DataView');

        return queue.shift();
    };

    return {
        readInt: () => take() as number,
        readBoolean: () => take() as boolean,
        readString: () => take() as string
    } as any;
};

describe('GuideReportingStatusMessageParser', () =>
{
    it('reads nothing after a status that carries no ticket', () =>
    {
        const parser = new GuideReportingStatusMessageParser();

        expect(parser.parse(wrapperOf([ GuideReportingStatusMessageParser.GUIDE_REPORTING_STATUS_OK ]))).toBe(true);
        expect(parser.statusCode).toBe(GuideReportingStatusMessageParser.GUIDE_REPORTING_STATUS_OK);
        expect(parser.pendingTicket).toBeNull();
    });

    it('reads the ticket only when there is one', () =>
    {
        const parser = new GuideReportingStatusMessageParser();

        parser.parse(wrapperOf([
            GuideReportingStatusMessageParser.GUIDE_REPORTING_STATUS_PENDING_TICKET,
            PendingGuideTicketData.TYPE_BULLY_REPORT, 42, false, 'Bob', 'hd-1-1', 'he was rude'
        ]));

        expect(parser.pendingTicket?.otherPartyName).toBe('Bob');
        expect(parser.pendingTicket?.description).toBe('he was rude');
        expect(parser.pendingTicket?.roomName).toBeNull();
    });

    it('a guide looking at a room report is told nothing about the other party', () =>
    {
        const ticket = new PendingGuideTicketData(wrapperOf([ PendingGuideTicketData.TYPE_ROOM_REPORT, 7, true ]));

        expect(ticket.otherPartyName).toBeNull();
        expect(ticket.roomName).toBeNull();
    });

    it('a player looking at a room report is told which room it was', () =>
    {
        const ticket = new PendingGuideTicketData(
            wrapperOf([ PendingGuideTicketData.TYPE_ROOM_REPORT, 7, false, 'Bob', 'hd-1-1', 'The Lounge' ]));

        expect(ticket.roomName).toBe('The Lounge');
        expect(ticket.description).toBeNull();
    });

    it('a guide session carries only the other party', () =>
    {
        const ticket = new PendingGuideTicketData(
            wrapperOf([ PendingGuideTicketData.TYPE_GUIDE_SESSION, 7, true, 'Bob', 'hd-1-1' ]));

        expect(ticket.otherPartyFigure).toBe('hd-1-1');
        expect(ticket.description).toBeNull();
        expect(ticket.roomName).toBeNull();
    });
});
