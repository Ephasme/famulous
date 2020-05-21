
export type AggregateInfo = {
        id: string
        name: string
}

export default interface IEvent<TEventName> {
    id: string
    name: TEventName
    aggregate: AggregateInfo
}