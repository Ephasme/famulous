export interface AggregateEvent<TEventName, TTopic, TPayload> {
    id: string
    name: TEventName
    topic: TTopic
    key: string
    createdAt: number
    payload: TPayload
}