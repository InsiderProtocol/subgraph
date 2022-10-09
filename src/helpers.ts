import { BigInt } from "@graphprotocol/graph-ts";
import { Counter } from "../generated/schema";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const COUNTER_ID = "0001";

function newCounter(id: string): Counter {
    let counter = new Counter(id);
    let _zero = BigInt.fromI32(0);
    counter.stakes = _zero;
    counter.votes = _zero;
    return counter;
}

export function getCount_stakes(id: string): BigInt {
    let counter = Counter.load(id);
    if (counter) {
        let cnt: BigInt = counter.stakes as BigInt;
        counter.stakes = cnt.plus(BigInt.fromI32(1));
        counter.save();
        return cnt;
    }
    counter = newCounter(id);
    counter.stakes = BigInt.fromI32(1);
    counter.save();
    return BigInt.fromI32(0);
}


export function getCount_votes(id: string): BigInt {
    let counter = Counter.load(id);
    if (counter) {
        let cnt: BigInt = counter.votes as BigInt;
        counter.votes = cnt.plus(BigInt.fromI32(1));
        counter.save();
        return cnt;
    }
    counter = newCounter(id);
    counter.votes = BigInt.fromI32(1);
    counter.save();
    return BigInt.fromI32(0);
}
