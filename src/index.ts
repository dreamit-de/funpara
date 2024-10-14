/* eslint-disable @typescript-eslint/naming-convention */

// Date related types and functions

/**
 * Type for a function that returns a Date.
 */
export type DateFunction = () => Date

/**
 * Returns a DateFunction that returns the current date.
 * Can for example be used to get the current date when logging.
 * @returns DateFunction function returning the current data
 */
export function nowDateFunction(): DateFunction {
    return (): Date => new Date()
}

/**
 * Returns a DateFunction that returns a fixed date.
 * Can for example be used to get a fixed date for testing.
 * @param dateString fixed date string
 * @returns DateFunction function returning the fixed date
 */
export function fixedDateFunction(dateString: string): DateFunction {
    return (): Date => new Date(dateString)
}

/**
 * Test date
 * '1001-01-01T00:00:00.000Z'
 * as ISO Date string. Can be used to ease and unify testing.
 */
export const testDateString = '1001-01-01T00:00:00.000Z'

/**
 * DateFunction that returns the test date.
 * Can for example be used to always get the date when testing.
 */
export const testDateFunction: DateFunction = fixedDateFunction(testDateString)

// Fetch related types and functions

/**
 * Type for a fetch function that given an input (url, request, etc.) and request init
 * returns a Promise<Response>
 */
export type FetchFunction = (
    input: string | URL | Request,
    init?: RequestInit,
) => Promise<Response>

/**
 * Returns a FetchFunction that always returns a fixed response.
 * Can for example be used to get a fixed Response for testing.
 * @param bodyInit body for the response
 * @param init response init
 * @returns FetchFunction function returning the fixed Response
 */
export function fixedResponseFetchFunction(
    bodyInit?: BodyInit,
    init?: ResponseInit,
): FetchFunction {
    return (): Promise<Response> =>
        Promise.resolve(new Response(bodyInit, init))
}

/**
 * FetchFunction that returns a fixed Response with and empty body and status 400 (Bad Request).
 */
export const badRequestFetchFunction = fixedResponseFetchFunction(undefined, {
    status: 400,
})

/**
 * FetchFunction that returns a fixed Response with and empty body and status 404 (Not Found).
 */
export const notFoundFetchFunction: FetchFunction = fixedResponseFetchFunction(
    undefined,
    { status: 404 },
)

/**
 * FetchFunction that returns a fixed Response with and empty body and status 500 (Internal Server Error).
 */
export const internalServerErrorFetchFunction = fixedResponseFetchFunction(
    undefined,
    { status: 500 },
)

/**
 * FetchFunction that returns a fixed Response with broken JSON (missing bracket)
 */
export const brokenJSONFetchFunction: FetchFunction =
    fixedResponseFetchFunction('{"data": {"message": "Missing bracket"}', {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
    })

/**
 * FetchFunction that returns a fixed Response with an unknown
 * Content-Type ('application/unknown')
 */
export const unknownContentTypeFetchFunction: FetchFunction =
    fixedResponseFetchFunction(undefined, {
        headers: { 'Content-Type': 'application/unknown' },
        status: 200,
    })

/**
 * FetchFunction that returns a fixed Response that throws a Timeout error.
 */
export const timeoutFetchFunction: FetchFunction = (): Promise<Response> =>
    new Promise<Response>(() => {
        throw new Error('Connection failed ETIMEDOUT')
    })

/**
 * FetchFunction that returns a fixed Response with an AggregateError.
 */
export const aggregateErrorFetchFunction = fixedResponseFetchFunction(
    '{"errors":[{"message":"aaa The first error!, The second error!", "originalError": {"errors": [{"message":"The first error!"}, {"message":"The second error!"}  ] }  }]}',
    {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
    },
)

/**
 * FetchFunction that returns a fixed Response that GraphQL introspection is disabled.
 */
export const graphQLIntrospectionDisabledFetchFunction =
    fixedResponseFetchFunction(
        '{"errors": [ { "message": "Introspection is disabled"}],"data": null}',
        { status: 200 },
    )

/**
 * FetchFunction that returns a fixed Response with an invalid GraphQL schema.
 */
export const graphQLInvalidSchemaFetchFunction = fixedResponseFetchFunction(
    '{"data": {"__schema":"NotAGraphQLSchema", ' +
        '"_service": {"sdl":"NotAGraphQLSchema"}}}',
    { status: 200 },
)

/**
 * FetchFunction that returns a fixed Response with an invalid GraphQL body.
 */
export const graphQLInvalidBodyFetchFunction = fixedResponseFetchFunction(
    '{"message": "I am not GraphQL!"}',
    { status: 200 },
)

// Exit function related types and functions

/**
 * Type for a function that given an exit does not return anything.
 * @param {number} code The exit code to use
 * @returns {never} Does not return anything, may e.g. exit the process or throw an error
 */
export type ExitFunction = (code: number) => never

/**
 * Exit function that does not exit the process but throws an error instead
 * Can be used in testing to avoid the tests exiting the application.
 * @param {number} code The exit code to be thrown in the error
 * @returns {never} Does not return anything but throws an error with the message
 * "Exit function was called with code CODE" where CODE is the given code.
 */
export const doNotExitFunction: ExitFunction = (code: number): never => {
    throw new Error(`Exit function was called with code ${code}`)
}

// Timeout function related types and functions

/**
 * Type for a function that given a TimerHandler, optional timeout and arguments returns the timeout ID as number.
 * @param {TimerHandler} handler The TimerHandler to be called (i.e. in most cases a callback function)
 * @param {number} timeout The timeout in milliseconds
 * @param {any[]} timeoutArguments The arguments to be passed to the handler
 * @returns {number} The timeout ID as number
 */
export type TimeoutFunction = (
    handler: TimerHandler,
    timeout?: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...timeoutArguments: any[]
) => number

/**
 * TimeoutFunction that does not call the callback function but returns a fixed timeout ID 1.
 * Can be used in testing to avoid the tests waiting for the timeout to finish.
 * @returns {number} Fixed timeout ID 1
 */
export const noCallbackTimeoutFunction: TimeoutFunction = (): number => 1
