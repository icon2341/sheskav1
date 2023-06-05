//THIS IS A TEMPROARY FILE FOR THE STRING BASED CURRENCY SYSTEM. EVENTUALLY OBJECTS OUGHT TO BE USED
export function currencyStringToNumber(currencyArray: number[]): string {
    if(currencyArray === undefined || currencyArray.length === 0) {
        return "0.00";
    }
    console.log("CURRENCY ", currencyArray, String(currencyArray[0]) + "." +  String(currencyArray[1]).padStart(2, "0"))
    return String(currencyArray[0]) + "." +  String(currencyArray[1]).padStart(2, "0");
}

export function currencyNumberToString(currencyString: string): number[] {
    if(currencyString === undefined || currencyString.length === 0) {
        return [0, 0];
    }
    const currencyArray = currencyString.split(".");
    return [Number(currencyArray[0]) ?? 0, Number(currencyArray[1]) ?? 0];
}