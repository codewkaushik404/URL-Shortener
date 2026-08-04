class BASE62{
    private static readonly CHARS: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static readonly map : Map<string, number> = new Map();

    private static CHARS_TO_VALUE = (()=>{
        for(let i=0;i<BASE62.CHARS.length;i++){
            BASE62.map.set(BASE62.CHARS[i]!, i);
        }
    })();

    static encode(num: number): string{
        // T.C -> O(logn) S.C -> O(logn)
        if(num < 0) throw new Error("Invalid number. Cannot encode negative numbers"); 
        if(num < 62) return BASE62.CHARS.charAt(num);

        const remainders: string[] = [];
        let rem;
        while(num > 0){
            rem = num % 62;
            remainders.push(BASE62.CHARS.charAt(rem));
            num = Math.floor(num/62);
        }
        return remainders.reverse().join("");
    }

    static decode(str: string): number{
        // T.C -> O(logn) S.C -> O(1)(excluding output) logn space is used to return result
        if(str.length === 0){
            throw new Error("Cannot decode empty string");
        }

        let result = 0;
        for(const char of str){
            let num = BASE62.map.get(char);
            if(num === undefined){
                throw new Error("Invalid BASE62 character");
            }
            result = result*62 + num;
        }
        return result;
    }
}


