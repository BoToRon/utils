

const btr = {

    /**ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS */
    /**ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS */
    /**ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS ARRAYS */
    getLastItem: <T>(arr: T[]) => arr[arr.length - 1],
    getRandomItem: <T>(arr: T[]) => { const r = btr.roll(arr.length); return { item: arr[r], index: r } },
    spliceLast: <T>(arr: T[], count: number) => arr.splice(-count),

    asFormattedList: <T>(arr: T[]) => {
        let x = ''
        while (arr.length) {
            switch (arr.length) {
                case 2: x += `${arr[0]} and `; break
                default: x += `${arr[0]}, `; break
                case 1: x += `${arr[0]}`; break
            }
            arr.splice(0, 1)
        }
        return x
    },

    getUniqueItems: <T>(arr: T[][]) => arr.flat().reduce((acc, item) => {
        if (!acc.includes(item)) { acc.push(item) }
        return acc
    }, [] as T[]),

    selfFilter: <T>(arr: T[], predicate: (arg1: T) => boolean) => {
        const ogLength = arr.length
        for (let i = 0; i < arr.length; i++) { if (!predicate(arr[i])) { arr.splice(i, 1); i-- } }
        return { removedCount: ogLength - arr.length }
    },

    shuffle: <T>(arr: T[]) => {
        for (let i = arr.length - 1; i > 0; i--) {
            const rand = btr.roll(i + 1);
            [arr[i], arr[rand]] = [arr[rand], arr[i]]
        }
        return arr
    },

    sortBy: <T>(arr: T[], key: keyof T, direction: 'A' | 'D') => {
        if (!arr.length) { return arr }
        if (typeof arr[0] === 'string') { arr.sort((a, b) => (a > b) ? 1 : -1) }
        else { arr.sort((a, b) => (a[key] > b[key]) ? 1 : -1) }
        if (direction === 'D') { arr.reverse() }
        return arr
    },

    spliceIf: <T>(arr: T[], predicate: (arg1: T) => boolean) => {
        const matches = arr.filter(predicate)
        btr.selfFilter(arr, x => !matches.includes(x))
        return matches
    },

    /**NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS */
    /**NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS */
    /**NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS NUMBERS */
    /**Promise-based delay that breaks down the limit for setTimeOut*/
    delay: (x: number) => new Promise(resolve => {

        const interval = (i: number, miliseconds: number) => {
            setTimeout(() => { if (i) { interval(i - 1, maxTimeOut) } else { resolve(true) } }, miliseconds)
        }

        const maxTimeOut = 1000 * 60 * 60 * 24
        const loopsNeeded = Math.floor(x / maxTimeOut)
        const leftOverTime = x % maxTimeOut
        interval(loopsNeeded, leftOverTime)
    }),
    idOdd: (number: number) => Boolean(Number(number) % 2),
    isWithinRange: (number: number, max: number, min: number) => number <= max && number >= min,
    roll: (maxRoll: number) => Math.floor(Math.random() * Number(maxRoll)),
    toOrdinal: (number: number) => {
        const asString = String(number)
        const lastDigit = asString[asString.length - 1]
        if ([11, 12, 13].includes(Number(number))) { return `${number}th` }

        switch (lastDigit) {
            case '1': return `${number}st`
            case '2': return `${number}nd`
            case '3': return `${number}rd`
            default: return `${number}th`
        }
    },

    /**STRINGS STRINGS STRINGS STRINGS STRINGS STRINGS STRINGS STRINGS STRINGS STRINGS STRINGS STRINGS */
    isGuest: (username: string) => /Guest[0-9]{13}/.test(`${username}`),
    toSingleLine: (sentence: string) => `${sentence}`.replace(/ {0,}\n {0,}/g, ' '),

    /**Wrapper for functions */
    try: async (fn: (...args: unknown[]) => Promise<unknown>, ...args: unknown[]) => {

        /**Ping me on discord with the stack of the error */
        const divineError = (x: Error['stack']) => {
            const error = x.replace(/.{0,}\(rejection id: 1\)\{0,}non-zero exit code./, '')
            const theMessage = `<@&847748750524678155> - (${btr['?'].title}) \n ${error}`
            const divineOptions = { content: theMessage, allowedMentions: { everyone: true, roles: true } }
            btr['?'].divine.createMessage('855951771841986572', divineOptions)
        }

        const getIsAsync = (fn: unknown): boolean => {
            const AsyncFunction = (async () => { }).constructor
            return fn instanceof AsyncFunction === true
        }

        const isAsync = getIsAsync(fn)
        if (!isAsync) { try { return fn.apply(fn, args) } catch (err) { divineError(err.stack) } }
        else { try { return await fn.apply(fn, args) } catch (err) { divineError(err.stack) } }
    },

    '?': { divine: null as any, title: null as string, }
}

//tsc --target esnext index.ts
/**
    git add .
    git commit -m 'a'
    git push
 */
export { btr as BTR }