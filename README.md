# funpara

Function parameter library to ease development and testing. The library provides Date, Exit, Fetch and Timeout related functions that can be used without complicated spy/mock setups so that an application can easily be tested with function parameters.

## Installation

```sh
npm install --save @dreamit/funpara
```

TypeScript declarations are provided within the project.

## Short introduction to functions as parameters

Many functions use primitive types and objects as parameters to control the logic in the function. It is also possible to use functions as parameters. This way the you can decide how to work with the function from the parameter. For example the function can be forwarded to another function or the called at any point in the other function.

```typescript
/** *
 * This function has a primitive string as parameter. It is difficult to test because of the
 * "new Date()" often changing the value.
 */
function createLogMessage(message: string): string {
    return new Date().toISOString() + ':' + message
}

/** *
 * This function has a primitive string and an optional Date object as parameters.
 * This way the Date parameter does not need to be set in production use but can be set
 * in tests for better testing.
 * However, the Date object will contain the Date when the Date is created. For more complicated
 * use cases with multiple "new Date()" calls in the function or forwarding this is not useful.
 */
function createLogMessageWithDate(
    message: string,
    date: Date = new Date(),
): string {
    return date.toISOString() + ':' + message
}

/**
 * This function uses the funpara library. It has a primitive string and an optional DateFunction function parameter (i.e. a functions that returns a Date)
 * The "nowDateFunction" always returns "new Date()" so every time it is called it will create
 * the current Date.
 * If the DateFunction needs to be forwarded to another function without creating a new Date at
 * the time of the function call or something needs to be done before getting the current date
 * the function can be called at any time with "dateFunction()" to create the current Date.
 */
function createLogMessageWithDateFunction(
    message: string,
    dateFunction: DateFunction = nowDateFunction,
): string {
    // const doSomethingThatTakesLonger = someFunctionCall(dateFunction)
    return dateFunction().toISOString() + ':' + message
}
```

In **tests/index.test.ts** there are additional examples how the available code in **funpara** can be used.

## Available functionality

### Types

-   **DateFunction**: Type for a function that returns a Date.
-   **ExitFunction**: Type for a function that given an exit code does not return anything.
-   **FetchFunction**: Type for a fetch function that given an input (url, request, etc.) and request init returns a Promise<Response>
-   **TimeoutFunction**: Type for a function that given a TimerHandler, optional timeout and arguments returns the timeout ID as number.

### Core functions

The following core functions can be used to create a new function or create dynamic return values in the function.

-   **nowDateFunction**: Returns a DateFunction that returns the current date.
-   **fixedDateFunction**: Returns a DateFunction that returns a fixed date that matches the given date string.
-   **doNotExitFunction**: Exit function that does not exit the process but throws an error instead.
-   **fixedResponseFetchFunction**: Returns a FetchFunction that always returns a fixed response that matches the given body init and response init values.

### Fixed value functions

The following functions return a fix value. This can be helpful for testing code with different scenarios.

-   **testDateFunction**: DateFunction that returns a fixed test date '1001-01-01T00:00:00.000Z'
-   **badRequestFetchFunction**: FetchFunction that returns a fixed Response with and empty body and status 400 (Bad Request).
-   **notFoundFetchFunction**: FetchFunction that returns a fixed Response with and empty body and status 404 (Not Found).
-   **internalServerErrorFetchFunction**: FetchFunction that returns a fixed Response with and empty body and status 500 (Internal Server Error).
-   **brokenJSONFetchFunction**: FetchFunction that returns a fixed Response with broken JSON (missing bracket)
-   **unknownContentTypeFetchFunction**: FetchFunction that returns a fixed Response with an unknown Content-Type ('application/unknown')
-   **timeoutFetchFunction**: FetchFunction that returns a fixed Response that throws a Timeout error.
-   **aggregateErrorFetchFunction**: FetchFunction that returns a fixed Response with an AggregateError.
-   **graphQLIntrospectionDisabledFetchFunction**: FetchFunction that returns a fixed Response that GraphQL introspection is disabled.
-   **graphQLInvalidSchemaFetchFunction**: FetchFunction that returns a fixed Response with an invalid GraphQL schema.
-   **graphQLInvalidBodyFetchFunction**: FetchFunction that returns a fixed Response with an invalid GraphQL body.
-   **noCallbackTimeoutFunction**: TimeoutFunction that does not call the callback function but returns a fixed timeout ID 1.

## Contact

If you have questions or issues please visit our [Issue page](https://github.com/dreamit-de/funpara/issues)
and open a new issue if there are no fitting issues for your topic yet.

## License

funpara is under [MIT-License](./LICENSE).
