import type { DateFunction, FetchFunction } from '@/index'
import {
    brokenJSONFetchFunction,
    fixedDateFunction,
    fixedResponseFetchFunction,
    notFoundFetchFunction,
    nowDateFunction,
    testDateFunction,
    testDateString,
    timeoutFetchFunction,
    unknownContentTypeFetchFunction,
} from '@/index'
import { expect, test } from 'vitest'

/**
 * Example Logger class to test the date functions.
 * The DateFunction is passed as an optional function parameter to the log
 * and prepareLogMessage functions in order to be able to set a custom DateFunction if necessary.
 */
class Logger {
    /**
     * Setting the default value to nowDateFunction will make it
     * easier to call the function without the caller providing a DateFunction argument
     */
    log(message: string, dateFunction: DateFunction = nowDateFunction()): void {
        console.log(this.prepareLogMessage(message, dateFunction))
    }

    /**
     * prepareLogMessage prepares the log message and returns it as a string.
     * This will make it easier to test the output without having to spy on
     * the console.log function.
     */
    prepareLogMessage(
        message: string,
        dateFunction: DateFunction = nowDateFunction(),
    ): string {
        return `${dateFunction().toISOString()} : ${message}`
    }
}

/**
 * Example async function to test the fetch functions.
 * This function tries to fetch user data from a server and returns a string with the user data.
 * By providing an optional function parameter fetchFunction that is set to global.fetch this
 * would try to fetch the user data from a server. In tests this function can be set to test
 * different scenarios like a successful fetch, a "not found" response or a timeout response.
 */
async function getUserById(
    id: string,
    fetchFunction: FetchFunction = global.fetch,
): Promise<string> {
    try {
        const userDataResponse = await fetchFunction(
            `https://localhost:3000/users/${id}`,
        )
        if (!userDataResponse.ok) {
            return 'User was not found'
        }
        return `User ${await userDataResponse.text()}`
    } catch (error) {
        return `Error: ${error}`
    }
}

/**
 * Second example async function to test the fetch functions (see above)
 * This function tries to work with JSON data so these scenarios can be tested.
 */
async function getJSONMessage(
    fetchFunction: FetchFunction = global.fetch,
): Promise<{ data: { message: string } }> {
    try {
        const messageResponse = await fetchFunction(
            'https://localhost:3000/message/',
        )
        if (!messageResponse.ok) {
            return { data: { message: 'Message error!' } }
        }

        if (
            messageResponse.headers.get('Content-Type') !== 'application/json'
        ) {
            return {
                data: {
                    message: 'Error: Content-Type is not application/json',
                },
            }
        }

        const message = await messageResponse.json()
        return message
    } catch (error) {
        return { data: { message: `Error: ${error}` } }
    }
}

test('Test date functions', () => {
    const logger = new Logger()

    // Test that the fixed date function returns the correct date
    expect(
        logger.prepareLogMessage(
            'I am a log message!',
            fixedDateFunction('2023-09-06T00:00:00Z'),
        ),
    ).toBe('2023-09-06T00:00:00.000Z : I am a log message!')

    // Test that the testDateFunction returns the test date
    expect(
        logger.prepareLogMessage('I am a log message!', testDateFunction),
    ).toBe(`${testDateString} : I am a log message!`)

    // Test that calling prepareLogMessage without a dateFunction argument does not run into an error
    expect(logger.prepareLogMessage('I am a log message!')).toContain(
        'I am a log message!',
    )
})

test('Test fetch functions', async () => {
    // Test that fixedResponseFetchFunction return the correct response
    expect(
        await getUserById(
            '1',
            fixedResponseFetchFunction('John Doe', { status: 200 }),
        ),
    ).toBe('User John Doe')

    // Test that notFoundFetchFunction is handled properly
    expect(await getUserById('1', notFoundFetchFunction)).toBe(
        'User was not found',
    )

    // Test that timeoutFetchFunction is handled properly
    expect(await getUserById('1', timeoutFetchFunction)).toBe(
        'Error: Error: Connection failed ETIMEDOUT',
    )

    // Test that fixedResponseFetchFunction with a JSON response return the correct response
    expect(
        await getJSONMessage(
            fixedResponseFetchFunction(
                '{"data": {"message": "Hello world!"}}',
                {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    headers: { 'Content-Type': 'application/json' },
                    status: 200,
                },
            ),
        ),
    ).toEqual({ data: { message: 'Hello world!' } })

    // Test that brokenJSONFetchFunction is handled properly
    expect(await getJSONMessage(brokenJSONFetchFunction)).toEqual({
        data: {
            message:
                "Error: SyntaxError: Expected ',' or '}' after property value in JSON at position 39",
        },
    })

    // Test that unknownContentTypeFetchFunction is handled properly
    expect(await getJSONMessage(unknownContentTypeFetchFunction)).toEqual({
        data: { message: 'Error: Content-Type is not application/json' },
    })
})
