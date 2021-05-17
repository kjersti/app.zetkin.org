import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import deleteEventResponse from '../fetching/deleteEventResponse';
import getEventResponses from '../fetching/getEventResponses';
import getRespondEvents from '../fetching/getRespondEvents';
import putEventResponse from '../fetching/putEventResponse';
import { ZetkinEvent, ZetkinEventResponse, ZetkinUser } from '../types/zetkin';

export const UserContext = React.createContext<ZetkinUser | null>(null);

export const useUser = () : ZetkinUser | null => {
    return React.useContext(UserContext);
};

type OnSignup = (eventId : number, orgId : number) => void;
type OnUndoSignup = (eventId : number, orgId : number) => void;

type EventResponses = {
    eventResponses: ZetkinEventResponse[] | undefined;
    onSignup: OnSignup;
    onUndoSignup: OnUndoSignup;
}

export const useEventResponses = () : EventResponses => {
    const responseQuery = useQuery('eventResponses', getEventResponses());
    const eventResponses = responseQuery.data;

    const queryClient = useQueryClient();

    const removeFunc = useMutation(deleteEventResponse, {
        onSettled: () => {
            queryClient.invalidateQueries('eventResponses');
        },
    });

    const addFunc = useMutation(putEventResponse, {
        onSettled: () => {
            queryClient.invalidateQueries('eventResponses');
        },
    });

    function onSignup (eventId : number, orgId : number) {
        addFunc.mutate({ eventId, orgId });
    }

    function onUndoSignup (eventId : number, orgId : number) {
        removeFunc.mutate({ eventId, orgId });
    }

    return { eventResponses, onSignup, onUndoSignup };
};

type RespondEvents = {
    onUndoSignup: OnUndoSignup;
    respondEvents: ZetkinEvent[] | undefined;
}

export const useRespondEvents = () : RespondEvents => {
    const respondEventsQuery = useQuery('respondEvents', getRespondEvents());
    const respondEvents = respondEventsQuery.data;

    const queryClient = useQueryClient();

    const removeFunc = useMutation(deleteEventResponse, {
        onSettled: () => {
            queryClient.invalidateQueries('respondEvents');
        },
    });

    function onUndoSignup (eventId : number, orgId : number) {
        removeFunc.mutate({ eventId, orgId });
    }

    return { onUndoSignup, respondEvents };
};