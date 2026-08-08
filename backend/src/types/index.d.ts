import {User} from "../database/schema/userSchema.ts";

//Hey TypeScript, take Express's existing Request type and add an optional user property whose type is User."
declare global{
    namespace Express{
        interface Request{
            user?: User;
        }
    }
}

export {}