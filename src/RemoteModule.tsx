import React from 'react';

import { DuplexConnector } from '@osnova/events';
import { RequestEvent } from '@osnova/events/EventRequest';
import { AnyResponseEventMap } from '@osnova/events/EventResponse';

import { RemoteComponent, RemoteComponentProps } from './RemoteComponent';

export interface FederatedSystemParams<
  OutReqEvents extends RequestEvent,
  InReqEvents extends RequestEvent,
  OutResponseEventMap extends AnyResponseEventMap,
  InResponseEventMap extends AnyResponseEventMap
> {
  onBoot(
    system: Pick<
      DuplexConnector<OutReqEvents, InReqEvents, OutResponseEventMap, InResponseEventMap>,
      'request' | 'response'
    >
  ): void;
}

export interface RemoteModuleProps<
  OutReqEvents extends RequestEvent,
  InReqEvents extends RequestEvent,
  OutResponseEventMap extends AnyResponseEventMap,
  InResponseEventMap extends AnyResponseEventMap
> extends RemoteComponentProps<
    FederatedSystemParams<OutReqEvents, InReqEvents, OutResponseEventMap, InResponseEventMap>
  > {}

export function RemoteModule<
  OutReqEvents extends RequestEvent,
  InReqEvents extends RequestEvent,
  OutResponseEventMap extends AnyResponseEventMap,
  InResponseEventMap extends AnyResponseEventMap
>(props: RemoteModuleProps<OutReqEvents, InReqEvents, OutResponseEventMap, InResponseEventMap>) {
  return (
    <RemoteComponent<RemoteModuleProps<OutReqEvents, InReqEvents, OutResponseEventMap, InResponseEventMap>>
      {...props}
    />
  );
}
