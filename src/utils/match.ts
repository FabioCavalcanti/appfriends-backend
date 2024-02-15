export const encryptMatch = (id:number) => {
    return `${process.env.DEFAULT_TOKEN}${id}${process.env.DEFAULT_TOKEN}`
}

export const decrypMatch = (match: string) =>{
    let idString: string = match
    .replace(`${process.env.DEFAULT_TOKEN}`,'')
    .replace(`${process.env.DEFAULT_TOKEN}`,'')
    return parseInt(idString)
}