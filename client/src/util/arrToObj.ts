const arrToObj = (arr: [string, any][]) => {
    return arr.reduce<{ [key: string]: any }>((res, [key, val]) => {
        res[key] = val
        return res
    }, [])
}

export default arrToObj