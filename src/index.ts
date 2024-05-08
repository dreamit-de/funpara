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
 * FetchFunction that returns a fixed Response with and empty body and status 404 (Not Found).
 */
export const notFoundFetchFunction: FetchFunction = fixedResponseFetchFunction(
    undefined,
    { status: 404 },
)

/**
 * FetchFunction that returns a fixed Response with  broken JSON (missing bracket) 
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
