const btr = {
    /**Array */
    A: {
        asFormattedList: (arr) => {
            let x = '';
            while (arr.length) {
                switch (arr.length) {
                    case 2:
                        x += `${arr[0]} and `;
                        break;
                    default:
                        x += `${arr[0]}, `;
                        break;
                    case 1:
                        x += `${arr[0]}`;
                        break;
                }
                arr.splice(0, 1);
            }
            return x;
        },
        getRandom: (arr) => { const r = btr.N.roll(arr.length); return { item: arr[r], index: r }; },
        lastItem: (arr) => arr[arr.length - 1],
        selfFilter: (arr, predicate) => {
            const ogLength = arr.length;
            for (let i = 0; i < arr.length; i++) {
                if (!predicate(arr[i])) {
                    arr.splice(i, 1);
                    i--;
                }
            }
            return { removedCount: ogLength - arr.length };
        },
        sortBy: (arr, key, direction) => {
            if (!arr.length) {
                return arr;
            }
            arr.sort((a, b) => (a[key] > b[key]) ? 1 : -1);
            //if (typeof arr[0][key] === 'string') { arr.reverse() }
            if (direction === 'D') {
                arr.reverse();
            }
            return arr;
        },
        spliceIf: (arr, predicate) => {
            const matches = arr.filter(predicate);
            btr.A.selfFilter(arr, x => !matches.includes(x));
            return matches;
        },
        spliceLast: (arr, count) => arr.splice(-count),
        shuffle: (arr) => {
            for (let i = arr.length - 1; i > 0; i--) {
                const rand = btr.N.roll(i + 1);
                [arr[i], arr[rand]] = [arr[rand], arr[i]];
            }
            return arr;
        },
        uniqueItems: (arr) => arr.flat().reduce((acc, item) => {
            if (!acc.includes(item)) {
                acc.push(item);
            }
            return acc;
        }, []),
    },
    /**Function */
    F: {
        try: async (fn, ...args) => {
            /**Ping me on discord with the stack of the error */
            const divineError = (x) => {
                const error = x.replace(/.{0,}\(rejection id: 1\)\n.{0,}non-zero exit code./, '');
                const theMessage = `<@&847748750524678155> - (${btr.U.app}) \n ${error}`;
                const divineOptions = { content: theMessage, allowedMentions: { everyone: true, roles: true } };
                btr.U.divine.createMessage('855951771841986572', divineOptions);
            };
            const getIsAsync = (fn) => {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                const AsyncFunction = (async () => { }).constructor;
                return fn instanceof AsyncFunction === true;
            };
            const isAsync = getIsAsync(fn);
            if (!isAsync) {
                try {
                    return fn.apply(fn, args);
                }
                catch (err) {
                    divineError(err.stack);
                }
            }
            else {
                try {
                    return await fn.apply(fn, args);
                }
                catch (err) {
                    divineError(err.stack);
                }
            }
        }
    },
    /**Numbers */
    N: {
        /**Promise-based delay that breaks down the limit for setTimeOut*/
        delay: (x) => new Promise(resolve => {
            const interval = (i, miliseconds) => {
                setTimeout(() => { if (i) {
                    interval(i - 1, maxTimeOut);
                }
                else {
                    resolve(true);
                } }, miliseconds);
            };
            const maxTimeOut = 1000 * 60 * 60 * 24;
            const loopsNeeded = Math.floor(x / maxTimeOut);
            const leftOverTime = x % maxTimeOut;
            interval(loopsNeeded, leftOverTime);
        }),
        idOdd: (number) => Boolean(Number(number) % 2),
        isWithinRange: (number, max, min) => number <= max && number >= min,
        roll: (maxRoll) => Math.floor(Math.random() * Number(maxRoll)),
        toOrdinal: (number) => {
            const asString = String(number);
            const lastDigit = asString[asString.length - 1];
            if ([11, 12, 13].includes(Number(number))) {
                return `${number}th`;
            }
            switch (lastDigit) {
                case '1': return `${number}st`;
                case '2': return `${number}nd`;
                case '3': return `${number}rd`;
                default: return `${number}th`;
            }
        }
    },
    /**String */
    S: {
        isGuest: (username) => /Guest[0-9]{13}/.test(`${username}`),
        toSingleLine: (sentence) => `${sentence}`.replace(/ {0,}\n {0,}/g, ' '),
    },
    U: { divine: null, app: null, }
};
//tsc --target esnext index.ts
export { btr as BTR };
