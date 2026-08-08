import "dotenv/config";
import axios from "axios";

let start = 0n;
let current = 0n;
let end = -1n;

let rangePromise: Promise<void> | null = null;

async function initializeRange(){
    const ticket_server_url = process.env.TICKET_SERVER;
    if(!ticket_server_url) throw new Error("Ticket Server URL not found");

    const response = await axios.post(ticket_server_url, {
        timeout : 5000
    });
    console.log(response.data);
    ({start, end} = response.data);
    current = start;

    console.log(`start= ${start}\nend= ${end}\ncurrent= ${current}`);
}

export async function getNextId() {
    if(current>end){
        if(!rangePromise) rangePromise = initializeRange();

        try{
            await rangePromise;
        }
        finally{
            rangePromise = null;
        }
    }
    return current++;
}
