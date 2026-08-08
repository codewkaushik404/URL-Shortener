class BASE62{
    private static readonly CHARS: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static readonly map : Map<string, bigint> = new Map();

    private static CHARS_TO_VALUE = (()=>{
        for(let i=0;i<BASE62.CHARS.length;i++){
            BASE62.map.set(BASE62.CHARS[i]!, BigInt(i));
        }
    })();

    static encode(num: bigint): string{
        // T.C -> O(logn) S.C -> O(logn)
        if(num < 0n) throw new Error("Invalid number. Cannot encode negative numbers"); 
        if(num < 62n) return BASE62.CHARS.charAt(Number(num));

        const remainders: string[] = [];
        let rem: bigint;
        while(num > 0n){
            rem = num % 62n;
            remainders.push(BASE62.CHARS.charAt(Number(rem)));
            //There are never decimal points when dividing two bigints.
            num = num/62n;
        }
        return remainders.reverse().join("");
    }

    static decode(str: string): bigint{
        // T.C -> O(logn) S.C -> O(1)(excluding output) logn space is used to return result
        if(str.length === 0){
            throw new Error("Cannot decode empty string");
        }

        let result = 0n;
        for(const char of str){
            let num = BASE62.map.get(char);

            if(num === undefined){
                throw new Error("Invalid BASE62 character");
            }
            result = result*62n + num;
        }
        return result;
    }
}

export default BASE62;